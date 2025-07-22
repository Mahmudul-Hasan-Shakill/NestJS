// automation.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AutomationEntity } from './entity/automation.entity';
import { CreateAutomationDto, UpdateAutomationDto } from './dto/automation.dto';
import { ApplicationEntity } from '../application/entity/application.entity';
import { DatabaseEntity } from '../database/entity/database.entity';

@Injectable()
export class AutomationService {
  constructor(
    @InjectRepository(AutomationEntity)
    private readonly automationRepo: Repository<AutomationEntity>,
    @InjectRepository(ApplicationEntity)
    private readonly appRepo: Repository<ApplicationEntity>,
    @InjectRepository(DatabaseEntity)
    private readonly dbRepo: Repository<DatabaseEntity>,
  ) {}

  async create(dto: CreateAutomationDto): Promise<any> {
    const applications = dto.appIds?.length
      ? await this.appRepo.findBy({ id: In(dto.appIds) })
      : [];

    const databases = dto.dbIds?.length
      ? await this.dbRepo.findBy({ id: In(dto.dbIds) })
      : [];

    const automation = this.automationRepo.create({
      ...dto,
      apps: applications,
      dbs: databases,
    });

    await this.automationRepo.save(automation);

    return {
      isSuccessful: true,
      message: 'Automation entity created successfully',
      data: automation,
    };
  }

  async findAll(): Promise<any> {
    const automations = await this.automationRepo.find({
      relations: ['apps', 'dbs'],
    });

    return {
      isSuccessful: true,
      message: 'Automation entities retrieved successfully',
      data: automations,
    };
  }

  async findOne(id: number): Promise<any> {
    const automation = await this.automationRepo.findOne({
      where: { id },
      relations: ['apps', 'dbs'],
    });

    if (!automation) {
      throw new NotFoundException(`Automation with ID ${id} not found`);
    }

    return {
      isSuccessful: true,
      message: 'Automation entity found',
      data: automation,
    };
  }

  async update(id: number, dto: UpdateAutomationDto): Promise<any> {
    const existing = await this.findOne(id);

    const applications = dto.appIds?.length
      ? await this.appRepo.findBy({ id: In(dto.appIds) })
      : [];

    const databases = dto.dbIds?.length
      ? await this.dbRepo.findBy({ id: In(dto.dbIds) })
      : [];

    await this.automationRepo.save({
      ...existing.data,
      ...dto,
      applications,
      databases,
    });

    const updated = await this.findOne(id);

    return {
      isSuccessful: true,
      message: 'Automation entity updated successfully',
      data: updated.data,
    };
  }

  async remove(id: number): Promise<any> {
    const automation = await this.findOne(id);
    await this.automationRepo.remove(automation.data);

    return {
      isSuccessful: true,
      message: 'Automation entity removed successfully',
      data: null,
    };
  }

  async exists(hostname: string, ipAddress: string): Promise<boolean> {
    const count = await this.automationRepo.count({
      where: { hostname, ipAddress },
    });

    return count > 0;
  }

  async bulkCreate(dtos: CreateAutomationDto[]): Promise<AutomationEntity[]> {
    const automations: AutomationEntity[] = [];

    for (const dto of dtos) {
      const applications = dto.appIds?.length
        ? await this.appRepo.findBy({ id: In(dto.appIds) })
        : [];

      const databases = dto.dbIds?.length
        ? await this.dbRepo.findBy({ id: In(dto.dbIds) })
        : [];

      automations.push(
        this.automationRepo.create({
          ...dto,
          apps: applications,
          dbs: databases,
        }),
      );
    }

    return this.automationRepo.save(automations);
  }
}
