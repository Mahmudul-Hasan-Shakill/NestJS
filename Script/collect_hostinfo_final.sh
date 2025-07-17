#!/bin/bash

# Main inventory script combining both functionalities
OUTPUT_FILE="/opt/inventory/$(hostname -s)_$(hostname -I | awk '{print $1}')_$(date +%Y%m%d).txt"

# Create inventory directory if it doesn't exist
mkdir -p /opt/inventory

# Clear previous output file if exists
> "$OUTPUT_FILE"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get version of a software
get_version() {
    software=$1
    version=""
    
    case $software in
        mysql)
            if command_exists mysql; then
                version=$(mysql --version 2>/dev/null | awk '{print $3}')
            fi
            ;;
        oracle)
            if [ -f /etc/oratab ]; then
                # Extract version from ORACLE_HOME path
                version=$(grep -vE '^#|^$' /etc/oratab | grep -v '+ASM' | cut -d: -f2 | sort | uniq | head -1 | awk -F'/' '{print $(NF-1)}')
                # If version extraction fails, try another method
                if [ -z "$version" ]; then
                    version=$(grep -vE '^#|^$' /etc/oratab | grep -v '+ASM' | cut -d: -f2 | sort | uniq | head -1 | xargs -I{} {}/bin/oracle -version 2>&1 | grep -oP 'Version \K[0-9.]+')
                fi
            fi
            ;;
        httpd)
            if command_exists httpd; then
                version=$(httpd -v 2>/dev/null | grep "Server version" | awk -F'/' '{print $2}')
            fi
            ;;
        nginx)
            if command_exists nginx; then
                version=$(nginx -v 2>&1 | awk -F'/' '{print $2}')
            fi
            ;;
        python)
            if command_exists python; then
                version=$(python --version 2>&1 | awk '{print $2}')
            fi
            ;;
        falcon-sensor)
            if rpm -q falcon-sensor >/dev/null 2>&1 || dpkg -l falcon-sensor >/dev/null 2>&1; then
                version=$(rpm -q --queryformat '%{VERSION}-%{RELEASE}' falcon-sensor 2>/dev/null || \
                         dpkg-query -W -f='${Version}' falcon-sensor 2>/dev/null)
            fi
            ;;
        qualys-cloud-agent)
            if rpm -q qualys-cloud-agent >/dev/null 2>&1 || dpkg -l qualys-cloud-agent >/dev/null 2>&1; then
                version=$(rpm -q --queryformat '%{VERSION}-%{RELEASE}' qualys-cloud-agent 2>/dev/null || \
                         dpkg-query -W -f='${Version}' qualys-cloud-agent 2>/dev/null)
            fi
            ;;
        *)
            version=""
            ;;
    esac
    
    echo "$version"
}

# Function to determine server environment based on IP and hostname
get_server_environment() {
    ip_addr=$1
    hostname=$2
    
    if echo "$ip_addr" | grep -q '^172\.'; then
        printf "Test Server"
    elif echo "$ip_addr" | grep -q '^10\.5\.' && ! echo "$hostname" | grep -qi 'dr'; then
        printf "DC Production"
    elif echo "$hostname" | grep -qi 'dr'; then
        printf "DR"
    else
        printf "Unknown"
    fi
}

# Function to detect server platform and get serial number - IMPROVED KVM DETECTION
get_server_platform() {
    platform="Unknown"
    serial="N/A"
    
    # First check hostnamectl for virtualization type
    if command_exists hostnamectl; then
        virtualization=$(hostnamectl | grep "Virtualization:" | awk '{print $2}')
        if [ -n "$virtualization" ]; then
            case $virtualization in
                kvm|KVM)
                    platform="KVM Virtual Machine"
                    ;;
                vmware|VMware)
                    platform="VMware Virtual Machine"
                    ;;
                oracle|VirtualBox)
                    platform="VirtualBox Virtual Machine"
                    ;;
            esac
        fi
    fi
    
    # If hostnamectl didn't identify, fall back to DMI/dmidecode
    if [ "$platform" = "Unknown" ]; then
        if [ -f /sys/class/dmi/id/product_name ]; then
            product_name=$(cat /sys/class/dmi/id/product_name)
            case $product_name in
                *VMware*) platform="VMware Virtual Machine" ;;
                *KVM*)    platform="KVM Virtual Machine" ;;
                *VirtualBox*) platform="VirtualBox Virtual Machine" ;;
                *)
                    platform="Physical Server ($product_name)"
                    serial=$(cat /sys/class/dmi/id/product_serial 2>/dev/null || \
                            (command_exists dmidecode && dmidecode -s system-serial-number 2>/dev/null))
                    ;;
            esac
        elif command_exists dmidecode; then
            virt_check=$(dmidecode -s system-manufacturer 2>/dev/null)
            case "$virt_check" in
                *VMware*) platform="VMware Virtual Machine" ;;
                *innotek*|*Oracle*) platform="VirtualBox Virtual Machine" ;;
                *QEMU*|*oVirt*|*"Red Hat"*) platform="KVM Virtual Machine" ;;
                *)
                    platform="Physical Server ($virt_check)"
                    serial=$(dmidecode -s system-serial-number 2>/dev/null)
                    ;;
            esac
        fi
    fi
    
    printf "%s|%s" "$platform" "$serial"
}

