import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class RoleDto {
  @IsNotEmpty()
  @IsString()
  roleName: string; // Use camelCase to match the entity property

  @IsNotEmpty()
  @IsString()
  hrefGui: string; // Use camelCase to match the entity property

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
