// src/core_system/filesystem/dto/filesystem.dto.ts
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateFilesystemDto {
  // static fields
  @IsString() @IsNotEmpty() application: string;
  @IsString() @IsNotEmpty() node: string;
  @IsString() @IsNotEmpty() ipAddress: string;
  @IsString() @IsNotEmpty() backupEnvironment: string;
  @IsString() @IsNotEmpty() backupType: string;
  @IsString() @IsNotEmpty() subClientName: string;
  @IsString() @IsNotEmpty() contentDetails: string;
  @IsString() @IsNotEmpty() backupSchedule: string;
  @IsString() @IsNotEmpty() storagePolicy: string;
  @IsString() @IsNotEmpty() backupStartTime: string;
  @IsString() @IsNotEmpty() backupEndTime: string;
  @IsString() @IsNotEmpty() fullBackupSize: string;
  @IsString() @IsNotEmpty() retention: string;

  // common
  @IsOptional() @IsBoolean() isActive?: boolean = true;
  @IsString() @IsNotEmpty() makeBy: string;
  @IsOptional() @Type(() => Date) makeDate?: Date;
  @IsOptional() @IsString() editBy?: string;
  @IsOptional() @Type(() => Date) editDate?: Date;

  // dynamic
  @IsOptional()
  extras?: Record<string, any>;
}

export class UpdateFilesystemDto extends PartialType(CreateFilesystemDto) {}
