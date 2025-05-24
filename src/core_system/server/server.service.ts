import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServerDto } from './dto/server.dto';
import { UpdateServerDto } from './dto/server.dto';
import { ServerEntity } from './entity/server.entity';

@Injectable()
export class ServerService {
  constructor(
    @InjectRepository(ServerEntity)
    private readonly serverRepository: Repository<ServerEntity>,
  ) {}

  async create(createServerDto: CreateServerDto): Promise<any> {
    const server = this.serverRepository.create(createServerDto);
    await this.serverRepository.save(server);
    return {
      isSuccessful: true,
      message: 'Server created successfully',
      data: server,
    };
  }

  async findAll(): Promise<any> {
    const servers = await this.serverRepository.find();
    return {
      isSuccessful: true,
      message: 'Servers retrieved successfully',
      data: servers,
    };
  }

  async findOne(id: number): Promise<any> {
    const server = await this.serverRepository.findOne({ where: { id } });
    if (!server) {
      throw new NotFoundException(`Server with ID ${id} not found`);
    }
    return {
      isSuccessful: true,
      message: 'Server found',
      data: server,
    };
  }

  async update(id: number, updateServerDto: UpdateServerDto): Promise<any> {
    await this.findOne(id); // Check if the server exists
    await this.serverRepository.update(id, updateServerDto);
    const updatedServer = await this.findOne(id); // Get the updated server
    return {
      isSuccessful: true,
      message: 'Server updated successfully',
      data: updatedServer.data,
    };
  }

  async remove(id: number): Promise<any> {
    const server = await this.findOne(id);
    await this.serverRepository.remove(server);
    return {
      isSuccessful: true,
      message: 'Server removed successfully',
      data: null,
    };
  }
}
