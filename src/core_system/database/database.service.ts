// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { In, Repository } from 'typeorm';
// import { DatabaseEntity } from './entity/database.entity';
// import { CreateDatabaseDto, UpdateDatabaseDto } from './dto/database.dto';
// import { VmEntity } from '../vm/entity/vm.entity';
// import { AutomationEntity } from '../automation/entity/automation.entity';

// @Injectable()
// export class DatabaseService {
//   constructor(
//     @InjectRepository(DatabaseEntity)
//     private readonly dbRepository: Repository<DatabaseEntity>,
//     @InjectRepository(VmEntity)
//     private readonly vmRepository: Repository<VmEntity>,
//     @InjectRepository(AutomationEntity)
//     private readonly automationRepository: Repository<AutomationEntity>,
//   ) {}

//   async create(dto: CreateDatabaseDto): Promise<any> {
//     const vms = await this.vmRepository.findBy({ id: In(dto.vmIds) });

//     const automations = dto.automationIds
//       ? await this.automationRepository.findBy({ id: In(dto.automationIds) })
//       : [];

//     const db = this.dbRepository.create({
//       ...dto,
//       vms,
//       automations,
//     });

//     await this.dbRepository.save(db);
//     return {
//       isSuccessful: true,
//       message: 'Database created successfully',
//       data: db,
//     };
//   }

//   async findAll(): Promise<any> {
//     const dbs = await this.dbRepository.find({
//       relations: ['vms', 'automations'],
//     });
//     return {
//       isSuccessful: true,
//       message: 'Databases retrieved successfully',
//       data: dbs,
//     };
//   }

//   async findOne(id: number): Promise<any> {
//     const db = await this.dbRepository.findOne({
//       where: { id },
//       relations: ['vms', 'automations'],
//     });
//     if (!db) throw new NotFoundException(`Database with ID ${id} not found`);
//     return {
//       isSuccessful: true,
//       message: 'Database found',
//       data: db,
//     };
//   }

//   async update(id: number, dto: UpdateDatabaseDto): Promise<any> {
//     const db = await this.findOne(id);
//     const vms = await this.vmRepository.findBy({ id: In(dto.vmIds) });
//     const automations = dto.automationIds
//       ? await this.automationRepository.findBy({ id: In(dto.automationIds) })
//       : [];

//     await this.dbRepository.save({
//       ...db.data,
//       ...dto,
//       vms,
//       automations,
//     });

//     const updated = await this.findOne(id);
//     return {
//       isSuccessful: true,
//       message: 'Database updated successfully',
//       data: updated.data,
//     };
//   }

//   async remove(id: number): Promise<any> {
//     const db = await this.findOne(id);
//     await this.dbRepository.remove(db.data);
//     return {
//       isSuccessful: true,
//       message: 'Database removed successfully',
//       data: null,
//     };
//   }
// }

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DatabaseEntity } from './entity/database.entity';
import { CreateDatabaseDto, UpdateDatabaseDto } from './dto/database.dto';
import { VmEntity } from '../vm/entity/vm.entity';
import { AutomationEntity } from '../automation/entity/automation.entity';
import { DynamicSchemaService } from 'src/dynamic_schema/dynamic-schema.service';

// Static columns that live as first-class columns.
// Anything else must be inside dto.extras.
const STATIC_KEYS = new Set<string>([
  'dbName',
  'virtualIp',
  'additionalIp',
  'dbInstance',
  'dbVersion',
  'rdbmsType',
  'dbPort',
  'dbStatus',
  'dbType',
  'dbOwnerEmail',
  'remarks',
  'isActive',
  'makeBy',
  'makeDate',
  'editBy',
  'editDate',
  // service-only:
  'vmIds',
  'automationIds',
  // explicitly allowed:
  'extras',
  'extrasRemove',
]);

type UiType =
  | 'text'
  | 'number'
  | 'checkbox'
  | 'textarea'
  | 'datetime'
  | 'select';

function isPlainObject(v: any) {
  return v !== null && typeof v === 'object' && v.constructor === Object;
}

const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

function coerceAndValidateValue(
  uiType: UiType,
  value: any,
  fieldName: string,
  options?: Array<{ label: string; value: string }>,
) {
  switch (uiType) {
    case 'text':
    case 'textarea': {
      if (typeof value !== 'string')
        throw new BadRequestException(`Field '${fieldName}' must be a string`);
      if (value.length > 5000)
        throw new BadRequestException(`Field '${fieldName}' too long`);
      return value;
    }
    case 'number': {
      const n = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(n))
        throw new BadRequestException(
          `Field '${fieldName}' must be a finite number`,
        );
      return n;
    }
    case 'checkbox': {
      if (typeof value === 'boolean') return value;
      if (value === 'true') return true;
      if (value === 'false') return false;
      throw new BadRequestException(`Field '${fieldName}' must be boolean`);
    }
    case 'datetime': {
      const d = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(d.getTime()))
        throw new BadRequestException(
          `Field '${fieldName}' must be a valid datetime`,
        );
      return d.toISOString(); // or keep original string; choose a policy
    }
    case 'select': {
      const v = String(value);
      const allowed = (options ?? []).map((o) => o.value);
      if (!allowed.includes(v)) {
        throw new BadRequestException(
          `Field '${fieldName}' must be one of: ${allowed.join(', ')}`,
        );
      }
      return v;
    }
    default:
      return value;
  }
}