# Function to get CPU core information with virtualization adjustment
get_cpu_info() {
    platform_info=$(get_server_platform | cut -d'|' -f1)
    
    case $platform_info in
        *VMware*|*KVM*|*Virtual*)
            # For virtual platforms, show half of total CPUs as physical cores
            total_cpus=$(lscpu 2>/dev/null | grep '^CPU(s):' | awk '{print $2}')
            if [ -n "$total_cpus" ]; then
                physical_cores=$((total_cpus / 2))
                logical_cores=$total_cpus
            else
                physical_cores=1
                logical_cores=2
            fi
            printf "%s|%s|%s" "$physical_cores" "$logical_cores" "$platform_info"
            ;;
        *)
            # For physical servers, show actual cores from lscpu
            sockets=$(lscpu 2>/dev/null | grep 'Socket(s)' | awk '{print $2}')
            cores_per_socket=$(lscpu 2>/dev/null | grep 'Core(s) per socket' | awk '{print $4}')
            threads_per_core=$(lscpu 2>/dev/null | grep 'Thread(s) per core' | awk '{print $4}')
            physical_cores=$((sockets * cores_per_socket))
            logical_cores=$((physical_cores * threads_per_core))
            printf "%s|%s|%s" "$physical_cores" "$logical_cores" "$platform_info"
            ;;
    esac
}

# Function to get NTP status
get_ntp_status() {
    printf "\n=== NTP Status ===\n" >> "$OUTPUT_FILE"
    
    if command_exists timedatectl; then
        timedatectl | grep -E 'NTP service|NTP synchronized' >> "$OUTPUT_FILE"
    else
        printf "NTP service information not available (timedatectl not found)\n" >> "$OUTPUT_FILE"
    fi
    
    # Get NTP servers
    printf "\nNTP Servers:\n" >> "$OUTPUT_FILE"
    if [ -f /etc/chrony.conf ]; then
        grep -E '^server' /etc/chrony.conf | awk '{print $2}' >> "$OUTPUT_FILE"
    elif [ -f /etc/ntp.conf ]; then
        grep -E '^server' /etc/ntp.conf | awk '{print $2}' >> "$OUTPUT_FILE"
    else
        printf "No NTP configuration file found\n" >> "$OUTPUT_FILE"
    fi
    
    # Get current sync source
    printf "\nCurrent Sync Source:\n" >> "$OUTPUT_FILE"
    if command_exists chronyc; then
        chronyc sources 2>/dev/null | grep '^\^\*' | awk '{print $2}' >> "$OUTPUT_FILE"
        printf "\nDetailed NTP Sources:\n" >> "$OUTPUT_FILE"
        chronyc sources 2>/dev/null >> "$OUTPUT_FILE"
    elif command_exists ntpq; then
        ntpq -p 2>/dev/null | grep '^\*' | awk '{print $1}' | tr -d '*' >> "$OUTPUT_FILE"
        printf "\nDetailed NTP Sources:\n" >> "$OUTPUT_FILE"
        ntpq -p 2>/dev/null >> "$OUTPUT_FILE"
    else
        printf "No NTP client tools available\n" >> "$OUTPUT_FILE"
    fi
}

# Function to check version files
check_version_file() {
    local dir="$1"
    local file="$2"
    local pattern="$3"
    
    if [ -f "$dir/$file" ]; then
        if [ -n "$pattern" ]; then
            grep -oP "$pattern" "$dir/$file" | head -1
        else
            head -1 "$dir/$file"
        fi
    fi
}

