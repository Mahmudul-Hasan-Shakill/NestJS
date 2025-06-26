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
@Controller('amc')
export class AmcController {
  constructor(private readonly amcService: AmcService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createAmcDto: CreateAmcDto): Promise<AmcEntity> {
    return this.amcService.create(createAmcDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(): Promise<AmcEntity[]> {
    return this.amcService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AmcEntity> {
    return this.amcService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAmcDto: UpdateAmcDto,
  ): Promise<AmcEntity> {
    return this.amcService.update(id, updateAmcDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.amcService.remove(id);
  }
}
