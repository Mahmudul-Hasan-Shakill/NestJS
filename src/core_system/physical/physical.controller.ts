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

// RBAC Imports
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequireGuiPermissions } from 'src/common/decorators/require-gui-permissions.decorator';
import { PermissionActions } from '../../common/enums/permissions.enum';

@ApiBearerAuth('access-token')
@ApiTags('Physical Server Inventory')
@UseGuards(JwtGuard, PermissionsGuard)
@Controller('physical')
export class PhysicalController {
  constructor(private readonly physicalService: PhysicalService) {}

  @Post()
  @RequireGuiPermissions([PermissionActions.CREATE])
  async create(@Body() dto: CreatePhysicalDto) {
    return this.physicalService.create(dto);
  }

  @Get()
  @RequireGuiPermissions([PermissionActions.READ])
  async findAll() {
    return this.physicalService.findAll();
  }

  @Get(':id')
  @RequireGuiPermissions([PermissionActions.READ])
  async findOne(@Param('id') id: number) {
    return this.physicalService.findOne(id);
  }

  @Patch(':id')
  @RequireGuiPermissions([PermissionActions.UPDATE])
  async update(@Param('id') id: number, @Body() dto: UpdatePhysicalDto) {
    return this.physicalService.update(id, dto);
  }

  @Delete(':id')
  @RequireGuiPermissions([PermissionActions.DELETE])
  async remove(@Param('id') id: number) {
    return this.physicalService.remove(id);
  }
}
