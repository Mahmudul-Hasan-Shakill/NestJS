import { CreateAutomationDto } from '../dto/automation.dto';

export function parseServerTextFile(
  content: string,
): CreateAutomationDto | null {
  const extract = (
    label: string,
    options: { number?: boolean; fromSection?: string } = {},
  ): any => {
    let scope = content;
    if (options.fromSection) {
      const sectionRegex = new RegExp(
        `=== ${options.fromSection} ===([\\s\\S]*?)(===|$)`,
        'i',
      );
      const sectionMatch = content.match(sectionRegex);
      if (sectionMatch) {
        scope = sectionMatch[1];
      }
    }

    const regex = new RegExp(`${label}:\\s*(.+)`, 'i');
    const match = scope.match(regex);
    if (!match) return options.number ? undefined : '';
    const value = match[1].trim();
    return options.number ? Number(value.replace(/[^\d.]/g, '')) : value;
  };

  const parseDate = (label: string, section?: string): Date | undefined => {
    const value = extract(label, { fromSection: section });
    return value ? new Date(value) : undefined;
  };

  const dto: CreateAutomationDto = {
    hostname: extract('Hostname'),
    ipAddress: extract('IP Address'),
    serverEnvironment: extract('Server Environment'),
    cpuPhysicalCores: extract('CPU Physical Cores', { number: true }),
    cpuVirtualCores: extract('CPU Virtual Cores', { number: true }),
    cpuModel: extract('CPU Model'),
    totalRam: extract('Total RAM'),
    totalDiskSize: extract('Total Disk Size'),
    osVersion: extract('OS Version'),
    kernelVersion: extract('Kernel Version'),
    serverPlatform: extract('Server Platform'),
    serialNumber: extract('Serial Number'),
    sshPort: extract('SSH Port\\(s\\)'),
    sockets: extract('Socket\\(s\\)', { number: true }),
    lastPatchInstalled: parseDate('Last Patch Installed'),
    systemUptime: extract('System Uptime'),

    // Falcon Info (scoped)
    falconInstalled: extract('Falcon Sensor', {
      fromSection: 'Security Products',
    }),
    falconVersion: extract('Version', { fromSection: 'Security Products' }),
    falconInstallDate: parseDate('Falcon Install Date', 'Security Products'),
    falconStatus: extract('Service Status', {
      fromSection: 'Security Products',
    }),

    // Qualys Info (scoped)
    qualysInstalled: extract('Qualys Cloud Agent', {
      fromSection: 'Security Products',
    }),
    qualysVersion:
      extract('Version', { fromSection: 'Security Products' }).split('\n')[1] ||
      '',
    qualysInstallDate: parseDate('Qualys Install Date', 'Security Products'),
    qualysStatus:
      extract('Service Status', { fromSection: 'Security Products' }).split(
        '\n',
      )[1] || '',

    // Disk Info
    diskTotalSize: extract('Total size', { fromSection: 'Disk Information' }),
    diskUsed: extract('Used space', { fromSection: 'Disk Information' }),
    diskFree: extract('Free space', { fromSection: 'Disk Information' }),

    // Network Info
    subnetMask: extract('Subnet Mask', { fromSection: 'Network Details' }),
    gateway: extract('Gateway', { fromSection: 'Network Details' }),
    networkIp: extract('IP', { fromSection: 'Network Details' }),

    // NTP Info
    ntpService: extract('NTP service', { fromSection: 'NTP Status' }),
    ntpServers: extract('NTP Servers', { fromSection: 'NTP Status' }),
    ntpSyncSource: extract('Current Sync Source', {
      fromSection: 'NTP Status',
    }),

    // User Info
    systemUsersCount: extract('System Users Count', {
      number: true,
      fromSection: 'User and Group Information',
    }),
    sudoUsers: extract('Users with sudo access', {
      fromSection: 'User and Group Information',
    }),

    // Meta
    remarks: '',
    isActive: true,
    makeBy: '',
    makeDate: new Date(),

    // Relations
    appIds: [],
    dbIds: [],
  };

  // Minimal required validation
  if (!dto.hostname || !dto.ipAddress) return null;

  return dto;
}
