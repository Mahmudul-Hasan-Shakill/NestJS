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
import { PhysicalService } from './physical.service';
import { CreatePhysicalDto, UpdatePhysicalDto } from './dto/physical.dto';
import { JwtGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Physical Server Inventory')
@UseGuards(JwtGuard)
@Controller('physical')
export class PhysicalController {
  constructor(private readonly physicalService: PhysicalService) {}

  @Post()
  async create(@Body() dto: CreatePhysicalDto) {
    return this.physicalService.create(dto);
  }

  @Get()
  async findAll() {
    return this.physicalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.physicalService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePhysicalDto) {
    return this.physicalService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.physicalService.remove(id);
  }
}
