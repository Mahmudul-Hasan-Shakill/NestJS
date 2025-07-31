import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIP,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClusterDto {
  @ApiProperty({ description: 'Name of the cluster', example: 'Cluster A' })
  @IsString()
  @IsNotEmpty()
  clusterName: string;

  @ApiProperty({
    description: 'List of VM IPs',
    example: ['10.5.25.1', '10.5.25.2'],
    type: [String],
  })
  @IsNotEmpty()
  @IsIP(undefined, { each: true })
  vmIpList: string[];

  @ApiPropertyOptional({ description: 'Additional remarks about the cluster' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiProperty({
    description: 'User who created the cluster',
    example: 'Shakil',
  })
  @IsString()
  @IsNotEmpty()
  makeBy: string;

  @ApiPropertyOptional({
    description: 'Indicates if the cluster is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateClusterDto extends PartialType(CreateClusterDto) {
  @ApiPropertyOptional({ description: 'VM IP address' })
  @IsOptional()
  @IsIP()
  vmIp?: string;

  @ApiPropertyOptional({ description: 'User who last edited the cluster' })
  @IsOptional()
  @IsString()
  editBy?: string;
}
