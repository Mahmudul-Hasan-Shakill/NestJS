import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
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
  @Transform(({ value }) => {
    if (!value || value === '') return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  })
  @IsDate({ message: 'dob must be a valid Date instance' })
  dob?: Date | null;

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
