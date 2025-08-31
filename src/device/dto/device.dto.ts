// src/device/dto/device.dto.ts
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateDeviceDto {
  // Identity
  @IsOptional()
  @IsString()
  deviceType?: string;

  @IsString()
  @IsNotEmpty()
  assetTag!: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  // Ownership & location
  @IsOptional()
  @IsString()
  currentOwnerPin?: string;

  @IsOptional()
  @IsString()
  currentOwnerName?: string;

  @IsOptional()
  @IsEmail()
  currentOwnerEmail?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  site?: string;

  @IsOptional()
  @IsString()
  locationNote?: string;

  // Status & lifecycle
  @IsOptional()
  @IsString()
  @IsIn(['in_use', 'in_stock', 'under_repair', 'retired', 'disposed'], {
    message:
      'status must be one of in_use, in_stock, under_repair, retired, disposed',
  })
  status?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  assignedDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  returnedDate?: Date;

  @IsOptional()
  @IsString()
  remarks?: string;

  // Technical
  @IsOptional()
  @IsString()
  hostname?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  osVersion?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  macAddress?: string;

  // Commercial & warranty
  @IsOptional()
  @IsString()
  purchaseOrderNo?: string;

  @IsOptional()
  @IsString()
  vendor?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  purchaseDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  warrantyEnd?: Date;

  // Dynamic payload (whitelisted by service)
  @IsOptional()
  @IsObject()
  extras?: Record<string, any>;

  // Common
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsString()
  makeBy!: string;

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
}

import { PartialType } from '@nestjs/mapped-types';
export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {}
