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
import { DatabaseService } from './database.service';
import { CreateDatabaseDto, UpdateDatabaseDto } from './dto/database.dto';
import { JwtGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Database Inventory')
@UseGuards(JwtGuard)
@Controller('database')
export class DatabaseController {
  constructor(private readonly dbService: DatabaseService) {}

  @Post()
  async create(@Body() dto: CreateDatabaseDto) {
    return this.dbService.create(dto);
  }

  @Get()
  async findAll() {
    return this.dbService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.dbService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateDatabaseDto) {
    return this.dbService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.dbService.remove(id);
  }
}
