import {
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

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

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  vmIds?: number[];
}

export class UpdateDatabaseDto extends PartialType(CreateDatabaseDto) {}
