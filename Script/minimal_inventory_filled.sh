#!/bin/bash

OUTPUT_FILE="/opt/inventory/$(hostname -s)_$(hostname -I | awk '{print $1}')_$(date +%Y%m%d).txt"
mkdir -p /opt/inventory
> "$OUTPUT_FILE"

# Function to check if command exists
command_exists() { command -v "$1" >/dev/null 2>&1; }

# Convert to GiB function
convert_to_gi() {
    echo "$1" | awk '{printf "%.0f", $1 / 1024 / 1024 / 1024}'
}

echo "=== Server Basic Information ===" >> "$OUTPUT_FILE"
echo "Hostname: $(hostname -f)" >> "$OUTPUT_FILE"

IP_ADDR=$(hostname -I | awk '{print $1}')
echo "IP Address: $IP_ADDR" >> "$OUTPUT_FILE"
echo "Server Environment: Test Server" >> "$OUTPUT_FILE"

PHYSICAL_CORES=$(lscpu | awk '/^Core\(s\) per socket:/ {cps=$4} /^Socket\(s\):/ {print cps*$2}')
VIRTUAL_CORES=$(lscpu | awk '/^CPU\(s\):/ {print $2}')
echo "CPU Physical Cores: ${PHYSICAL_CORES:-Unavailable}" >> "$OUTPUT_FILE"
echo "CPU Virtual Cores: ${VIRTUAL_CORES:-Unavailable}" >> "$OUTPUT_FILE"

CPU_MODEL=$(grep 'model name' /proc/cpuinfo | head -1 | cut -d':' -f2 | xargs)
echo "CPU Model: ${CPU_MODEL:-Unavailable}" >> "$OUTPUT_FILE"

TOTAL_RAM=$(free -b | awk '/^Mem:/ {print $2}')
echo "Total RAM: $(convert_to_gi $TOTAL_RAM)" Gi >> "$OUTPUT_FILE"

TOTAL_DISK=$(lsblk -b -dn -o SIZE | awk '{sum += $1} END {print sum}')
echo "Total Disk Size: $(convert_to_gi $TOTAL_DISK) Gi" >> "$OUTPUT_FILE"

if [ -f /etc/os-release ]; then
    OS_VERSION=$(grep PRETTY_NAME /etc/os-release | cut -d'"' -f2)
else
    OS_VERSION="Unavailable"
fi
echo "OS Version: $OS_VERSION" >> "$OUTPUT_FILE"
echo "Kernel Version: $(uname -r)" >> "$OUTPUT_FILE"

PLATFORM=$(hostnamectl | awk -F: '/Virtualization/ {print $2}' | xargs)
[ -z "$PLATFORM" ] && PLATFORM="Unknown"
echo "Server Platform: $PLATFORM Virtual Machine" >> "$OUTPUT_FILE"

echo "Serial Number: N/A" >> "$OUTPUT_FILE"

SSH_PORTS=$(grep -E '^Port' /etc/ssh/sshd_config 2>/dev/null | awk '{print $2}' | paste -sd ',' -)
[ -z "$SSH_PORTS" ] && SSH_PORTS="22"
echo "SSH Port(s): $SSH_PORTS" >> "$OUTPUT_FILE"

SOCKETS=$(lscpu | awk '/Socket\(s\)/ {print $2}')
echo "Socket(s): ${SOCKETS:-Unavailable}" >> "$OUTPUT_FILE"

LAST_PATCH=$(rpm -qa --last | head -1 | awk '{$1=""; print $0}' | xargs -I{} date -d "{}" --iso-8601=seconds)
echo "Last Patch Installed: ${LAST_PATCH:-Unavailable}" >> "$OUTPUT_FILE"

UPTIME=$(uptime -s)
echo "System Uptime: $(uptime -p) (since $UPTIME)" >> "$OUTPUT_FILE"

echo -e "\n=== Security Products ===" >> "$OUTPUT_FILE"

