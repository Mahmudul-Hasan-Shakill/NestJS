import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ServerService } from './server.service';
import { CreateServerDto } from './dto/server.dto';
import { UpdateServerDto } from './dto/server.dto';
import { ServerEntity } from './entity/server.entity';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createServerDto: CreateServerDto,
  ): Promise<ServerEntity> {
    return this.serverService.create(createServerDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(): Promise<ServerEntity[]> {
    return this.serverService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ServerEntity> {
    return this.serverService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateServerDto: UpdateServerDto,
  ): Promise<ServerEntity> {
    return this.serverService.update(id, updateServerDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.serverService.remove(id);
  }
}
