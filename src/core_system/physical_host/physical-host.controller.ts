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
import { PhysicalHostService } from './physical-host.service';
import {
  CreatePhysicalHostDto,
  UpdatePhysicalHostDto,
} from './dto/physical-host.dto';
import { JwtGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequireGuiPermissions } from '../../common/decorators/require-gui-permissions.decorator';
import { PermissionActions } from '../../common/enums/permissions.enum';

@ApiBearerAuth('access-token')
@ApiTags('Inventory - Physical Hosts')
@UseGuards(JwtGuard, PermissionsGuard)
@Controller('physical-hosts')
export class PhysicalHostController {
  constructor(private readonly hostService: PhysicalHostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new physical host entry' })
  @RequireGuiPermissions([PermissionActions.CREATE])
  async create(@Body() dto: CreatePhysicalHostDto) {
    return this.hostService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all physical hosts' })
  @RequireGuiPermissions([PermissionActions.READ])
  async findAll() {
    return this.hostService.findAll();
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get summary statistics of physical hosts' })
  @RequireGuiPermissions([PermissionActions.READ])
  async getSummary() {
    return this.hostService.getHostSummary();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific physical host by ID' })
  @RequireGuiPermissions([PermissionActions.READ])
  async findOne(@Param('id') id: number) {
    return this.hostService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a physical host' })
  @RequireGuiPermissions([PermissionActions.UPDATE])
  async update(@Param('id') id: number, @Body() dto: UpdatePhysicalHostDto) {
    return this.hostService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a physical host' })
  @RequireGuiPermissions([PermissionActions.DELETE])
  async remove(@Param('id') id: number) {
    return this.hostService.remove(id);
  }
}