if rpm -q falcon-sensor >/dev/null 2>&1; then
    echo "Falcon Sensor: Installed" >> "$OUTPUT_FILE"
    echo "Version: $(rpm -q --qf '%{VERSION}-%{RELEASE}' falcon-sensor)" >> "$OUTPUT_FILE"
    echo "Install Date: $(rpm -q --qf '%{INSTALLTIME:date}' falcon-sensor | xargs -I{} date -d "{}" --iso-8601=seconds)" >> "$OUTPUT_FILE"
    echo "Service Status: $(systemctl is-active falcon-sensor)" >> "$OUTPUT_FILE"
else
    echo "Falcon Sensor: Not installed" >> "$OUTPUT_FILE"
    echo "Version:" >> "$OUTPUT_FILE"
    echo "Install Date:" >> "$OUTPUT_FILE"
    echo "Service Status:" >> "$OUTPUT_FILE"
fi

if rpm -q qualys-cloud-agent >/dev/null 2>&1; then
    echo "Qualys Cloud Agent: Installed" >> "$OUTPUT_FILE"
    echo "Version: $(rpm -q --qf '%{VERSION}-%{RELEASE}' qualys-cloud-agent)" >> "$OUTPUT_FILE"
    echo "Install Date: $(rpm -q --qf '%{INSTALLTIME:date}' qualys-cloud-agent | xargs -I{} date -d "{}" --iso-8601=seconds)" >> "$OUTPUT_FILE"
    echo "Service Status: $(systemctl is-active qualys-cloud-agent)" >> "$OUTPUT_FILE"
else
    echo "Qualys Cloud Agent: Not installed" >> "$OUTPUT_FILE"
    echo "Version:" >> "$OUTPUT_FILE"
    echo "Install Date:" >> "$OUTPUT_FILE"
    echo "Service Status:" >> "$OUTPUT_FILE"
fi

echo -e "\n=== Disk Information ===" >> "$OUTPUT_FILE"
df -B1 --output=size,used,avail / | tail -1 | while read -r size used avail; do
    echo "Total size: $(convert_to_gi $size) Gi" >> "$OUTPUT_FILE"
    echo "Used space: $(convert_to_gi $used) Gi" >> "$OUTPUT_FILE"
    echo "Free space: $(convert_to_gi $avail) Gi" >> "$OUTPUT_FILE"
done

echo -e "\n=== Network Details ===" >> "$OUTPUT_FILE"
MASK=$(ip -o -f inet addr show | awk '/scope global/ {print $4}' | cut -d/ -f2 | head -n1)
GATEWAY=$(ip route | awk '/default/ {print $3}')
echo "Subnet Mask: ${MASK:-Unavailable}" >> "$OUTPUT_FILE"
echo "Gateway: ${GATEWAY:-Unavailable}" >> "$OUTPUT_FILE"
echo "IP: $IP_ADDR" >> "$OUTPUT_FILE"

echo -e "\n=== NTP Status ===" >> "$OUTPUT_FILE"
NTP_STATE=$(systemctl is-active chronyd || echo "unknown")
echo "NTP service: $NTP_STATE" >> "$OUTPUT_FILE"
NTP_SERVERS=$(grep ^server /etc/chrony.conf 2>/dev/null | awk '{print $2}' | paste -sd ', ')
echo "NTP Servers: ${NTP_SERVERS:-Unavailable}" >> "$OUTPUT_FILE"
SYNC_SOURCE=$(chronyc sources 2>/dev/null | awk '/^\^\*/ {print $2}')
echo "Current Sync Source: ${SYNC_SOURCE:-Unavailable}" >> "$OUTPUT_FILE"

echo -e "\n=== User and Group Information ===" >> "$OUTPUT_FILE"
USER_COUNT=$(awk -F: '$7 !~ /nologin|false/ {count++} END {print count}' /etc/passwd)
echo "System Users Count: $USER_COUNT" >> "$OUTPUT_FILE"
SUDO_USERS=$(getent group sudo | cut -d: -f4)
echo "Users with sudo access: ${SUDO_USERS:-None}" >> "$OUTPUT_FILE"

echo "Inventory report generated at: $OUTPUT_FILE"