# Enhanced function to detect software versions with improved Oracle detection
detect_version() {
    local name="$1"
    local path="$2"
    
    case "$name" in
        nginx)
            if [ -f "$path/sbin/nginx" ]; then
                "$path/sbin/nginx" -v 2>&1 | awk -F'/' '{print $2}'
            elif [ -f "$path/nginx" ]; then
                "$path/nginx" -v 2>&1 | awk -F'/' '{print $2}'
            fi
            ;;
        apache|httpd)
            if [ -f "$path/bin/httpd" ]; then
                "$path/bin/httpd" -v | grep -oP 'Apache/\K[0-9.]+'
            elif [ -f "$path/apache2" ]; then
                "$path/apache2" -v | grep -oP 'Apache/\K[0-9.]+'
            fi
            ;;
        tomcat)
            if [ -f "$path/bin/version.sh" ]; then
                "$path/bin/version.sh" 2>/dev/null | grep -oP 'Server version:\s*Apache Tomcat/\K[0-9.]+' || \
                "$path/bin/version.sh" 2>/dev/null | grep -oP 'Server version:\s*\K[0-9.]+'
            elif [ -f "$path/bin/catalina.sh" ]; then
                "$path/bin/catalina.sh" version 2>/dev/null | grep -oP 'Server version:\s*Apache Tomcat/\K[0-9.]+' || \
                "$path/bin/catalina.sh" version 2>/dev/null | grep -oP 'Server version:\s*\K[0-9.]+'
            else
                check_version_file "$path/RELEASE-NOTES" "Apache Tomcat Version \K[0-9.]+"
            fi
            ;;
        weblogic)
            if [ -f "$path/server/lib/weblogic.jar" ]; then
                java -cp "$path/server/lib/weblogic.jar" weblogic.version 2>&1 | grep -oP 'WebLogic Server \K[0-9.]+'
            fi
            ;;
        websphere)
            if [ -f "$path/bin/versionInfo.sh" ]; then
                "$path/bin/versionInfo.sh" 2>/dev/null | grep -oP 'Version\s*:\s*\K[0-9.]+' || \
                "$path/bin/versionInfo.sh" 2>/dev/null | grep -oP 'Version\s*=\s*\K[0-9.]+'
            elif [ -f "$path/AppServer/bin/versionInfo.sh" ]; then
                "$path/AppServer/bin/versionInfo.sh" 2>/dev/null | grep -oP 'Version\s*:\s*\K[0-9.]+' || \
                "$path/AppServer/bin/versionInfo.sh" 2>/dev/null | grep -oP 'Version\s*=\s*\K[0-9.]+'
            elif [ -f "$path/properties/version/IBM_Product.props" ]; then
                check_version_file "$path/properties/version/IBM_Product.props" "version=\K[0-9.]+"
            elif [ -f "$path/bin/wsadmin.sh" ]; then
                "$path/bin/wsadmin.sh" -lang jython -c "print AdminControl.getAttribute(AdminControl.queryNames('WebSphere:*,type=Server'), 'platformVersion'); AdminControl.disconnect()" 2>/dev/null | grep -E '[0-9]+\.[0-9]+\.[0-9]+'
            fi
            ;;
        jboss|wildfly)
            if [ -f "$path/bin/version.sh" ]; then
                "$path/bin/version.sh" 2>/dev/null | grep -oP 'JBoss [A-Za-z-]+\s*\K[0-9.]+'
            else
                check_version_file "$path/standalone/configuration/version.properties" "version=\K[0-9.]+" ||
                check_version_file "$path/.installation/installation-manifest" "wildfly-core-\K[0-9.]+"
            fi
            ;;
        mysql)
            if [ -f "$path/bin/mysql" ]; then
                "$path/bin/mysql" --version | grep -oP '[0-9]+\.[0-9]+\.[0-9]+'
            elif [ -f "$path/bin/mysqld" ]; then
                "$path/bin/mysqld" --version | grep -oP '[0-9]+\.[0-9]+\.[0-9]+'
            fi
            ;;
        oracle)
            # First try to get version from binary
            if [ -f "$path/bin/oracle" ]; then
                version=$("$path/bin/oracle" -version 2>/dev/null | grep -oP 'Version \K[0-9.]+')
            fi
            
            # If binary method fails, try to extract version from path
            if [ -z "$version" ]; then
                # Look for version pattern in path (e.g., /u01/app/19.3.0/g)
                version=$(echo "$path" | grep -oP '[0-9]{1,2}\.[0-9]{1,2}(\.[0-9]{1,2})?' | head -1)
            fi
            
            echo "$version"
            ;;
        postgresql)
            if [ -f "$path/bin/psql" ]; then
                "$path/bin/psql" --version | grep -oP '[0-9]+\.[0-9]+\.[0-9]+'
            elif [ -f "$path/bin/postgres" ]; then
                "$path/bin/postgres" --version | grep -oP '[0-9]+\.[0-9]+\.[0-9]+'
            fi
            ;;
        mongodb)
            if [ -f "$path/bin/mongod" ]; then
                "$path/bin/mongod" --version | grep -oP 'db version v\K[0-9.]+'
            fi
            ;;
        *)
            echo ""
            ;;
    esac
}

# Function to get native packages
get_native_packages() {
    echo -e "\n=========================================" >> "$OUTPUT_FILE"
    echo "NATIVE PACKAGES (Name | Version)" >> "$OUTPUT_FILE"
    echo "=========================================" >> "$OUTPUT_FILE"
    
    if command -v rpm >/dev/null 2>&1; then
        rpm -qa --queryformat '%-50{NAME} %{VERSION}-%{RELEASE}\n' | sort >> "$OUTPUT_FILE"
    elif command -v dpkg >/dev/null 2>&1; then
        dpkg-query -W -f='${Package}\t${Version}\n' | sort | column -t -s $'\t' >> "$OUTPUT_FILE"
    else
        echo "No supported package manager found (rpm/dpkg)" >> "$OUTPUT_FILE"
    fi
}

