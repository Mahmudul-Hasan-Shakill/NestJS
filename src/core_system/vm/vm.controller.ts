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
import { VmService } from './vm.service';
import { CreateVmDto, UpdateVmDto } from './dto/vm.dto';
import { JwtGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('VM Inventory')
@UseGuards(JwtGuard)
@Controller('vm')
export class VmController {
  constructor(private readonly vmService: VmService) {}

  @Post()
  async create(@Body() dto: CreateVmDto) {
    return this.vmService.create(dto);
  }

  @Get()
  async findAll() {
    return this.vmService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.vmService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateVmDto) {
    return this.vmService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.vmService.remove(id);
  }
}
