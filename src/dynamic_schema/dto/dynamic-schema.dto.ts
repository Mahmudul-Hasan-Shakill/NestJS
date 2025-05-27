import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DynamicSchemaDto {
  @ApiProperty({ description: 'Name of the table' })
  @IsString()
  tableName: string;

  @ApiProperty({ description: 'Name of the field to add or remove' })
  @IsString()
  fieldName: string;

  @ApiPropertyOptional({ description: 'Type of the field (required for add)' })
  @IsOptional()
  @IsString()
  fieldType?: string;
}
