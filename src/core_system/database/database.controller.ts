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
import { DatabaseService } from './database.service';
import { CreateDatabaseDto, UpdateDatabaseDto } from './dto/database.dto';
import { JwtGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// RBAC Imports
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequireGuiPermissions } from 'src/common/decorators/require-gui-permissions.decorator';
import { PermissionActions } from '../../common/enums/permissions.enum';

@ApiBearerAuth('access-token')
@ApiTags('Database Inventory')
@UseGuards(JwtGuard, PermissionsGuard)
@Controller('database')
export class DatabaseController {
  constructor(private readonly dbService: DatabaseService) {}

  @Post()
  @RequireGuiPermissions([PermissionActions.CREATE])
  async create(@Body() dto: CreateDatabaseDto) {
    return this.dbService.create(dto);
  }

  @Get()
  @RequireGuiPermissions([PermissionActions.READ])
  async findAll() {
    return this.dbService.findAll();
  }

  @Get(':id')
  @RequireGuiPermissions([PermissionActions.READ])
  async findOne(@Param('id') id: number) {
    return this.dbService.findOne(id);
  }

  @Patch(':id')
  @RequireGuiPermissions([PermissionActions.READ])
  async update(@Param('id') id: number, @Body() dto: UpdateDatabaseDto) {
    return this.dbService.update(id, dto);
  }

  @Delete(':id')
  @RequireGuiPermissions([PermissionActions.DELETE])
  async remove(@Param('id') id: number) {
    return this.dbService.remove(id);
  }
}