/**
 * Validates that `extras`:
 *  - is an object,
 *  - contains only active fields defined for this table,
 *  - each value matches the field's expected uiType (and options for select).
 * Returns a normalized object to be stored.
 */
async function validateAndNormalizeExtras(
  tableName: string,
  extras: Record<string, any> | undefined,
  schemaSvc: DynamicSchemaService,
) {
  if (extras === undefined) return {};
  if (!isPlainObject(extras))
    throw new BadRequestException('extras must be a JSON object');

  const schema = await schemaSvc.getUiSchema(tableName);
  const specByName = new Map(schema.fields.map((f) => [f.name, f]));

  const normalized: Record<string, any> = {};
  for (const [k, raw] of Object.entries(extras)) {
    if (FORBIDDEN_KEYS.has(k))
      throw new BadRequestException(`Invalid field name: ${k}`);
    const spec = specByName.get(k);
    if (!spec) {
      throw new BadRequestException(
        `Unknown or inactive dynamic field: '${k}'`,
      );
    }
    const val = coerceAndValidateValue(
      spec.uiType as UiType,
      raw,
      k,
      spec.options,
    );
    normalized[k] = val;
  }
  return normalized;
}

function pickStatic(payload: Record<string, any> = {}) {
  const base: Record<string, any> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (v === undefined) continue;
    if (STATIC_KEYS.has(k)) base[k] = v;
  }
  return base;
}

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly dbRepository: Repository<DatabaseEntity>,
    @InjectRepository(VmEntity)
    private readonly vmRepository: Repository<VmEntity>,
    @InjectRepository(AutomationEntity)
    private readonly automationRepository: Repository<AutomationEntity>,
    private readonly dynamicSchema: DynamicSchemaService, // ✅ to validate extras
  ) {}

  private readonly tableName = 'database_entity'; // must match your entity @Entity({ name: 'database_entity' })

  async create(dto: CreateDatabaseDto): Promise<any> {
    const base = pickStatic(dto);

    // Validate extras strictly against dynamic schema
    const validatedExtras = await validateAndNormalizeExtras(
      this.tableName,
      dto.extras,
      this.dynamicSchema,
    );

    const vms = dto.vmIds?.length
      ? await this.vmRepository.findBy({ id: In(dto.vmIds) })
      : [];

    const automations = dto.automationIds?.length
      ? await this.automationRepository.findBy({ id: In(dto.automationIds) })
      : [];

    const entity = this.dbRepository.create({
      ...base,
      extras: validatedExtras,
      vms,
      automations,
    });

    await this.dbRepository.save(entity);

    return {
      isSuccessful: true,
      message: 'Database created successfully',
      data: entity,
    };
  }

  async findAll(): Promise<any> {
    const dbs = await this.dbRepository.find({
      relations: ['vms', 'automations'],
    });
    return {
      isSuccessful: true,
      message: 'Databases retrieved successfully',
      data: dbs,
    };
  }

  async findOne(id: number): Promise<any> {
    const db = await this.dbRepository.findOne({
      where: { id },
      relations: ['vms', 'automations'],
    });
    if (!db) throw new NotFoundException(`Database with ID ${id} not found`);
    return {
      isSuccessful: true,
      message: 'Database found',
      data: db,
    };
  }

  async update(id: number, dto: UpdateDatabaseDto): Promise<any> {
    const existing = await this.dbRepository.findOne({
      where: { id },
      relations: ['vms', 'automations'],
    });
    if (!existing)
      throw new NotFoundException(`Database with ID ${id} not found`);

    const base = pickStatic(dto);

    const vms =
      dto.vmIds !== undefined
        ? dto.vmIds?.length
          ? await this.vmRepository.findBy({ id: In(dto.vmIds) })
          : []
        : existing.vms;

    const automations =
      dto.automationIds !== undefined
        ? dto.automationIds?.length
          ? await this.automationRepository.findBy({
              id: In(dto.automationIds),
            })
          : []
        : existing.automations;

    // Validate extras; merge onto existing
    const validatedExtras = await validateAndNormalizeExtras(
      this.tableName,
      dto.extras,
      this.dynamicSchema,
    );

    const mergedExtras: Record<string, any> = {
      ...(existing.extras ?? {}),
      ...validatedExtras,
    };

    // Optional removals
    if (Array.isArray(dto.extrasRemove)) {
      for (const key of dto.extrasRemove) {
        delete mergedExtras[key];
      }
    }

    const merged: DatabaseEntity = {
      ...existing,
      ...base,
      extras: mergedExtras,
      vms,
      automations,
      editDate: new Date(),
    };

    await this.dbRepository.save(merged);

    const updated = await this.dbRepository.findOne({
      where: { id },
      relations: ['vms', 'automations'],
    });

    return {
      isSuccessful: true,
      message: 'Database updated successfully',
      data: updated,
    };
  }

  async remove(id: number): Promise<any> {
    const existing = await this.dbRepository.findOne({ where: { id } });
    if (!existing)
      throw new NotFoundException(`Database with ID ${id} not found`);

    await this.dbRepository.remove(existing);
    return {
      isSuccessful: true,
      message: 'Database removed successfully',
      data: null,
    };
  }
}
