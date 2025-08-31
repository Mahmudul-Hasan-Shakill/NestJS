// src/core_system/filesystem/dto/filesystem.dto.ts
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateFilesystemDto {
  // static fields
  @IsString() application: string;
  @IsString() node: string;
  @IsString() ipAddress: string;
  @IsString() os: string;
  @IsString() backupEnvironment: string;
  @IsString() backupType: string;
  @IsString() subClientName: string;
  @IsString() contentDetails: string;
  @IsString() backupSchedule: string;
  @IsString() scheduleType: string;
  @IsString() storagePolicy: string;
  @IsString() backupStartTime: string;
  @IsString() backupEndTime: string;
  @IsString() fullBackupSize: string;
  @IsString() retention: string;

  // common
  @IsOptional() @IsBoolean() isActive?: boolean = true;
  @IsString() makeBy: string;
  @IsOptional() @Type(() => Date) makeDate?: Date;
  @IsOptional() @IsString() editBy?: string;
  @IsOptional() @Type(() => Date) editDate?: Date;

  // dynamic
  @IsOptional()
  extras?: Record<string, any>;
}

export class UpdateFilesystemDto extends PartialType(CreateFilesystemDto) {}
