import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DatabaseEntity } from './entity/database.entity';
import { CreateDatabaseDto, UpdateDatabaseDto } from './dto/database.dto';
import { VmEntity } from '../vm/entity/vm.entity';
import { AutomationEntity } from '../automation/entity/automation.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly dbRepository: Repository<DatabaseEntity>,
    @InjectRepository(VmEntity)
    private readonly vmRepository: Repository<VmEntity>,
    @InjectRepository(AutomationEntity)
    private readonly automationRepository: Repository<AutomationEntity>,
  ) {}

  async create(dto: CreateDatabaseDto): Promise<any> {
    const vms = await this.vmRepository.findBy({ id: In(dto.vmIds) });

    const automations = dto.automationIds
      ? await this.automationRepository.findBy({ id: In(dto.automationIds) })
      : [];

    const db = this.dbRepository.create({
      ...dto,
      vms,
      automations,
    });

    await this.dbRepository.save(db);
    return {
      isSuccessful: true,
      message: 'Database created successfully',
      data: db,
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
    const db = await this.findOne(id);
    const vms = await this.vmRepository.findBy({ id: In(dto.vmIds) });
    const automations = dto.automationIds
      ? await this.automationRepository.findBy({ id: In(dto.automationIds) })
      : [];

    await this.dbRepository.save({
      ...db.data,
      ...dto,
      vms,
      automations,
    });

    const updated = await this.findOne(id);
    return {
      isSuccessful: true,
      message: 'Database updated successfully',
      data: updated.data,
    };
  }

  async remove(id: number): Promise<any> {
    const db = await this.findOne(id);
    await this.dbRepository.remove(db.data);
    return {
      isSuccessful: true,
      message: 'Database removed successfully',
      data: null,
    };
  }
}
