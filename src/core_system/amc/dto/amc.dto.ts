import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAmcDto {
  @IsString()
  @IsNotEmpty()
  item: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsBoolean()
  @IsNotEmpty()
  eolOrEosl: boolean;

  @IsDateString()
  @IsNotEmpty()
  declaredEolOrEosl: Date;

  @IsBoolean()
  @IsNotEmpty()
  underAmc: boolean;

  @IsString()
  @IsNotEmpty()
  supportType: string;

  @IsDateString()
  @IsNotEmpty()
  amcStart: Date;

  @IsDateString()
  @IsNotEmpty()
  amcEnd: Date;

  @IsDateString()
  @IsNotEmpty()
  warrantyStart: Date;

  @IsDateString()
  @IsNotEmpty()
  warrantyEnd: Date;

  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @IsString()
  @IsNotEmpty()
  oem: string;

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

export class UpdateAmcDto extends PartialType(CreateAmcDto) {}
