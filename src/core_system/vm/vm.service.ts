import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { VmEntity } from './entity/vm.entity';
import { CreateVmDto, UpdateVmDto } from './dto/vm.dto';
import { ApplicationEntity } from '../application/entity/application.entity';
import { DatabaseEntity } from '../database/entity/database.entity';
import { PhysicalEntity } from '../physical/entity/physical.entity';

@Injectable()
export class VmService {
  constructor(
    @InjectRepository(VmEntity)
    private readonly vmRepository: Repository<VmEntity>,
    @InjectRepository(ApplicationEntity)
    private readonly appRepository: Repository<ApplicationEntity>,
    @InjectRepository(DatabaseEntity)
    private readonly dbRepository: Repository<DatabaseEntity>,
    @InjectRepository(PhysicalEntity)
    private readonly physicalRepo: Repository<PhysicalEntity>,
  ) {}

  async create(dto: CreateVmDto): Promise<any> {
    try {
      const applications = dto.applicationIds
        ? await this.appRepository.findBy({ id: In(dto.applicationIds) })
        : [];

      const databases = dto.databaseIds
        ? await this.dbRepository.findBy({ id: In(dto.databaseIds) })
        : [];

      const physical = dto.physicalId
        ? await this.physicalRepo.findOne({ where: { id: dto.physicalId } })
        : null;

      const vm = this.vmRepository.create({
        ...dto,
        applications,
        databases,
        physical,
      });

      await this.vmRepository.save(vm);
      return {
        isSuccessful: true,
        message: 'VM created successfully',
        data: vm,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create VM. ' + error.message);
    }
  }

  async findAll(): Promise<any> {
    try {
      const vms = await this.vmRepository.find({
        relations: ['applications', 'databases', 'physical'],
      });
      return {
        isSuccessful: true,
        message: 'VMs retrieved successfully',
        data: vms,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve VMs.');
    }
  }

  async findOne(id: number): Promise<any> {
    const vm = await this.vmRepository.findOne({
      where: { id },
      relations: ['applications', 'databases', 'physical'],
    });
    if (!vm) throw new NotFoundException(`VM with ID ${id} not found`);
    return {
      isSuccessful: true,
      message: 'VM found',
      data: vm,
    };
  }

  async update(id: number, dto: UpdateVmDto): Promise<any> {
    const existing = await this.vmRepository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException(`VM with ID ${id} not found`);

    try {
      const applications = dto.applicationIds
        ? await this.appRepository.findBy({ id: In(dto.applicationIds) })
        : [];

      const databases = dto.databaseIds
        ? await this.dbRepository.findBy({ id: In(dto.databaseIds) })
        : [];

      const physical = dto.physicalId
        ? await this.physicalRepo.findOne({ where: { id: dto.physicalId } })
        : null;

      await this.vmRepository.save({
        ...existing,
        ...dto,
        applications,
        databases,
        physical,
      });

      const updated = await this.findOne(id);
      return {
        isSuccessful: true,
        message: 'VM updated successfully',
        data: updated.data,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update VM. ' + error.message);
    }
  }

  async remove(id: number): Promise<any> {
    const vm = await this.vmRepository.findOne({ where: { id } });
    if (!vm) throw new NotFoundException(`VM with ID ${id} not found`);
    try {
      await this.vmRepository.remove(vm);
      return {
        isSuccessful: true,
        message: 'VM removed successfully',
        data: null,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete VM.');
    }
  }
}
