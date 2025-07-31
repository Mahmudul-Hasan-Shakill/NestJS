import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @IsNotEmpty()
  @IsString()
  roleName: string; // Use camelCase to match the entity property

  @IsNotEmpty()
  @IsString()
  hrefGui: string; // Use camelCase to match the entity property

  // @IsString()
  // hrefLabel: string; // Use camelCase to match the entity property
  @ApiProperty()
  @IsOptional()
  @IsObject()
  permissions?: Record<string, Record<string, boolean>>;

  @IsOptional()
  @IsString()
  makeBy?: string; // Use camelCase

  @IsOptional()
  makeDate?: Date; // Use camelCase

  @IsOptional()
  @IsString()
  editBy?: string; // Use camelCase

  @IsOptional()
  editDate?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // Use camelCase
}