# Enhanced function to get system software versions
get_system_software() {
    declare -A sys_software
    
    # Important system software
    sys_software["openssl"]="openssl version | awk '{print $2}'"
    sys_software["curl"]="curl --version | head -1 | awk '{print \$2}'"
    sys_software["kernel"]="uname -r"
    sys_software["python"]="python --version 2>&1 | awk '{print \$2}'"
    sys_software["java"]="java -version 2>&1 | head -1 | awk -F'\"' '{print \$2}'"
    sys_software["perl"]="perl -e 'print \$];'"
    sys_software["bash"]="echo \$BASH_VERSION"
    sys_software["git"]="git --version | awk '{print \$3}'"
    sys_software["docker"]="docker --version | awk '{print \$3}' | tr -d ','"
    
    echo -e "\n=========================================" >> "$OUTPUT_FILE"
    echo "SYSTEM SOFTWARE (Name | Version)" >> "$OUTPUT_FILE"
    echo "=========================================" >> "$OUTPUT_FILE"
    
    for software in "${!sys_software[@]}"; do
        if command -v "$software" >/dev/null 2>&1 || [ "$software" = "kernel" ]; then
            version=$(eval "${sys_software[$software]}")
            printf "%-15s %s\n" "$software" "$version" >> "$OUTPUT_FILE"
        else
            printf "%-15s %s\n" "$software" "Not installed" >> "$OUTPUT_FILE"
        fi
    done
}

# Function to check running processes for database detection
check_running_processes() {
    local -n results_ref=$1
    
    # Database processes to check
    declare -A db_processes
    db_processes["mysql"]="mysqld"
    db_processes["oracle"]="oracle"
    db_processes["postgresql"]="postgres"
    db_processes["mongodb"]="mongod"
    
    # Get all processes
    process_list=$(ps -eo pid,cmd)
    
    # Check each database type
    for db in "${!db_processes[@]}"; do
        process_name="${db_processes[$db]}"
        
        # Find processes matching the executable name
        while read -r pid cmd; do
            # Skip if pid is empty
            [ -z "$pid" ] && continue
            
            # Check if this is the main process (not a child/grep)
            if [[ "$cmd" == *"$process_name"* && ! "$cmd" =~ "grep" ]]; then
                # Get executable path
                exe_path=$(readlink -f /proc/$pid/exe 2>/dev/null)
                
                # If we found the executable, get its directory
                if [ -n "$exe_path" ]; then
                    install_dir=$(dirname "$(dirname "$exe_path")")
                    
                    # Detect version
                    version=$(detect_version "$db" "$install_dir")
                    
                    # Add to results if we found a version
                    if [ -n "$version" ]; then
                        results_ref["DATABASES"]+="$db|$install_dir|$version\n"
                    fi
                fi
            fi
        done <<< "$(echo "$process_list" | grep -i "$process_name")"
    done
}

