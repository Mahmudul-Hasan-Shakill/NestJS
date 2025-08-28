import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DynamicFieldEntity } from './entity/dynamic-field.entity';
import { UpsertFieldDto } from './dto/upsert-field.dto';
import { RemoveFieldDto } from './dto/remove-field.dto';
import { ReorderFieldsDto } from './dto/reorder-fields.dto';

@Injectable()
export class DynamicSchemaService {
  private readonly allowedUiTypes = new Set([
    'text',
    'number',
    'checkbox',
    'textarea',
    'datetime',
    'select',
  ]);

  constructor(
    @InjectRepository(DynamicFieldEntity)
    private readonly repo: Repository<DynamicFieldEntity>,
  ) {}

  /** Basic safety: permit only sane table/field identifiers */
  private validateIdentifier(name: string, kind: 'table' | 'field') {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
      throw new BadRequestException(`Invalid ${kind} name: ${name}`);
    }
  }

  async upsertField(dto: UpsertFieldDto) {
    this.validateIdentifier(dto.tableName, 'table');
    this.validateIdentifier(dto.fieldName, 'field');
    if (dto.uiType && !this.allowedUiTypes.has(dto.uiType)) {
      throw new BadRequestException(`Unsupported uiType: ${dto.uiType}`);
    }

    const existing = await this.repo.findOne({
      where: { tableName: dto.tableName, fieldName: dto.fieldName },
    });
    if (existing) {
      const merged = this.repo.merge(existing, {
        uiType: dto.uiType ?? existing.uiType,
        fieldType: dto.fieldType ?? existing.fieldType,
        isActive: dto.isActive ?? existing.isActive,
        label: dto.label ?? (existing.label || this.humanize(dto.fieldName)),
        helpText: dto.helpText ?? existing.helpText,
        required: dto.required ?? existing.required,
        defaultValue: dto.defaultValue ?? existing.defaultValue,
        sortOrder: dto.sortOrder ?? existing.sortOrder,
        options: dto.options ?? existing.options,
        validators: dto.validators ?? existing.validators,
      });
      const saved = await this.repo.save(merged);
      return { isSuccessful: true, message: 'Field updated', data: saved };
    } else {
      const created = this.repo.create({
        tableName: dto.tableName,
        fieldName: dto.fieldName,
        uiType: dto.uiType ?? 'text',
        fieldType: dto.fieldType ?? 'varchar',
        isActive: dto.isActive ?? true,
        label: dto.label ?? this.humanize(dto.fieldName),
        helpText: dto.helpText ?? '',
        required: dto.required ?? false,
        defaultValue: dto.defaultValue,
        sortOrder: dto.sortOrder ?? 100,
        options: dto.options ?? [],
        validators: dto.validators ?? {},
      });
      const saved = await this.repo.save(created);
      return { isSuccessful: true, message: 'Field created', data: saved };
    }
  }

  async removeField(dto: RemoveFieldDto) {
    this.validateIdentifier(dto.tableName, 'table');
    this.validateIdentifier(dto.fieldName, 'field');

    const existing = await this.repo.findOne({
      where: { tableName: dto.tableName, fieldName: dto.fieldName },
    });
    if (!existing) throw new NotFoundException('Field not found');

    // Soft-remove: mark inactive so UI hides it; data remains inside extras
    existing.isActive = false;
    await this.repo.save(existing);

    return {
      isSuccessful: true,
      message: 'Field deactivated',
      data: { tableName: dto.tableName, fieldName: dto.fieldName },
    };
  }

  async reorder(dto: ReorderFieldsDto) {
    this.validateIdentifier(dto.tableName, 'table');

    const existing = await this.repo.find({
      where: { tableName: dto.tableName },
    });
    const byName = new Map(existing.map((f) => [f.fieldName, f]));

    for (const { fieldName, sortOrder } of dto.items) {
      this.validateIdentifier(fieldName, 'field');
      const row = byName.get(fieldName);
      if (row) row.sortOrder = sortOrder;
    }
    await this.repo.save([...byName.values()]);
    return { isSuccessful: true, message: 'Order updated' };
  }

  /** The schema your UI (and services) will consume */
  async getUiSchema(tableName: string) {
    this.validateIdentifier(tableName, 'table');

    const fields = await this.repo.find({
      where: { tableName, isActive: true },
      order: { sortOrder: 'ASC', fieldName: 'ASC' },
    });

    // Produce a compact schema for the client
    const payload = fields.map((f) => ({
      name: f.fieldName,
      label: f.label || this.humanize(f.fieldName),
      uiType: f.uiType,
      required: f.required,
      defaultValue: f.defaultValue ?? null,
      helpText: f.helpText ?? '',
      options: f.options ?? [],
      validators: f.validators ?? {},
    }));

    return { table: tableName, fields: payload };
  }

  private humanize(s: string) {
    return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
