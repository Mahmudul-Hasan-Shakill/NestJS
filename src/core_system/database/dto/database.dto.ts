import {
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  IsNotEmpty,
  IsArray,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateDatabaseDto {
  @IsString()
  @IsNotEmpty()
  dbName: string;

  @IsString()
  @IsNotEmpty()
  virtualIp: string;

  @IsOptional()
  @IsString()
  additionalIp?: string;

  @IsString()
  @IsNotEmpty()
  dbInstance: string;

  @IsString()
  @IsNotEmpty()
  dbVersion: string;

  @IsString()
  @IsNotEmpty()
  rdbmsType: string;

  @IsNumber()
  @IsNotEmpty()
  dbPort: number;

  @IsString()
  @IsNotEmpty()
  dbStatus: string;

  @IsString()
  @IsNotEmpty()
  dbType: string;

  @IsEmail()
  dbOwnerEmail: string;

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

export class UpdateDatabaseDto extends PartialType(CreateDatabaseDto) {}
