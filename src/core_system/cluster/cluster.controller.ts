import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { CreateClusterDto, UpdateClusterDto } from './dto/cluster.dto';
import { JwtGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// RBAC Imports
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequireGuiPermissions } from 'src/common/decorators/require-gui-permissions.decorator';
import { PermissionActions } from '../../common/enums/permissions.enum';

@ApiBearerAuth('access-token')
@ApiTags('Cluster')
@UseGuards(JwtGuard, PermissionsGuard)
@Controller('cluster')
export class ClusterController {
  constructor(private readonly clusterService: ClusterService) {}

  @Post()
  @RequireGuiPermissions([PermissionActions.CREATE])
  async create(@Body() createClusterDto: CreateClusterDto) {
    return await this.clusterService.create(createClusterDto);
  }

  @Get()
  @RequireGuiPermissions([PermissionActions.READ])
  async findAll() {
    return await this.clusterService.findAll();
  }

  // Moved up to avoid route conflict with :id
  @Get('/names')
  @RequireGuiPermissions([PermissionActions.READ])
  getClusterNames(): any {
    return this.clusterService.getClusterNames();
  }

  @Get(':id')
  @RequireGuiPermissions([PermissionActions.READ])
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.clusterService.findOne(id);
  }

  @Patch(':id')
  @RequireGuiPermissions([PermissionActions.UPDATE])
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClusterDto: UpdateClusterDto,
  ) {
    return await this.clusterService.update(id, updateClusterDto);
  }

  @Delete(':id')
  @RequireGuiPermissions([PermissionActions.DELETE])
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.clusterService.remove(id);
  }
}