# Enhanced function to search for custom installations with improved database detection
search_custom_installations() {
    local categories=("WEB SERVERS" "APP SERVERS" "MIDDLEWARE" "DATABASES")
    declare -A results
    
    # Initialize results
    for category in "${categories[@]}"; do
        results["$category"]=""
    done
    
    # Define search directories (excluding system mounts)
    local search_dirs=("/opt" "/home" "/app" "/wasapp" "/oracle" "/usr/local" "/IBM" "/WebSphere" "/was" "/apps" "/u01" "/u02" "/mysql" "/postgres" "/mongodb")
    
    # Find potential installation directories
    local exclude_dirs="proc|sys|run|dev|var|etc|boot|tmp"
    local found_dirs=$(find "${search_dirs[@]}" -maxdepth 5 -type d 2>/dev/null | grep -vE "/($exclude_dirs)(/|$)")
    
    # Search for specific software patterns
    while read -r dir; do
        # Check for web servers
        if [[ "$dir" =~ /nginx ]] || { [ -f "$dir/sbin/nginx" ] || [ -f "$dir/nginx" ]; }; then
            version=$(detect_version "nginx" "$dir")
            [ -n "$version" ] && results["WEB SERVERS"]+="nginx|$dir|$version\n"
        elif [[ "$dir" =~ /httpd ]] || [[ "$dir" =~ /apache ]] || 
             { [ -f "$dir/bin/httpd" ] || [ -f "$dir/apache2" ]; }; then
            version=$(detect_version "apache" "$dir")
            [ -n "$version" ] && results["WEB SERVERS"]+="apache|$dir|$version\n"
        elif [[ "$dir" =~ /lampp ]] || [[ "$dir" =~ /xampp ]]; then
            version=$(detect_version "apache" "$dir")
            [ -n "$version" ] && results["WEB SERVERS"]+="lampp|$dir|$version\n"
        fi
        
        # Check for app servers
        if [[ "$dir" =~ /tomcat ]] || [ -f "$dir/bin/version.sh" ] || [ -f "$dir/bin/catalina.sh" ]; then
            version=$(detect_version "tomcat" "$dir")
            [ -n "$version" ] && results["APP SERVERS"]+="tomcat|$dir|$version\n"
        fi
        
        # Check for middleware
        if [[ "$dir" =~ /weblogic ]] || [ -f "$dir/server/lib/weblogic.jar" ]; then
            version=$(detect_version "weblogic" "$dir")
            [ -n "$version" ] && results["MIDDLEWARE"]+="weblogic|$dir|$version\n"
        elif [[ "$dir" =~ /websphere ]] || [[ "$dir" =~ /WebSphere ]] || 
             [ -f "$dir/bin/versionInfo.sh" ] || [ -f "$dir/AppServer/bin/versionInfo.sh" ] ||
             [ -f "$dir/bin/wsadmin.sh" ] || [ -f "$dir/profiles" ]; then
            version=$(detect_version "websphere" "$dir")
            [ -n "$version" ] && results["MIDDLEWARE"]+="websphere|$dir|$version\n"
        elif [[ "$dir" =~ /jboss ]] || [[ "$dir" =~ /wildfly ]] || 
             [ -f "$dir/bin/standalone.sh" ] || [ -f "$dir/standalone/configuration/version.properties" ]; then
            version=$(detect_version "jboss" "$dir")
            [ -n "$version" ] && results["MIDDLEWARE"]+="jboss|$dir|$version\n"
        fi
        
        # Check for databases
        if [[ "$dir" =~ /mysql ]] || { [ -f "$dir/bin/mysql" ] && [ -f "$dir/bin/mysqld" ]; } || 
           [[ "$dir" =~ /mariadb ]] || { [ -f "$dir/bin/mysql" ] && [ -f "$dir/bin/mysqld" ]; }; then
            version=$(detect_version "mysql" "$dir")
            [ -n "$version" ] && results["DATABASES"]+="mysql|$dir|$version\n"
        elif [[ "$dir" =~ /oracle ]] || [ -f "$dir/bin/oracle" ] || 
             [ -f "$dir/bin/sqlplus" ] || [[ "$dir" =~ /app/oracle/product ]]; then
            version=$(detect_version "oracle" "$dir")
            [ -n "$version" ] && results["DATABASES"]+="oracle|$dir|$version\n"
        elif [[ "$dir" =~ /postgres ]] || { [ -f "$dir/bin/psql" ] && [ -f "$dir/bin/postgres" ]; } || 
             [[ "$dir" =~ /pgsql ]]; then
            version=$(detect_version "postgresql" "$dir")
            [ -n "$version" ] && results["DATABASES"]+="postgresql|$dir|$version\n"
        elif [[ "$dir" =~ /mongo ]] || [ -f "$dir/bin/mongod" ] || [[ "$dir" =~ /mongodb ]]; then
            version=$(detect_version "mongodb" "$dir")
            [ -n "$version" ] && results["DATABASES"]+="mongodb|$dir|$version\n"
        fi
        
        # Check for version files in the directory
        for version_file in version.sh version.txt versionInfo.sh; do
            if [ -f "$dir/$version_file" ]; then
                software_name=$(basename "$dir")
                version=$(head -1 "$dir/$version_file" 2>/dev/null)
                [ -n "$version" ] && results["UNCATEGORIZED"]+="$software_name|$dir|$version\n"
            fi
        done
        
        # Check for JAR files that might indicate software
        for jar_file in "$dir"/*.jar; do
            if [[ -f "$jar_file" ]]; then
                jar_name=$(basename "$jar_file" .jar)
                if [[ "$jar_name" =~ weblogic ]]; then
                    version=$(java -cp "$jar_file" weblogic.version 2>&1 | grep -oP 'WebLogic Server \K[0-9.]+')
                    [ -n "$version" ] && results["MIDDLEWARE"]+="weblogic|$dir|$version\n"
                fi
            fi
        done
        
    done <<< "$found_dirs"
    
    # Also check for globally installed commands
    check_global_commands results
    
    # Check running processes for databases
    check_running_processes results
    
    # Output the results
    for category in "${categories[@]}"; do
        echo -e "\n=========================================" >> "$OUTPUT_FILE"
        echo "$category (Name | Installed | Version | Path)" >> "$OUTPUT_FILE"
        echo "=========================================" >> "$OUTPUT_FILE"
        
        if [ -z "${results["$category"]}" ]; then
            echo "No $category found" >> "$OUTPUT_FILE"
        else
            # Sort and format the results
            echo -e "${results["$category"]}" | grep -v '^$' | sort -u | while IFS='|' read -r name path version; do
                printf "%-12s %-10s %-12s %s\n" "$name" "Yes" "$version" "$path" >> "$OUTPUT_FILE"
            done
        fi
    done
}

# Function to check globally installed commands
check_global_commands() {
    local -n results_ref=$1
    
    # Check web servers
    if command -v nginx >/dev/null 2>&1; then
        version=$(nginx -v 2>&1 | awk -F'/' '{print $2}')
        path=$(dirname "$(command -v nginx)")
        results_ref["WEB SERVERS"]+="nginx|$path|$version\n"
    fi
    
    if command -v httpd >/dev/null 2>&1; then
        version=$(httpd -v 2>&1 | grep -oP 'Apache/\K[0-9.]+')
        path=$(dirname "$(command -v httpd)")
        results_ref["WEB SERVERS"]+="apache|$path|$version\n"
    elif command -v apache2 >/dev/null 2>&1; then
        version=$(apache2 -v 2>&1 | grep -oP 'Apache/\K[0-9.]+')
        path=$(dirname "$(command -v apache2)")
        results_ref["WEB SERVERS"]+="apache|$path|$version\n"
    fi
    
    # Check databases
    if command -v mysql >/dev/null 2>&1; then
        version=$(mysql --version 2>&1 | grep -oP '[0-9]+\.[0-9]+\.[0-9]+')
        path=$(dirname "$(command -v mysql)")
        results_ref["DATABASES"]+="mysql|$path|$version\n"
    fi
    
    if command -v psql >/dev/null 2>&1; then
        version=$(psql --version 2>&1 | grep -oP '[0-9]+\.[0-9]+\.[0-9]+')
        path=$(dirname "$(command -v psql)")
        results_ref["DATABASES"]+="postgresql|$path|$version\n"
    fi
    
    if command -v mongod >/dev/null 2>&1; then
        version=$(mongod --version 2>&1 | grep -oP 'db version v\K[0-9.]+')
        path=$(dirname "$(command -v mongod)")
        results_ref["DATABASES"]+="mongodb|$path|$version\n"
    fi
}

# Function to get server basic information
get_server_basic_info() {
    printf "=== Server Basic Information ===\n" >> "$OUTPUT_FILE"
    
    # Hostname
    printf "Hostname: %s\n" "$(hostname -f)" >> "$OUTPUT_FILE"
    
    # IP Address
    ip_addr=$(hostname -I | awk '{print $1}')
    printf "IP Address: %s\n" "$ip_addr" >> "$OUTPUT_FILE"
    
    # Server Environment
    server_env=$(get_server_environment "$ip_addr" "$HOSTNAME")
    printf "Server Environment: %s\n" "$server_env" >> "$OUTPUT_FILE"
    
    # CPU Info with virtualization adjustment
    cpu_info=$(get_cpu_info)
    physical_cores=$(echo "$cpu_info" | cut -d'|' -f1)
    logical_cores=$(echo "$cpu_info" | cut -d'|' -f2)
    platform_info=$(echo "$cpu_info" | cut -d'|' -f3)
    
    printf "CPU Physical Cores: %s\n" "$physical_cores" >> "$OUTPUT_FILE"
    printf "CPU Virtual Cores: %s\n" "$logical_cores" >> "$OUTPUT_FILE"
    printf "CPU Model: %s\n" "$(grep "model name" /proc/cpuinfo 2>/dev/null | head -1 | cut -d ":" -f 2 | sed 's/^[ \t]*//')" >> "$OUTPUT_FILE"
    
    # RAM
    total_ram=$(free -h 2>/dev/null | grep "Mem:" | awk '{print $2}')
    printf "Total RAM: %s\n" "${total_ram:-"Not available"}" >> "$OUTPUT_FILE"
    
    # Total disk size
    total_disk=$(lsblk -b --output SIZE -d 2>/dev/null | awk '{s+=$1} END {print s/1024/1024/1024 " GB"}')
    printf "Total Disk Size: %s\n" "${total_disk:-"Not available"}" >> "$OUTPUT_FILE"
    
    # OS Version
    if [ -f /etc/oracle-release ]; then
        printf "OS Version: %s\n" "$(cat /etc/oracle-release)" >> "$OUTPUT_FILE"
    elif [ -f /etc/redhat-release ]; then
        printf "OS Version: %s\n" "$(cat /etc/redhat-release)" >> "$OUTPUT_FILE"
    elif [ -f /etc/os-release ]; then
        printf "OS Version: %s\n" "$(grep "PRETTY_NAME" /etc/os-release | cut -d '"' -f 2)" >> "$OUTPUT_FILE"
    else
        printf "OS Version: Not available\n" >> "$OUTPUT_FILE"
    fi
    
    # Kernel Version
    printf "Kernel Version: %s\n" "$(uname -r)" >> "$OUTPUT_FILE"
    
    # Server Platform and Serial
    platform_serial=$(get_server_platform)
    platform=$(echo "$platform_serial" | cut -d'|' -f1)
    serial=$(echo "$platform_serial" | cut -d'|' -f2)
    
    printf "Server Platform: %s\n" "$platform" >> "$OUTPUT_FILE"
    printf "Serial Number: %s\n" "$serial" >> "$OUTPUT_FILE"
    
    # SSH Port (all ports in one line)
    ssh_ports=$(grep -E "^Port" /etc/ssh/sshd_config 2>/dev/null | awk '{print $2}' | tr '\n' ',' | sed 's/,$//')
    [ -z "$ssh_ports" ] && ssh_ports="22"
    printf "SSH Port(s): %s\n" "$ssh_ports" >> "$OUTPUT_FILE"
    
    # Last patching date
    if command_exists rpm; then
        last_patch=$(rpm -qa --last 2>/dev/null | head -1 | awk '{print $1="", $0}')
        printf "Last Patch Installed: %s\n" "${last_patch# }" >> "$OUTPUT_FILE"
    else
        printf "Last Patch Installed: rpm command not available\n" >> "$OUTPUT_FILE"
    fi
    
    # Uptime
    printf "System Uptime: %s\n" "$(uptime -p 2>/dev/null || uptime)" >> "$OUTPUT_FILE"
    
    printf "\n" >> "$OUTPUT_FILE"
}

