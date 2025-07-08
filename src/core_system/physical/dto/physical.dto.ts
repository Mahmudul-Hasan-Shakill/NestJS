import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDate,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePhysicalDto {
  @IsString()
  deviceCategory: string;

  @IsString()
  hostname: string;

  @IsString()
  primaryIdentificationName: string;

  @IsString()
  makeOrBrand: string;

  @IsString()
  serverModel: string;

  @IsString()
  serviceTag: string;

  @IsString()
  enclosureIp: string;

  @IsString()
  managementIp: string;

  @IsString()
  serviceIp: string;

  @IsString()
  zone: string;

  @IsString()
  os: string;

  @IsString()
  osVersion: string;

  @IsOptional()
  @IsString()
  hypervisorEOSL?: string;

  @IsOptional()
  @IsString()
  serverEOSL?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  purchasedDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  installationDate?: Date;

  @IsOptional()
  @IsString()
  purchasedFrom?: string;

  @IsOptional()
  @IsString()
  workOrderNumber?: string;

  @IsOptional()
  @IsString()
  warranty?: string;

  @IsOptional()
  @IsBoolean()
  underAMC?: boolean;

  @IsOptional()
  @IsString()
  floorName?: string;

  @IsOptional()
  @IsString()
  rack?: string;

  @IsOptional()
  @IsString()
  row?: string;

  @IsOptional()
  @IsString()
  uInformation?: string;

  @IsOptional()
  @IsNumber()
  numberOfNICCards?: number;

  @IsOptional()
  @IsNumber()
  numberOfNICPorts?: number;

  @IsOptional()
  @IsNumber()
  numberOfHBACards?: number;

  @IsOptional()
  @IsNumber()
  numberOfHBAPorts?: number;

  @IsOptional()
  @IsNumber()
  numberOfSockets?: number;

  @IsOptional()
  @IsNumber()
  coresPerSocket?: number;

  @IsOptional()
  @IsBoolean()
  isDecommissioned?: boolean;

  @IsOptional()
  @IsNumber()
  physicalCores?: number;

  @IsOptional()
  @IsNumber()
  physicalRamGb?: number;

  @IsOptional()
  @IsNumber()
  physicalDiskSize?: number;

  @IsOptional()
  @IsNumber()
  numberOfDisks?: number;

  @IsOptional()
  @IsString()
  diskType?: string;

  @IsOptional()
  @IsString()
  nicFirmwareVersion?: string;

  @IsOptional()
  @IsString()
  sanFirmwareVersion?: string;

  @IsOptional()
  @IsString()
  chasis?: string;

  @IsOptional()
  @IsBoolean()
  dualConnectivity?: boolean;

  @IsOptional()
  @IsString()
  nicCapacity?: string;

  @IsOptional()
  @IsString()
  switchUplink?: string;

  @IsOptional()
  @IsString()
  serverUplink?: string;

  @IsOptional()
  @IsString()
  uplinkPort?: string;

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
  vmIds?: number[];
}

export class UpdatePhysicalDto extends PartialType(CreatePhysicalDto) {}
