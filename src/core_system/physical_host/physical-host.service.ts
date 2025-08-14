import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhysicalHostEntity } from './entity/physical-host.entity';
import {
  CreatePhysicalHostDto,
  UpdatePhysicalHostDto,
} from './dto/physical-host.dto';

@Injectable()
export class PhysicalHostService {
  constructor(
    @InjectRepository(PhysicalHostEntity)
    private readonly hostRepository: Repository<PhysicalHostEntity>,
  ) {}

  async create(dto: CreatePhysicalHostDto): Promise<any> {
    const host = this.hostRepository.create(dto);
    await this.hostRepository.save(host);
    return {
      isSuccessful: true,
      message: 'Physical host created successfully',
      data: host,
    };
  }

  async findAll(): Promise<any> {
    const hosts = await this.hostRepository.find();
    return {
      isSuccessful: true,
      message: 'Physical hosts retrieved successfully',
      data: hosts,
    };
  }

  async findOne(id: number): Promise<any> {
    const host = await this.hostRepository.findOne({ where: { id } });
    if (!host) {
      throw new NotFoundException(`Physical host with ID ${id} not found`);
    }
    return {
      isSuccessful: true,
      message: 'Physical host found',
      data: host,
    };
  }

  async update(id: number, dto: UpdatePhysicalHostDto): Promise<any> {
    const host = await this.findOne(id);
    await this.hostRepository.save({
      ...host.data,
      ...dto,
      editDate: new Date(),
    });

    const updated = await this.findOne(id);
    return {
      isSuccessful: true,
      message: 'Physical host updated successfully',
      data: updated.data,
    };
  }

  async remove(id: number): Promise<any> {
    const host = await this.findOne(id);
    await this.hostRepository.remove(host.data);
    return {
      isSuccessful: true,
      message: 'Physical host removed successfully',
      data: null,
    };
  }

  async getHostSummary(): Promise<any> {
    const summary = await this.hostRepository
      .createQueryBuilder('host')
      .select('host.brand', 'brand')
      .addSelect('COUNT(host.id)', 'count')
      .addSelect('SUM(host.ramTotalGb)', 'totalRam')
      .addSelect('SUM(host.storageTotalTb)', 'totalStorage')
      .groupBy('host.brand')
      .getRawMany();

    return {
      isSuccessful: true,
      message: 'Host summary retrieved',
      data: summary,
    };
  }
}
