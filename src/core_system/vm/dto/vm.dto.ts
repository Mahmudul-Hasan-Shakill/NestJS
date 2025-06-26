import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateVmDto {
  @IsString()
  @IsNotEmpty()
  deviceCategory: string;

  @IsString()
  @IsNotEmpty()
  hostname: string;

  @IsString()
  @IsNotEmpty()
  osIpAddress: string;

  @IsNumber()
  @IsNotEmpty()
  sshPort: number;

  @IsOptional()
  @IsString()
  osSubnetMask?: string;

  @IsOptional()
  @IsString()
  osDefaultGateway?: string;

  @IsOptional()
  @IsString()
  serviceIp?: string;

  @IsOptional()
  @IsString()
  volumeLabel?: string;

  @IsOptional()
  @IsNumber()
  volumeSize?: number;

  @IsOptional()
  @IsString()
  loginProtocol?: string;

  @IsOptional()
  @IsString()
  patchVersion?: string;

  @IsOptional()
  @IsString()
  kernelVersion?: string;

  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsString()
  @IsNotEmpty()
  osVersion: string;

  @IsOptional()
  @IsString()
  osClusterName?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastPatchingDate?: Date;

  @IsString()
  @IsNotEmpty()
  serverStatus: string;

  @IsOptional()
  @IsBoolean()
  isDecommissioned?: boolean;

  @IsOptional()
  @IsNumber()
  totalSocket?: number;

  @IsOptional()
  @IsNumber()
  vcpu?: number;

  @IsOptional()
  @IsNumber()
  ramGb?: number;

  @IsOptional()
  @IsNumber()
  hddSize?: number;

  @IsOptional()
  @IsString()
  custodianInfo?: string;

  @IsOptional()
  @IsBoolean()
  rdpEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  managementIpActive?: boolean;

  @IsOptional()
  @IsBoolean()
  backupAvailable?: boolean;

  @IsOptional()
  @IsString()
  backupType?: string;

  @IsOptional()
  @IsString()
  backupSchedule?: string;

  @IsOptional()
  @IsString()
  fileSystemBackupPath?: string;

  @IsOptional()
  @IsString()
  backupDbName?: string;

  @IsOptional()
  @IsString()
  backupRetention?: string;

  @IsOptional()
  @IsString()
  databaseInfo?: string;

  @IsOptional()
  @IsString()
  applicationInfo?: string;

  @IsOptional()
  @IsString()
  physicalServer?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  // Common fields
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsString()
  @IsNotEmpty()
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
  applicationIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  databaseIds?: number[];

  @IsOptional()
  @IsNumber()
  physicalId?: number;
}

export class UpdateVmDto extends PartialType(CreateVmDto) {}
