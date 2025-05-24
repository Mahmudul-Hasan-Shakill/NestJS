import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateServerDto {
  @IsString()
  @IsNotEmpty()
  ip: string;

  @IsString()
  @IsNotEmpty()
  hostname: string;

  @IsString()
  @IsNotEmpty()
  serverPlatform: string;

  @IsString()
  @IsNotEmpty()
  platformCategory: string;

  @IsString()
  @IsNotEmpty()
  zone: string;

  @IsString()
  @IsNotEmpty()
  applicationName: string;

  @IsString()
  @IsNotEmpty()
  applicationOwner: string;

  @IsString()
  @IsNotEmpty()
  osVersion: string;

  @IsNumber()
  @IsNotEmpty()
  core: number;

  @IsNumber()
  @IsNotEmpty()
  memory: number;

  @IsNumber()
  @IsNotEmpty()
  storage: number;

  @IsNumber()
  @IsNotEmpty()
  socket: number;

  @IsNumber()
  @IsNotEmpty()
  sshPort: number;

  @IsString()
  @IsNotEmpty()
  systemState: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsString()
  @IsNotEmpty()
  makeBy: string;

  @IsOptional()
  makeDate?: Date;

  @IsOptional()
  editBy?: string;

  @IsOptional()
  editDate?: Date;
}

export class UpdateServerDto extends PartialType(CreateServerDto) {}
