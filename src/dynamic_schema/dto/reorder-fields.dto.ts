import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SortItemDto {
  @IsString()
  @IsNotEmpty()
  fieldName: string;

  @IsInt()
  @Min(0)
  sortOrder: number;
}

export class ReorderFieldsDto {
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortItemDto)
  items: SortItemDto[];
}
