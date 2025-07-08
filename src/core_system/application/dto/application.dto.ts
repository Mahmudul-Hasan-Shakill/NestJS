import {
  IsString,
  IsOptional,
  IsDate,
  IsEmail,
  IsArray,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateApplicationDto {
  @IsString()
  environment: string;

  @IsString()
  serviceName: string;

  @IsString()
  serviceOwner: string;

  @IsString()
  applicationCategory: string;

  @IsString()
  appModule: string;

  @IsString()
  appOwner: string;

  @IsEmail()
  appOwnerEmail: string;

  @IsOptional()
  @IsString()
  applicationUrl?: string;

  @IsOptional()
  @IsString()
  applicationCertificateDetail?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  certificationExpiryDate?: Date;

  @IsOptional()
  @IsString()
  connectedApps?: string;

  @IsOptional()
  @IsString()
  middlewareDetails?: string;

  @IsOptional()
  @IsString()
  databaseDetails?: string;

  @IsOptional()
  @IsString()
  loadBalancerDetails?: string;

  @IsOptional()
  @IsString()
  buildLanguage?: string;

  @IsOptional()
  @IsString()
  licenceType?: string;

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

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}
