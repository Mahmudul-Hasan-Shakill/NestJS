// import {
//   IsString,
//   IsOptional,
//   IsBoolean,
//   IsNumber,
//   IsDate,
//   IsArray,
//   IsNotEmpty,
// } from 'class-validator';
// import { Type } from 'class-transformer';
// import { PartialType } from '@nestjs/mapped-types';

// export class CreatePhysicalDto {
//   @IsString()
//   deviceCategory: string;

//   @IsString()
//   hostname: string;

//   @IsString()
//   primaryIdentificationName: string;

//   @IsString()
//   makeOrBrand: string;

//   @IsString()
//   serverModel: string;

//   @IsString()
//   serviceTag: string;

//   @IsString()
//   enclosureIp: string;

//   @IsString()
//   managementIp: string;

//   @IsString()
//   serviceIp: string;

//   @IsString()
//   zone: string;

//   @IsString()
//   os: string;

//   @IsString()
//   osVersion: string;

//   @IsOptional()
//   @IsString()
//   hypervisorEOSL?: string;

//   @IsOptional()
//   @IsString()
//   serverEOSL?: string;

//   @IsOptional()
//   @Type(() => Date)
//   @IsDate()
//   purchasedDate?: Date;

//   @IsOptional()
//   @Type(() => Date)
//   @IsDate()
//   installationDate?: Date;

//   @IsOptional()
//   @IsString()
//   purchasedFrom?: string;

//   @IsOptional()
//   @IsString()
//   workOrderNumber?: string;

//   @IsOptional()
//   @IsString()
//   warranty?: string;

//   @IsOptional()
//   @IsBoolean()
//   underAMC?: boolean;

//   @IsOptional()
//   @IsString()
//   floorName?: string;

//   @IsOptional()
//   @IsString()
//   rack?: string;

//   @IsOptional()
//   @IsString()
//   row?: string;

//   @IsOptional()
//   @IsString()
//   uInformation?: string;

//   @IsOptional()
//   @IsNumber()
//   numberOfNICCards?: number;

//   @IsOptional()
//   @IsNumber()
//   numberOfNICPorts?: number;

//   @IsOptional()
//   @IsNumber()
//   numberOfHBACards?: number;

//   @IsOptional()
//   @IsNumber()
//   numberOfHBAPorts?: number;

//   @IsOptional()
//   @IsNumber()
//   numberOfSockets?: number;

//   @IsOptional()
//   @IsNumber()
//   coresPerSocket?: number;

//   @IsOptional()
//   @IsBoolean()
//   isDecommissioned?: boolean;

//   @IsOptional()
//   @IsNumber()
//   physicalCores?: number;

//   @IsOptional()
//   @IsNumber()
//   physicalRamGb?: number;

//   @IsOptional()
//   @IsNumber()
//   physicalDiskSize?: number;

//   @IsOptional()
//   @IsNumber()
//   numberOfDisks?: number;

//   @IsOptional()
//   @IsString()
//   diskType?: string;

//   @IsOptional()
//   @IsString()
//   nicFirmwareVersion?: string;

//   @IsOptional()
//   @IsString()
//   sanFirmwareVersion?: string;

//   @IsOptional()
//   @IsString()
//   chasis?: string;

//   @IsOptional()
//   @IsBoolean()
//   dualConnectivity?: boolean;

//   @IsOptional()
//   @IsString()
//   nicCapacity?: string;

//   @IsOptional()
//   @IsString()
//   switchUplink?: string;

//   @IsOptional()
//   @IsString()
//   serverUplink?: string;

//   @IsOptional()
//   @IsString()
//   uplinkPort?: string;

//   @IsOptional()
//   @IsString()
//   remarks?: string;

//   // Common fields
//   @IsOptional()
//   @IsBoolean()
//   isActive?: boolean = true;

//   @IsString()
//   @IsNotEmpty()
//   makeBy: string;

//   @IsOptional()
//   @Type(() => Date)
//   @IsDate()
//   makeDate?: Date;

//   @IsOptional()
//   @IsString()
//   editBy?: string;

//   @IsOptional()
//   @Type(() => Date)
//   @IsDate()
//   editDate?: Date;

//   @IsOptional()
//   @IsArray()
//   @IsNumber({}, { each: true })
//   vmIds?: number[];
// }