# Function to get security product information
get_security_products() {
    printf "\n=== Security Products ===\n" >> "$OUTPUT_FILE"
    
    # Falcon Sensor
    if rpm -q falcon-sensor >/dev/null 2>&1 || dpkg -l falcon-sensor >/dev/null 2>&1; then
        install_date=$(rpm -q --queryformat '%{INSTALLTIME:date}' falcon-sensor 2>/dev/null || \
                     dpkg-query -W -f='${Install-Date}\n' falcon-sensor 2>/dev/null)
        status=$(systemctl is-active falcon-sensor 2>/dev/null || printf "Not running")
        version=$(get_version falcon-sensor)
        printf "Falcon Sensor: Installed\n" >> "$OUTPUT_FILE"
        printf "  Version: %s\n" "${version:-Unknown}" >> "$OUTPUT_FILE"
        printf "  Install Date: %s\n" "${install_date:-Unknown}" >> "$OUTPUT_FILE"
        printf "  Service Status: %s\n" "$status" >> "$OUTPUT_FILE"
    else
        printf "Falcon Sensor: Not installed\n" >> "$OUTPUT_FILE"
    fi
    
    # Qualys Cloud Agent
    if rpm -q qualys-cloud-agent >/dev/null 2>&1 || dpkg -l qualys-cloud-agent >/dev/null 2>&1; then
        install_date=$(rpm -q --queryformat '%{INSTALLTIME:date}' qualys-cloud-agent 2>/dev/null || \
                     dpkg-query -W -f='${Install-Date}\n' qualys-cloud-agent 2>/dev/null)
        status=$(systemctl is-active qualys-cloud-agent 2>/dev/null || printf "Not running")
        version=$(get_version qualys-cloud-agent)
        printf "Qualys Cloud Agent: Installed\n" >> "$OUTPUT_FILE"
        printf "  Version: %s\n" "${version:-Unknown}" >> "$OUTPUT_FILE"
        printf "  Install Date: %s\n" "${install_date:-Unknown}" >> "$OUTPUT_FILE"
        printf "  Service Status: %s\n" "$status" >> "$OUTPUT_FILE"
    else
        printf "Qualys Cloud Agent: Not installed\n" >> "$OUTPUT_FILE"
    fi
    
    printf "\n" >> "$OUTPUT_FILE"
}

