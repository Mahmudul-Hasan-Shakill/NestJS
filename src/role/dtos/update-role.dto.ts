// src/dto/update-role.dto.ts
import {
  IsString,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

// Define the DTO for each item in hrefGui[]
class HrefGuiDto {
  @IsString()
  hrefGui: string;

  @IsString()
  hrefLabel: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  editBy: string;

  @IsOptional()
  editDate: Date;
}

export class UpdateRoleDto {
  @IsString()
  roleName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HrefGuiDto)
  hrefGui: HrefGuiDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HrefGuiDto)
  hrefLabel: HrefGuiDto[];
}
