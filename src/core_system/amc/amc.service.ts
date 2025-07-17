import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAmcDto } from './dto/amc.dto';
import { UpdateAmcDto } from './dto/amc.dto';
import { AmcEntity } from './entity/amc.entity';

@Injectable()
export class AmcService {
  constructor(
    @InjectRepository(AmcEntity)
    private readonly amcRepository: Repository<AmcEntity>,
  ) {}

  async create(createAmcDto: CreateAmcDto): Promise<any> {
    const amc = this.amcRepository.create(createAmcDto);
    await this.amcRepository.save(amc);
    return {
      isSuccessful: true,
      message: 'AMC created successfully',
      data: amc,
    };
  }

  async findAll(): Promise<any> {
    const amcs = await this.amcRepository.find();
    return {
      isSuccessful: true,
      message: 'AMCs retrieved successfully',
      data: amcs,
    };
  }

  async findOne(id: number): Promise<any> {
    try {
      const amc = await this.amcRepository.findOne({ where: { id } });
      if (!amc) {
        throw new NotFoundException(`AMC with ID ${id} not found`);
      }
      return {
        isSuccessful: true,
        message: 'AMC found',
        data: amc,
      };
    } catch (error) {
      console.error('Error in findOne:', error);
      throw error;
    }
  }

  async update(id: number, updateAmcDto: UpdateAmcDto): Promise<any> {
    await this.findOne(id); // Check if the AMC exists
    await this.amcRepository.update(id, updateAmcDto);
    const updatedAmc = await this.findOne(id); // Get the updated AMC
    return {
      isSuccessful: true,
      message: 'AMC updated successfully',
      data: updatedAmc.data,
    };
  }

  async remove(id: number): Promise<any> {
    const result = await this.findOne(id);
    const amc = result.data;
    await this.amcRepository.remove(amc);
    return {
      isSuccessful: true,
      message: 'AMC removed successfully',
      data: null,
    };
  }
}
