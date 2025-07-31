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
import { ClusterService } from './cluster.service';
import { CreateClusterDto, UpdateClusterDto } from './dto/cluster.dto';
import { JwtGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Cluster')
@UseGuards(JwtGuard)
@Controller('cluster')
export class ClusterController {
  constructor(private readonly clusterService: ClusterService) {}

  @Post()
  async create(@Body() createClusterDto: CreateClusterDto) {
    return await this.clusterService.create(createClusterDto);
  }

  @Get()
  async findAll() {
    return await this.clusterService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.clusterService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateClusterDto: UpdateClusterDto,
  ) {
    return await this.clusterService.update(id, updateClusterDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.clusterService.remove(id);
  }
}
