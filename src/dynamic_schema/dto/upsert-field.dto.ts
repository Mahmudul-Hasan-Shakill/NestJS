import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SelectOptionDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class UpsertFieldDto {
  @IsString()
  @IsNotEmpty()
  tableName: string; // e.g., "database_entity"

  @IsString()
  @IsNotEmpty()
  fieldName: string; // e.g., "test"

  @IsOptional()
  @IsIn(['text', 'number', 'checkbox', 'textarea', 'datetime', 'select'])
  uiType?: 'text' | 'number' | 'checkbox' | 'textarea' | 'datetime' | 'select';

  // Optional DB-ish type hint (not used for DDL in Option B)
  @IsOptional()
  @IsString()
  fieldType?: string; // e.g., "varchar"

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  helpText?: string;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsString()
  defaultValue?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectOptionDto)
  options?: SelectOptionDto[];

  @IsOptional()
  validators?: Record<string, any>;
}
