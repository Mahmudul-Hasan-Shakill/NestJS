import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAutomationDto {
  @IsOptional()
  @IsString()
  hostname?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  serverEnvironment?: string;

  @IsOptional()
  @IsNumber()
  cpuPhysicalCores?: number;

  @IsOptional()
  @IsNumber()
  cpuVirtualCores?: number;

  @IsOptional()
  @IsString()
  cpuModel?: string;

  @IsOptional()
  @IsString()
  totalRam?: string;

  @IsOptional()
  @IsString()
  totalDiskSize?: string;

  @IsOptional()
  @IsString()
  osVersion?: string;

  @IsOptional()
  @IsString()
  kernelVersion?: string;

  @IsOptional()
  @IsString()
  serverPlatform?: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsString()
  sshPort?: string;

  @IsOptional()
  @IsNumber()
  sockets?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastPatchInstalled?: Date;

  @IsOptional()
  @IsString()
  systemUptime?: string;

  // Falcon Sensor
  @IsOptional()
  @IsString()
  falconInstalled?: string;

  @IsOptional()
  @IsString()
  falconVersion?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  falconInstallDate?: Date;

  @IsOptional()
  @IsString()
  falconStatus?: string;

  // Qualys
  @IsOptional()
  @IsString()
  qualysInstalled?: string;

  @IsOptional()
  @IsString()
  qualysVersion?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  qualysInstallDate?: Date;

  @IsOptional()
  @IsString()
  qualysStatus?: string;

  // Disk Info
  @IsOptional()
  @IsString()
  diskTotalSize?: string;

  @IsOptional()
  @IsString()
  diskUsed?: string;

  @IsOptional()
  @IsString()
  diskFree?: string;

  // Network Info
  @IsOptional()
  @IsString()
  subnetMask?: string;

  @IsOptional()
  @IsString()
  gateway?: string;

  @IsOptional()
  @IsString()
  networkIp?: string;

  // NTP Info
  @IsOptional()
  @IsString()
  ntpService?: string;

  @IsOptional()
  @IsString()
  ntpServers?: string;

  @IsOptional()
  @IsString()
  ntpSyncSource?: string;

  // User Info
  @IsOptional()
  @IsNumber()
  systemUsersCount?: number;

  @IsOptional()
  @IsString()
  sudoUsers?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsString()
  makeBy: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  makeDate?: Date;

  @IsOptional()
  @IsString()
  editBy?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  editDate?: Date;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  appIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  dbIds?: number[];
}

export class UpdateAutomationDto extends PartialType(CreateAutomationDto) {}
