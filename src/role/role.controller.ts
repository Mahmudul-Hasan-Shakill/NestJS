import {
  Controller,
  Body,
  Param,
  Get,
  Delete,
  ParseIntPipe,
  UseGuards,
  Put,
  UsePipes,
  ValidationPipe,
  Post,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { RoleService } from './role.service';
import { RoleDto } from './dtos/role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('roles')
@UseGuards(JwtGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  getAllRoles(): any {
    return this.roleService.getAllRoles();
  }

  @Get('/names')
  getRoleNames(): any {
    return this.roleService.getRoleNames();
  }

  @Get('/gui')
  getGuiNames(): any {
    return this.roleService.getGuiNames();
  }

  @Get('/gui/:roleName')
  getGuiByRoleName(@Param('roleName') roleName: string): any {
    return this.roleService.getGuiByRoleName(roleName);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createRoles(@Body() roleDtos: RoleDto[]): any {
    return this.roleService.createRoles(roleDtos);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe())
  updateRoleById(
    @Param('id', ParseIntPipe) id: number,
    @Body() roleDto: RoleDto,
  ): any {
    return this.roleService.updateRoleById(id, roleDto);
  }

  @Put()
  @UsePipes(new ValidationPipe())
  updateRole(@Body() roleData: UpdateRoleDto): any {
    return this.roleService.updateRole(roleData);
  }

  @Delete('/:id')
  deleteRoleById(@Param('id', ParseIntPipe) id: number): any {
    return this.roleService.deleteRoleById(id);
  }
}
