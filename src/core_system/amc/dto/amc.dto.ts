import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
} from 'src/document/dto/document.dto';
import { PartialType, OmitType } from '@nestjs/mapped-types';

export class CreateAmcDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Server Model X',
  })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ description: 'Quantity of the product', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiPropertyOptional({ description: 'Serial number', example: 'SN123456789' })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiPropertyOptional({ description: 'Asset tag', example: 'AST-001' })
  @IsOptional()
  @IsString()
  assetTag?: string;

  @ApiPropertyOptional({ description: 'Is EOL/EOSL?', default: false })
  @IsOptional()
  @IsBoolean()
  isEolOrEosl?: boolean;

  @ApiPropertyOptional({
    description: 'Declared EOL/EOSL date',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  declaredEolOrEosl?: string;

  @ApiPropertyOptional({ description: 'Under AMC?', default: false })
  @IsOptional()
  @IsBoolean()
  underAmc?: boolean;

  @ApiPropertyOptional({ description: 'Support type', example: 'Hardware' })
  @IsOptional()
  @IsString()
  supportType?: string;

  @ApiPropertyOptional({ description: 'AMC start date', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  amcStart?: string;

  @ApiPropertyOptional({ description: 'AMC end date', example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  amcEnd?: string;

  @ApiPropertyOptional({
    description: 'Warranty start date',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsDateString()
  warrantyStart?: string;

  @ApiPropertyOptional({
    description: 'Warranty end date',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  warrantyEnd?: string;

  @ApiPropertyOptional({ description: 'Vendor name', example: 'ABC Solutions' })
  @IsOptional()
  @IsString()
  vendorName?: string;

  @ApiPropertyOptional({ description: 'OEM', example: 'Dell' })
  @IsOptional()
  @IsString()
  oem?: string;

  @ApiPropertyOptional({ description: 'Purchase date', example: '2023-01-01' })
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiPropertyOptional({
    description: 'Purchase order number',
    example: 'PO-001-2023',
  })
  @IsOptional()
  @IsString()
  purchaseOrderNumber?: string;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: 'Location', example: 'Server Room A' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Status', example: 'Active' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: 'Created by', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  makeBy: string;

  @ApiPropertyOptional({ description: 'Is active?', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'List of documents to associate with this AMC',
    type: [CreateDocumentDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentDto)
  documents?: CreateDocumentDto[];
}

// Omit documents from CreateAmcDto for update compatibility
export class BaseUpdateAmcDto extends PartialType(
  OmitType(CreateAmcDto, ['documents'] as const),
) {}

export class UpdateAmcDto extends BaseUpdateAmcDto {
  @IsOptional()
  @IsString()
  editBy?: string;

  @ApiPropertyOptional({
    description: 'IDs of documents to remove',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  documentIdsToRemove?: number[];

  @ApiPropertyOptional({
    description: 'Documents to update or add',
    type: [UpdateDocumentDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDocumentDto)
  documents?: UpdateDocumentDto[];
}

export class AmcQueryDto {
  @ApiPropertyOptional({ description: 'Search by product name' })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional({ description: 'Filter by status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by vendor name' })
  @IsOptional()
  @IsString()
  vendorName?: string;

  @ApiPropertyOptional({ description: 'Filter by AMC status' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  underAmc?: boolean;

  @ApiPropertyOptional({ description: 'Filter by location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
