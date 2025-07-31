import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ description: 'File name', example: 'Contract_2024.pdf' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: 'Stored file path',
    example: 'uploads/amc/uuid-contract-2024.pdf',
  })
  @IsString()
  @IsNotEmpty()
  storedFilePath: string;

  @ApiPropertyOptional({ description: 'MIME type', example: 'application/pdf' })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({ description: 'File size in bytes', example: 102400 })
  @IsOptional()
  @IsNumber()
  size?: number;

  @ApiPropertyOptional({ description: 'Uploaded by', example: 'John Doe' })
  @IsOptional()
  @IsString()
  uploadedBy?: string;

  @ApiPropertyOptional({
    description: 'Document description',
    example: 'AMC contract for server.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Related module type', example: 'amc' })
  @IsString()
  @IsNotEmpty()
  relatedType: string;

  @ApiProperty({ description: 'Related record ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  relatedId: number;
}

export class DocumentResponseDto {
  @ApiProperty({ description: 'Document ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'File name', example: 'Contract_2024.pdf' })
  fileName: string;

  @ApiProperty({ description: 'MIME type', example: 'application/pdf' })
  mimeType: string;

  @ApiProperty({ description: 'File size', example: 102400 })
  size: number;

  @ApiProperty({
    description: 'Upload date',
    example: '2024-07-28T10:00:00.000Z',
  })
  uploadDate: Date;

  @ApiProperty({ description: 'Uploaded by', example: 'John Doe' })
  uploadedBy: string;

  @ApiPropertyOptional({ description: 'Description' })
  description?: string;

  @ApiProperty({ description: 'Related record ID', example: 1 })
  relatedId: number;

  @ApiProperty({ description: 'Related module type', example: 'amc' })
  relatedType: string;

  @ApiProperty({
    description: 'Download URL',
    example: '/api/documents/1/download',
  })
  downloadUrl: string;
}

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @ApiPropertyOptional({
    description: 'Document ID (for existing documents)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  id?: number;
}
