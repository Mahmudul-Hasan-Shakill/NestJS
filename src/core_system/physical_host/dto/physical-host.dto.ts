import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePhysicalHostDto {
  @ApiProperty({ description: 'Cluster name if applicable', required: false })
  @IsOptional()
  @IsString()
  clusterName?: string;

  @ApiProperty({ description: 'Hostname (FQDN or short name)' })
  @IsString()
  @IsNotEmpty()
  hostname: string;

  @ApiProperty({ description: 'Primary IP address' })
  @IsString()
  @IsNotEmpty()
  physicalIp: string;

  @ApiProperty({ description: 'Data center or rack location', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Server brand (Dell, HPE, Lenovo, etc.)',
    required: false,
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ description: 'Server model (e.g., R740xd)', required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ description: 'Manufacturer serial number', required: false })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiProperty({
    description: 'Internal asset tracking number',
    required: false,
  })
  @IsOptional()
  @IsString()
  assetTag?: string;

  @ApiProperty({
    description: 'CPU type/model (e.g., Intel Xeon Gold 6338)',
    required: false,
  })
  @IsOptional()
  @IsString()
  cpuModel?: string;

  @ApiProperty({ description: 'Total physical cores', required: false })
  @IsOptional()
  @IsNumber()
  cpuCoresTotal?: number;

  @ApiProperty({ description: 'Total installed memory in GB', required: false })
  @IsOptional()
  @IsNumber()
  ramTotalGb?: number;

  @ApiProperty({ description: 'Total disk capacity in TB', required: false })
  @IsOptional()
  @IsNumber()
  storageTotalTb?: number;

  @ApiProperty({
    description: 'Storage type (SSD, HDD, NVMe, Mixed)',
    required: false,
  })
  @IsOptional()
  @IsString()
  storageType?: string;

  @ApiProperty({
    description: 'Power supply configuration (Dual/Single)',
    required: false,
  })
  @IsOptional()
  @IsString()
  powerSupply?: string;

  @ApiProperty({
    description: 'Count/type of network interfaces',
    required: false,
  })
  @IsOptional()
  @IsString()
  networkPorts?: string;

  @ApiProperty({ description: 'Installed OS or hypervisor', required: false })
  @IsOptional()
  @IsString()
  osInstalled?: string;

  @ApiProperty({ description: 'OS version or kernel', required: false })
  @IsOptional()
  @IsString()
  osVersion?: string;

  @ApiProperty({
    description: 'Hypervisor type if applicable',
    required: false,
  })
  @IsOptional()
  @IsString()
  hypervisorType?: string;

  @ApiProperty({
    description: 'Hypervisor version if applicable',
    required: false,
  })
  @IsOptional()
  @IsString()
  hypervisorVersion?: string;

  @ApiProperty({
    description: 'Server status (Active/Inactive/Retired)',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'End of hardware warranty date',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  warrantyExpiry?: Date;

  @ApiProperty({
    description: 'Team responsible for this server',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignedToTeam?: string;

  @ApiProperty({ description: 'Creator name' })
  @IsString()
  @IsNotEmpty()
  makeBy: string;

  @ApiProperty({ description: 'Active status', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}

export class UpdatePhysicalHostDto extends PartialType(CreatePhysicalHostDto) {
  @ApiProperty({ description: 'Creator name' })
  @IsString()
  @IsNotEmpty()
  editBy: string;
}
