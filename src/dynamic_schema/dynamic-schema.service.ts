import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DynamicSchemaEntity } from './entity/dynamic-schema.entity';
import { DynamicSchemaDto } from './dto/dynamic-schema.dto';

@Injectable()
export class DynamicSchemaService {
  private readonly allowedTypes = [
    'varchar',
    'int',
    'boolean',
    'text',
    'timestamp',
  ];

  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private validateFieldName(name: string) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
      throw new BadRequestException('Invalid field name.');
    }
  }

  private validateFieldType(type: string) {
    const baseType = type.split('(')[0].toLowerCase();
    if (!this.allowedTypes.includes(baseType)) {
      throw new BadRequestException('Invalid or unsupported field type.');
    }
  }

  async addColumn(dto: DynamicSchemaDto) {
    const { tableName, fieldName, fieldType } = dto;

    this.validateFieldName(fieldName);
    this.validateFieldType(fieldType);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.query(
        `ALTER TABLE "${tableName}" ADD COLUMN "${fieldName}" ${fieldType}`,
      );

      const metadata = await queryRunner.manager.save(DynamicSchemaEntity, {
        tableName,
        fieldName,
        fieldType,
        isActive: true,
      });

      return {
        isSuccessful: true,
        message: 'Column added successfully',
        data: {
          tableName,
          fieldName,
          fieldType,
          metadataId: metadata.id,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Failed to add column: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async removeColumn(dto: DynamicSchemaDto) {
    const { tableName, fieldName } = dto;

    this.validateFieldName(fieldName);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.query(
        `ALTER TABLE "${tableName}" DROP COLUMN "${fieldName}"`,
      );

      await queryRunner.manager.update(
        DynamicSchemaEntity,
        { tableName, fieldName },
        { isActive: false },
      );

      return {
        isSuccessful: true,
        message: 'Column removed successfully',
        data: {
          tableName,
          fieldName,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to remove column: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
