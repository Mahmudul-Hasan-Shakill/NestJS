import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PhysicalEntity } from './entity/physical.entity';
import { CreatePhysicalDto, UpdatePhysicalDto } from './dto/physical.dto';
import { VmEntity } from '../vm/entity/vm.entity';

@Injectable()
export class PhysicalService {
  constructor(
    @InjectRepository(PhysicalEntity)
    private readonly physicalRepo: Repository<PhysicalEntity>,
    @InjectRepository(VmEntity)
    private readonly vmRepo: Repository<VmEntity>,
  ) {}

  async create(dto: CreatePhysicalDto): Promise<any> {
    const physical = this.physicalRepo.create(dto);
    await this.physicalRepo.save(physical);

    if (dto.vmIds?.length) {
      const vms = await this.vmRepo.findBy({ id: In(dto.vmIds) });
      for (const vm of vms) {
        vm.physical = physical;
      }
      await this.vmRepo.save(vms);
    }

    return {
      isSuccessful: true,
      message: 'Physical server created and VMs assigned',
      data: physical,
    };
  }

  async update(id: number, dto: UpdatePhysicalDto): Promise<any> {
    const physical = await this.findOne(id);
    await this.physicalRepo.update(id, dto);

    if (dto.vmIds?.length) {
      const vms = await this.vmRepo.findBy({ id: In(dto.vmIds) });
      for (const vm of vms) {
        vm.physical = physical.data;
      }
      await this.vmRepo.save(vms);
    }

    const updated = await this.findOne(id);
    return {
      isSuccessful: true,
      message: 'Physical server updated and VMs reassigned',
      data: updated.data,
    };
  }

  async findAll(): Promise<any> {
    const physicals = await this.physicalRepo.find({
      relations: ['virtualMachines'],
    });
    return {
      isSuccessful: true,
      message: 'Physical servers retrieved successfully',
      data: physicals,
    };
  }

  async findOne(id: number): Promise<any> {
    const physical = await this.physicalRepo.findOne({
      where: { id },
      relations: ['virtualMachines'],
    });
    if (!physical)
      throw new NotFoundException(`Physical server with ID ${id} not found`);
    return {
      isSuccessful: true,
      message: 'Physical server found',
      data: physical,
    };
  }

  async remove(id: number): Promise<any> {
    const physical = await this.findOne(id);
    await this.physicalRepo.remove(physical.data);
    return {
      isSuccessful: true,
      message: 'Physical server removed successfully',
      data: null,
    };
  }
}
