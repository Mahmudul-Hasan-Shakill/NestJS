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
import { ApplicationService } from './application.service';
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from './dto/application.dto';
import { JwtGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Application Inventory')
@UseGuards(JwtGuard)
@Controller('application')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @Post()
  async create(@Body() dto: CreateApplicationDto) {
    return this.appService.create(dto);
  }

  @Get()
  async findAll() {
    return this.appService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.appService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateApplicationDto) {
    return this.appService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.appService.remove(id);
  }
}
