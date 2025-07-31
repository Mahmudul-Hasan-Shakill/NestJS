import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ApplicationEntity } from './entity/application.entity';
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from './dto/application.dto';
import { VmEntity } from '../vm/entity/vm.entity';
import { AutomationEntity } from '../automation/entity/automation.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly appRepository: Repository<ApplicationEntity>,
    @InjectRepository(VmEntity)
    private readonly vmRepository: Repository<VmEntity>,
    @InjectRepository(AutomationEntity)
    private readonly automationRepository: Repository<AutomationEntity>,
  ) {}

  async create(dto: CreateApplicationDto): Promise<any> {
    const vms = dto.vmIds
      ? await this.vmRepository.findBy({ id: In(dto.vmIds) })
      : [];

    const automations = dto.automationIds
      ? await this.automationRepository.findBy({ id: In(dto.automationIds) })
      : [];
    const app = new ApplicationEntity();
    Object.assign(app, dto);
    app.vms = vms;
    app.automations = automations;
    await this.appRepository.save(app);

    return {
      isSuccessful: true,
      message: 'Application created successfully',
      data: app,
    };
  }

  async findAll(): Promise<any> {
    const apps = await this.appRepository
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.vms', 'vm')
      .leftJoinAndSelect('app.automations', 'automation')
      .getMany();

    return {
      isSuccessful: true,
      message: 'Applications retrieved successfully',
      data: apps,
    };
  }

  async findOne(id: number): Promise<any> {
    const app = await this.appRepository
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.vms', 'vm')
      .leftJoinAndSelect('app.automations', 'automation')
      .where('app.id = :id', { id })
      .getOne();

    if (!app)
      throw new NotFoundException(`Application with ID ${id} not found`);

    return {
      isSuccessful: true,
      message: 'Application found',
      data: app,
    };
  }

  async update(id: number, dto: UpdateApplicationDto): Promise<any> {
    const app = await this.findOne(id);
    const vms = dto.vmIds
      ? await this.vmRepository.findBy({ id: In(dto.vmIds) })
      : [];
    const automations = dto.automationIds
      ? await this.automationRepository.findBy({ id: In(dto.automationIds) })
      : [];

    await this.appRepository.save({
      ...app.data,
      ...dto,
      vms,
      automations,
    });

    const updated = await this.findOne(id);
    return {
      isSuccessful: true,
      message: 'Application updated successfully',
      data: updated.data,
    };
  }

  async remove(id: number): Promise<any> {
    const app = await this.findOne(id);
    await this.appRepository.remove(app.data);
    return {
      isSuccessful: true,
      message: 'Application removed successfully',
      data: null,
    };
  }
}