# Function to get service type based on running processes
get_service_type() {
    db_services="oracle mysql postgres mongodb sqlserver db2 redis cassandra"
    app_services="java nginx httpd tomcat weblogic websphere postfix sendmail dovecot wildfly jboss node python ruby php"
    
    service_type=""
    specific_services=""
    has_db=false
    has_app=false
    
    # Check for database services
    for service in $db_services; do
        if pgrep -x "$service" >/dev/null || ps aux 2>/dev/null | grep -v grep | grep -q "$service"; then
            has_db=true
            version=$(get_version "$service")
            specific_services="$specific_services$service${version:+:$version},"
        fi
    done
    
    # Check for application services
    for service in $app_services; do
        if pgrep -x "$service" >/dev/null || ps aux 2>/dev/null | grep -v grep | grep -q "$service"; then
            has_app=true
            version=$(get_version "$service")
            specific_services="$specific_services$service${version:+:$version},"
        fi
    done
    
    # Determine service type
    if $has_db && $has_app; then
        service_type="Application with Database Server"
    elif $has_db; then
        service_type="DB"
    elif $has_app; then
        service_type="Application Server"
    fi
    
    # Remove trailing comma
    specific_services=$(echo "$specific_services" | sed 's/,$//')
    
    printf "%s|%s" "$service_type" "$specific_services"
}

# Function to get service information (excluding OS services)
get_service_info() {
    printf "\n=== Service Information ===\n" >> "$OUTPUT_FILE"
    service_info=$(get_service_type)
    service_type=$(echo "$service_info" | cut -d '|' -f 1)
    specific_services=$(echo "$service_info" | cut -d '|' -f 2)
    
    printf "Service Type: %s\n" "${service_type:-Not Identified}" >> "$OUTPUT_FILE"
    printf "Running Services: %s\n" "${specific_services:-None detected}" >> "$OUTPUT_FILE"
    
    # List of active non-OS services
    printf "\nActive Non-OS Services:\n" >> "$OUTPUT_FILE"
    if command_exists systemctl; then
        systemctl list-units --type=service --state=running 2>/dev/null | grep -v "loaded units listed" | \
        grep -vE 'auditd|crond|dbus|firewalld|gssproxy|irqbalance|lm_sensors|lvm2|mdmonitor|NetworkManager|polkit|rsyslog|sshd|systemd|tuned|chronyd|ntpd' >> "$OUTPUT_FILE"
    elif command_exists service; then
        service --status-all 2>/dev/null | grep "+" | \
        grep -vE 'auditd|crond|dbus|firewalld|gssproxy|irqbalance|lm_sensors|lvm2|mdmonitor|NetworkManager|polkit|rsyslog|sshd|systemd|tuned|chronyd|ntpd' >> "$OUTPUT_FILE"
    else
        printf "Could not determine active services (systemctl/service not available)\n" >> "$OUTPUT_FILE"
    fi
    
    printf "\n" >> "$OUTPUT_FILE"
}