// export class UpdatePhysicalDto extends PartialType(CreatePhysicalDto) {}

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
  // Device Category
  @IsString()
  deviceCategory: string;

  @IsOptional()
  @IsString()
  makeOrBrand: string;

  @IsOptional()
  @IsString()
  serverModel: string;

  @IsOptional()
  @IsString()
  enclosureIp?: string;

  @IsOptional()
  @IsString()
  dcZone?: string;

  @IsOptional()
  @IsString()
  drZone?: string;

  @IsOptional()
  @IsString()
  rack?: string;

  @IsOptional()
  @IsString()
  floorName?: string;

  @IsOptional()
  @IsString()
  dimensionMm?: string;

  @IsOptional()
  @IsNumber()
  dimensionRackU?: number;

  @IsOptional()
  @IsString()
  uInformation?: string;

  @IsOptional()
  numberOfNICPorts?: string;

  @IsOptional()
  numberOfHBAPorts?: string;

  // Server Detail
  @IsString()
  hostname: string;

  @IsOptional()
  @IsString()
  serviceIp?: string;

  @IsOptional()
  @IsString()
  servicePort?: string;

  @IsOptional()
  @IsString()
  loginProtocol?: string;

  @IsOptional()
  @IsString()
  serverStatus?: string;

  @IsOptional()
  @IsString()
  kernelVersion?: string;

  @IsOptional()
  @IsString()
  serverType?: string;

  @IsOptional()
  @IsString()
  serverMacAddress?: string;

  @IsOptional()
  @IsNumber()
  numberOfSockets?: number;

  @IsOptional()
  @IsNumber()
  coresPerSocket?: number;

  @IsOptional()
  @IsNumber()
  totalVcpu?: number;

  @IsOptional()
  @IsNumber()
  physicalRamGb?: number;

  @IsOptional()
  @IsString()
  custodianInformation?: string;

  // OS Information
  @IsString()
  os: string;

  @IsOptional()
  @IsString()
  osClusterName?: string;

  @IsOptional()
  @IsString()
  latestPatchVersion?: string;

  // Network Detail
  @IsOptional()
  @IsString()
  osIpAddress?: string;

  @IsOptional()
  @IsString()
  subnetMask?: string;

  @IsOptional()
  @IsString()
  defaultGateway?: string;

  @IsOptional()
  @IsString()
  serviceVlan?: string;

  @IsOptional()
  @IsString()
  onmIpGateway?: string;

  @IsOptional()
  @IsString()
  onmIpMask?: string;

  @IsOptional()
  @IsString()
  onmVlan?: string;

  @IsOptional()
  @IsString()
  primaryDns?: string;

  @IsOptional()
  @IsString()
  secondaryDns?: string;

  @IsOptional()
  dualConnectivity?: string;

  @IsOptional()
  @IsString()
  nicCapacity?: string;

  @IsOptional()
  @IsBoolean()
  rdpEnabled?: boolean;

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
  managementIp?: string;

  // DB Information
  @IsOptional()
  @IsString()
  dbName?: string;

  @IsOptional()
  @IsString()
  dbVirtualIp?: string;

  @IsOptional()
  @IsString()
  dbAdditionalIp?: string;

  @IsOptional()
  @IsString()
  dbInstance?: string;

  @IsOptional()
  @IsString()
  dbVersion?: string;

  @IsOptional()
  @IsString()
  rdmsType?: string;

  @IsOptional()
  @IsString()
  dbPort?: string;

  @IsOptional()
  @IsString()
  dbStatus?: string;

  @IsOptional()
  @IsString()
  dbType?: string;

  @IsOptional()
  @IsString()
  dbOwnerEmail?: string;

  // Application Information
  @IsOptional()
  @IsString()
  environmentCategory?: string;

  @IsOptional()
  @IsString()
  serviceName?: string;

  @IsOptional()
  @IsString()
  middlewareDetails?: string;

  @IsOptional()
  @IsString()
  loadBalancerDetails?: string;

  // OEM, AMC & Vendor Information
  @IsOptional()
  @IsString()
  oem?: string;

  @IsOptional()
  @IsString()
  maintenanceVendor?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  eolDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  eosDate?: Date;

  // Backup Information
  @IsOptional()
  backupAvailable?: string;

  @IsOptional()
  @IsString()
  backupType?: string;

  @IsOptional()
  @IsString()
  backupSchedule?: string;

  // Power Detail
  @IsOptional()
  @IsString()
  powerConnectivity?: string;

  @IsOptional()
  @IsString()
  powerRedundancy?: string;

  @IsOptional()
  @IsString()
  powerRedundancyMethodology?: string;

  @IsOptional()
  @IsString()
  inputPowerType?: string;

  @IsOptional()
  @IsString()
  powerPhase?: string;

  @IsOptional()
  @IsString()
  powerConsumptionVa?: string;

  // Monitoring Status
  @IsOptional()
  @IsBoolean()
  infraMonitoring?: boolean;

  @IsOptional()
  @IsBoolean()
  appMonitoring?: boolean;

  // Remarks
  @IsOptional()
  @IsString()
  remarks?: string;

  // Common fields
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

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
