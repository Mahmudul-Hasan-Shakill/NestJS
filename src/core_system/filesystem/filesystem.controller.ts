// src/core_system/filesystem/filesystem.controller.ts
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilesystemService } from './filesystem.service';
import { CreateFilesystemDto, UpdateFilesystemDto } from './dto/filesystem.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

// RBAC Imports
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequireGuiPermissions } from 'src/common/decorators/require-gui-permissions.decorator';
import { PermissionActions } from '../../common/enums/permissions.enum';

@ApiBearerAuth('access-token')
@ApiTags('Filesystem')
@UseGuards(JwtGuard /*, PermissionsGuard */)
@Controller('filesystem')
export class FilesystemController {
  constructor(private readonly svc: FilesystemService) {}

  @Post()
  @RequireGuiPermissions([PermissionActions.CREATE])
  create(@Body() dto: CreateFilesystemDto) {
    return this.svc.create(dto);
  }

  @Get()
  @RequireGuiPermissions([PermissionActions.READ])
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @RequireGuiPermissions([PermissionActions.READ])
  findOne(@Param('id') id: number) {
    return this.svc.findOne(+id);
  }

  @Patch(':id')
  @RequireGuiPermissions([PermissionActions.UPDATE])
  update(@Param('id') id: number, @Body() dto: UpdateFilesystemDto) {
    return this.svc.update(+id, dto);
  }

  @Delete(':id')
  @RequireGuiPermissions([PermissionActions.DELETE])
  remove(@Param('id') id: number) {
    return this.svc.remove(+id);
  }
}