# Function to get disk information
get_disk_info() {
    printf "\n=== Disk Information ===\n" >> "$OUTPUT_FILE"
    # Mount points
    printf "Mount Points:\n" >> "$OUTPUT_FILE"
    df -hTP 2>/dev/null | grep -v "^Filesystem" | awk '{print $1,$2,$3,$4,$5,$6,$7}' >> "$OUTPUT_FILE"
    
    # Disk usage
    printf "\nDisk Usage:\n" >> "$OUTPUT_FILE"
    df -h 2>/dev/null >> "$OUTPUT_FILE"
    
    printf "\n" >> "$OUTPUT_FILE"
}

# Function to get network information
get_network_details() {
    printf "\n=== Network Details ===\n" >> "$OUTPUT_FILE"
    
    # Subnet Mask
    subnet_mask=$(ip -o -f inet addr show 2>/dev/null | awk '/scope global/ {print $4}' | cut -d'/' -f2 | head -1)
    printf "Subnet Mask: %s\n" "${subnet_mask:-"Not available"}" >> "$OUTPUT_FILE"
    
    # Gateway
    gateway=$(ip route 2>/dev/null | grep default | awk '{print $3}')
    printf "Gateway: %s\n" "${gateway:-"Not available"}" >> "$OUTPUT_FILE"
    
    # Network interfaces
    printf "\nNetwork Interfaces:\n" >> "$OUTPUT_FILE"
    ip -br addr show 2>/dev/null >> "$OUTPUT_FILE"
    
    # Listening ports
    printf "\nListening Ports:\n" >> "$OUTPUT_FILE"
    ss -tuln 2>/dev/null | grep -E '^tcp|^udp' >> "$OUTPUT_FILE"
    
    printf "\n" >> "$OUTPUT_FILE"
}

# Function to get user and group information
get_user_group_info() {
    printf "\n=== User and Group Information ===\n" >> "$OUTPUT_FILE"
    
    # /etc/passwd output
    printf "/etc/passwd contents:\n" >> "$OUTPUT_FILE"
    cat /etc/passwd 2>/dev/null >> "$OUTPUT_FILE"
    
    # Current user crontab
    printf "\nCurrent User Crontab:\n" >> "$OUTPUT_FILE"
    crontab -l 2>/dev/null >> "$OUTPUT_FILE" || printf "No crontab for current user\n" >> "$OUTPUT_FILE"
    
    # System users count
    printf "\nSystem Users Count: %s\n" "$(grep -vE '^#|^$|nologin$|false$' /etc/passwd 2>/dev/null | wc -l)" >> "$OUTPUT_FILE"
    
    # Sudoers
    printf "\nSudoers configuration:\n" >> "$OUTPUT_FILE"
    if [ -f /etc/sudoers ]; then
        grep -v "^#" /etc/sudoers | grep -v "^Defaults" | grep -v "^$" >> "$OUTPUT_FILE"
    fi
    
    # Users with sudo access
    printf "\nUsers with sudo access:\n" >> "$OUTPUT_FILE"
    grep -Po '^sudo.+:\K.*$' /etc/group 2>/dev/null >> "$OUTPUT_FILE"
    
    printf "\n" >> "$OUTPUT_FILE"
}

# Function to get system resource utilization
get_resource_utilization() {
    printf "\n=== Resource Utilization ===\n" >> "$OUTPUT_FILE"
    
    # CPU Utilization
    printf "CPU Utilization:\n" >> "$OUTPUT_FILE"
    printf "  %s\n" "$(top -bn1 2>/dev/null | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}')" >> "$OUTPUT_FILE"
    printf "  Load Average: %s\n" "$(uptime 2>/dev/null | awk -F'load average: ' '{print $2}')" >> "$OUTPUT_FILE"
    
    # Memory Utilization
    printf "\nMemory Utilization:\n" >> "$OUTPUT_FILE"
    free -h 2>/dev/null >> "$OUTPUT_FILE"
    
    # Top processes by CPU
    printf "\nTop Processes by CPU:\n" >> "$OUTPUT_FILE"
    ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu 2>/dev/null | head -n 10 >> "$OUTPUT_FILE"
    
    # Top processes by Memory
    printf "\nTop Processes by Memory:\n" >> "$OUTPUT_FILE"
    ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem 2>/dev/null | head -n 10 >> "$OUTPUT_FILE"
    
    printf "\n" >> "$OUTPUT_FILE"
}

# Main execution
{
    echo "System Inventory Report - $(date)"
    echo "========================================="
    
    # Get server basic information
    get_server_basic_info
    
    # Get native packages
    get_native_packages
    
    # Search for custom installations
    search_custom_installations
    
    # Get system software versions
    get_system_software
    
    # Get service information
    get_service_info
    
    # Get security products information
    get_security_products
    
    # Get disk information
    get_disk_info
    
    # Get network details
    get_network_details
    
    # Get NTP status
    get_ntp_status
    
    # Get user and group information
    get_user_group_info
    
    # Get resource utilization
    get_resource_utilization
    
    echo -e "\nInventory completed. Results saved to $OUTPUT_FILE"
} >> "$OUTPUT_FILE"

# Display the output file path
echo "Inventory report generated at: $OUTPUT_FILE"
