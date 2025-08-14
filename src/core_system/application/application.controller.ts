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

// RBAC Imports
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequireGuiPermissions } from 'src/common/decorators/require-gui-permissions.decorator';
import { PermissionActions } from '../../common/enums/permissions.enum';

@ApiBearerAuth('access-token')
@ApiTags('Application Inventory')
@UseGuards(JwtGuard, PermissionsGuard)
@Controller('application')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @Post()
  @RequireGuiPermissions([PermissionActions.CREATE])
  async create(@Body() dto: CreateApplicationDto) {
    return this.appService.create(dto);
  }

  @Get()
  @RequireGuiPermissions([PermissionActions.READ])
  async findAll() {
    return this.appService.findAll();
  }

  @Get(':id')
  @RequireGuiPermissions([PermissionActions.READ])
  async findOne(@Param('id') id: number) {
    return this.appService.findOne(id);
  }

  @Patch(':id')
  @RequireGuiPermissions([PermissionActions.UPDATE])
  async update(@Param('id') id: number, @Body() dto: UpdateApplicationDto) {
    return this.appService.update(id, dto);
  }

  @Delete(':id')
  @RequireGuiPermissions([PermissionActions.DELETE])
  async remove(@Param('id') id: number) {
    return this.appService.remove(id);
  }
}
