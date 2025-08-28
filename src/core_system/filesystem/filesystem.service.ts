// src/core_system/filesystem/filesystem.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { FilesystemEntity } from './entity/filesystem.entity';
import { CreateFilesystemDto, UpdateFilesystemDto } from './dto/filesystem.dto';
import { DynamicFieldEntity } from 'src/dynamic_schema/entity/dynamic-field.entity';

const TABLE_NAME = 'filesystem_entity';

@Injectable()
export class FilesystemService {
  constructor(
    @InjectRepository(FilesystemEntity)
    private readonly repo: Repository<FilesystemEntity>,
    @InjectRepository(DynamicFieldEntity)
    private readonly dynRepo: Repository<DynamicFieldEntity>,
  ) {}

  private async getAllowedDynamicKeys(): Promise<Set<string>> {
    const rows = await this.dynRepo.find({
      where: { tableName: TABLE_NAME, isActive: true },
      select: ['fieldName'],
      order: { sortOrder: 'ASC', fieldName: 'ASC' },
    });
    return new Set(rows.map((r) => r.fieldName));
  }

  private pickExtras(input: Record<string, any> | undefined, allowed: Set<string>) {
    const out: Record<string, any> = {};
    if (!input) return out;
    for (const [k, v] of Object.entries(input)) {
      if (allowed.has(k)) out[k] = v;
    }
    return out;
  }

  async create(dto: CreateFilesystemDto) {
    const allowed = await this.getAllowedDynamicKeys();
    const extras = this.pickExtras(dto.extras, allowed);

    const entity = this.repo.create({
      ...dto,
      extras,
    });

    const saved = await this.repo.save(entity);
    return {
      isSuccessful: true,
      message: 'Filesystem created successfully',
      data: saved,
    };
  }

  async findAll() {
    const items = await this.repo.find();
    return {
      isSuccessful: true,
      message: 'Filesystems retrieved successfully',
      data: items,
    };
  }

  async findOne(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException(`Filesystem with ID ${id} not found`);
    return {
      isSuccessful: true,
      message: 'Filesystem found',
      data: row,
    };
  }

  async update(id: number, dto: UpdateFilesystemDto) {
    const current = await this.repo.findOne({ where: { id } });
    if (!current) throw new NotFoundException(`Filesystem with ID ${id} not found`);

    const allowed = await this.getAllowedDynamicKeys();
    const nextExtras = {
      ...(current.extras || {}),
      ...this.pickExtras(dto.extras, allowed),
    };

    await this.repo.save({
      ...current,
      ...dto,
      extras: nextExtras,
    });

    const updated = await this.repo.findOne({ where: { id } });
    return {
      isSuccessful: true,
      message: 'Filesystem updated successfully',
      data: updated,
    };
  }

  async remove(id: number) {
    const current = await this.repo.findOne({ where: { id } });
    if (!current) throw new NotFoundException(`Filesystem with ID ${id} not found`);
    await this.repo.remove(current);
    return {
      isSuccessful: true,
      message: 'Filesystem removed successfully',
      data: null,
    };
  }
}
