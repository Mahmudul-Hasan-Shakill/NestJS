// import {
//   Controller,
//   Body,
//   Param,
//   Get,
//   Delete,
//   ParseIntPipe,
//   UseGuards,
//   Put,
//   UsePipes,
//   ValidationPipe,
//   Post,
// } from '@nestjs/common';
// import { JwtGuard } from '../auth/guards/jwt-auth.guard';
// import { RoleService } from './role.service';
// import { RoleDto } from './dtos/role.dto';
// import { UpdateRoleDto } from './dtos/update-role.dto';
// import { ApiBearerAuth } from '@nestjs/swagger';

// @ApiBearerAuth('access-token')
// @Controller('roles')
// @UseGuards(JwtGuard)
// export class RoleController {
//   constructor(private readonly roleService: RoleService) {}

//   @Get()
//   getAllRoles(): any {
//     return this.roleService.getAllRoles();
//   }

//   @Get('/names')
//   getRoleNames(): any {
//     return this.roleService.getRoleNames();
//   }

//   @Get('/gui')
//   getGuiNames(): any {
//     return this.roleService.getGuiNames();
//   }

//   @Get('/gui/:roleName')
//   getGuiByRoleName(@Param('roleName') roleName: string): any {
//     return this.roleService.getGuiByRoleName(roleName);
//   }

//   @Post()
//   @UsePipes(new ValidationPipe())
//   createRoles(@Body() roleDtos: RoleDto[]): any {
//     return this.roleService.createRoles(roleDtos);
//   }

//   @Put('/:id')
//   @UsePipes(new ValidationPipe())
//   updateRoleById(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() roleDto: RoleDto,
//   ): any {
//     return this.roleService.updateRoleById(id, roleDto);
//   }

//   @Put()
//   @UsePipes(new ValidationPipe())
//   updateRole(@Body() roleData: UpdateRoleDto): any {
//     return this.roleService.updateRole(roleData);
//   }

//   @Delete('/:id')
//   deleteRoleById(@Param('id', ParseIntPipe) id: number): any {
//     return this.roleService.deleteRoleById(id);
//   }

//   @Delete('/name/:roleName')
//   deleteRoleByName(@Param('roleName') roleName: string): any {
//     return this.roleService.deleteRoleByName(roleName);
//   }
// }


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
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { RoleService } from './role.service';
import { RoleDto } from './dtos/role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'Get all roles and their GUI associations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Roles retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to retrieve roles.',
  })
  getAllRoles(): any {
    return this.roleService.getAllRoles();
  }

  @Get('/names')
  @ApiOperation({ summary: 'Get all distinct role names' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role names retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to retrieve role names.',
  })
  getRoleNames(): any {
    return this.roleService.getRoleNames();
  }

  @Get('/gui')
  @ApiOperation({ summary: 'Get all distinct GUI names across roles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'GUI names retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to retrieve GUI names.',
  })
  getGuiNames(): any {
    return this.roleService.getGuiNames();
  }

  @Get('/gui/:roleName')
  @ApiOperation({ summary: 'Get GUI access details by role name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'GUI retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to retrieve GUI by role name.',
  })
  getGuiByRoleName(@Param('roleName') roleName: string): any {
    return this.roleService.getGuiByRoleName(roleName);
  }

  @Post()
  @ApiOperation({
    summary:
      'Create one or more new role entries (roleName-hrefGui pairs) with permissions',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Roles inserted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Role-GUI pair already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @UsePipes(new ValidationPipe())
  createRoles(@Body() roleDtos: RoleDto[]): any {
    return this.roleService.createRoles(roleDtos);
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Update a single role entry by ID, including its permissions',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Role not found for update.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @UsePipes(new ValidationPipe())
  updateRoleById(
    @Param('id', ParseIntPipe) id: number,
    @Body() roleDto: RoleDto,
  ): any {
    return this.roleService.updateRoleById(id, roleDto);
  }

  @Put()
  @ApiOperation({
    summary:
      'Update active status of multiple GUI paths for a role and/or update global permissions for that role',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role updated successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @UsePipes(new ValidationPipe())
  updateRole(@Body() roleData: UpdateRoleDto): any {
    return this.roleService.updateRole(roleData);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a single role entry by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Role not found for deletion.',
  })
  deleteRoleById(@Param('id', ParseIntPipe) id: number): any {
    return this.roleService.deleteRoleById(id);
  }

  @Delete('/name/:roleName')
  @ApiOperation({
    summary: 'Delete all role entries associated with a specific role name',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All roles with Rolename deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No roles found with the given role name.',
  })
  deleteRoleByName(@Param('roleName') roleName: string): any {
    return this.roleService.deleteRoleByName(roleName);
  }
}
