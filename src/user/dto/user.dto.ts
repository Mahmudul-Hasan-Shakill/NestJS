import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  pin: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  division: string;

  @IsString()
  department: string;

  @IsString()
  unit: string;

  @IsOptional()
  dob?: Date;

  @IsOptional()
  @IsString()
  marital?: string;

  @IsOptional()
  @IsString()
  nid?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  @IsNotEmpty()
  userRole: string;

  @IsString()
  @IsNotEmpty()
  makeBy: string;

  @IsOptional()
  makeDate?: Date;

  @IsOptional()
  @IsString()
  editBy?: string;

  @IsOptional()
  editDate?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsBoolean()
  isReset: boolean;

  @IsOptional()
  @IsBoolean()
  isLogin?: boolean;

  @IsOptional()
  @IsBoolean()
  isLocked?: boolean;

  @IsOptional()
  loginAttempts?: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string;
}
