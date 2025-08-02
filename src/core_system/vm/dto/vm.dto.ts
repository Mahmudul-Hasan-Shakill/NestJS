import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'Category of the device (e.g. VM, Physical)' })
  @IsString()
  @IsNotEmpty()
  deviceCategory: string;

  @ApiProperty({ description: 'Hostname of the VM' })
  @IsString()
  @IsNotEmpty()
  hostname: string;

  @ApiProperty({ description: 'OS IP address' })
  @IsString()
  @IsNotEmpty()
  osIpAddress: string;

  @ApiProperty({ description: 'SSH Port (as string)' })
  @IsNotEmpty()
  sshPort: string;

  @ApiPropertyOptional({ description: 'OS subnet mask' })
  @IsOptional()
  @IsString()
  osSubnetMask?: string;

  @ApiPropertyOptional({ description: 'OS default gateway' })
  @IsOptional()
  @IsString()
  osDefaultGateway?: string;

  @ApiPropertyOptional({ description: 'Type of server (e.g. VM, Physical)' })
  @IsOptional()
  @IsString()
  serverType?: string;

  @ApiPropertyOptional({ description: 'Label of the volume' })
  @IsOptional()
  @IsString()
  volumeLabel?: string;

  @ApiPropertyOptional({ description: 'Size of the volume (in GB)' })
  @IsOptional()
  @IsNumber()
  volumeSize?: number;

  @ApiPropertyOptional({ description: 'Login protocol (e.g. SSH, RDP)' })
  @IsOptional()
  @IsString()
  loginProtocol?: string;

  @ApiPropertyOptional({ description: 'OS patch version' })
  @IsOptional()
  @IsString()
  patchVersion?: string;

  @ApiPropertyOptional({ description: 'Kernel version' })
  @IsOptional()
  @IsString()
  kernelVersion?: string;

  @ApiProperty({ description: 'Platform type' })
  @IsString()
  @IsNotEmpty()
  platform: string;

  @ApiProperty({ description: 'OS version' })
  @IsString()
  @IsNotEmpty()
  osVersion: string;

  @ApiPropertyOptional({ description: 'OS cluster name' })
  @IsOptional()
  @IsString()
  osClusterName?: string;

  @ApiPropertyOptional({ description: 'Last patching date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastPatchingDate?: Date;

  @ApiProperty({ description: 'Server status' })
  @IsString()
  @IsNotEmpty()
  serverStatus: string;

  @ApiPropertyOptional({ description: 'If the server is decommissioned' })
  @IsOptional()
  @IsBoolean()
  isDecommissioned?: boolean;

  @ApiPropertyOptional({ description: 'Total socket count' })
  @IsOptional()
  @IsNumber()
  totalSocket?: number;

  @ApiPropertyOptional({ description: 'Number of vCPU' })
  @IsOptional()
  @IsNumber()
  vcpu?: number;

  @ApiPropertyOptional({ description: 'RAM in GB' })
  @IsOptional()
  @IsNumber()
  ramGb?: number;

  @ApiPropertyOptional({ description: 'HDD size in GB' })
  @IsOptional()
  @IsNumber()
  hddSize?: number;

  @ApiPropertyOptional({ description: 'Custodian information' })
  @IsOptional()
  @IsString()
  custodianInfo?: string;

  @ApiPropertyOptional({ description: 'RDP enabled?' })
  @IsOptional()
  @IsBoolean()
  rdpEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Is management IP active?' })
  @IsOptional()
  @IsBoolean()
  managementIpActive?: boolean;

  @ApiPropertyOptional({ description: 'Backup available?' })
  @IsOptional()
  @IsBoolean()
  backupAvailable?: boolean;

  @ApiPropertyOptional({ description: 'Backup type' })
  @IsOptional()
  @IsString()
  backupType?: string;

  @ApiPropertyOptional({ description: 'Backup schedule' })
  @IsOptional()
  @IsString()
  backupSchedule?: string;

  @ApiPropertyOptional({ description: 'Filesystem backup path' })
  @IsOptional()
  @IsString()
  fileSystemBackupPath?: string;

  @ApiPropertyOptional({ description: 'Backup DB name' })
  @IsOptional()
  @IsString()
  backupDbName?: string;

  @ApiPropertyOptional({ description: 'Backup retention period' })
  @IsOptional()
  @IsString()
  backupRetention?: string;

  @ApiPropertyOptional({ description: 'Database info' })
  @IsOptional()
  @IsString()
  databaseInfo?: string;

  @ApiPropertyOptional({ description: 'Application info' })
  @IsOptional()
  @IsString()
  applicationInfo?: string;

  @ApiPropertyOptional({ description: 'Physical server info' })
  @IsOptional()
  @IsString()
  physicalServer?: string;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: 'Is VM active?' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({ description: 'Created by' })
  @IsString()
  @IsNotEmpty()
  makeBy: string;

  @ApiPropertyOptional({ description: 'Creation date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  makeDate?: Date;

  @ApiPropertyOptional({ description: 'Last edited by' })
  @IsOptional()
  @IsString()
  editBy?: string;

  @ApiPropertyOptional({ description: 'Last edited date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  editDate?: Date;

  @ApiPropertyOptional({
    type: [Number],
    description: 'Related Application IDs',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  applicationIds?: number[];

  @ApiPropertyOptional({ type: [Number], description: 'Related Database IDs' })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  databaseIds?: number[];

  @ApiPropertyOptional({ description: 'Related Physical server ID' })
  @IsOptional()
  @IsNumber()
  physicalId?: number;
}

export class UpdateVmDto extends PartialType(CreateVmDto) {}
