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
