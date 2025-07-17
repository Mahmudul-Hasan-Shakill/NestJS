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
import { AmcService } from './amc.service';
import { CreateAmcDto } from './dto/amc.dto';
import { UpdateAmcDto } from './dto/amc.dto';
import { AmcEntity } from './entity/amc.entity';
import { JwtGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('amc')
export class AmcController {
  constructor(private readonly amcService: AmcService) {}

  @Post()
  async create(@Body() createAmcDto: CreateAmcDto): Promise<AmcEntity> {
    return this.amcService.create(createAmcDto);
  }

  @Get()
  async findAll(): Promise<AmcEntity[]> {
    return this.amcService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AmcEntity> {
    return this.amcService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAmcDto: UpdateAmcDto,
  ): Promise<AmcEntity> {
    return this.amcService.update(id, updateAmcDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.amcService.remove(id);
  }
}
