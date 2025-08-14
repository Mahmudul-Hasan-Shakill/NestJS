import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VmService } from './vm.service';
import { CreateVmDto, UpdateVmDto } from './dto/vm.dto';
import { JwtGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

// RBAC Imports
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequireGuiPermissions } from 'src/common/decorators/require-gui-permissions.decorator';
import { PermissionActions } from '../../common/enums/permissions.enum';

@ApiBearerAuth('access-token')
@ApiTags('VM Inventory')
@UseGuards(JwtGuard, PermissionsGuard)
@Controller('vm')
export class VmController {
  constructor(private readonly vmService: VmService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new VM record' })
  @ApiBody({ type: CreateVmDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'VM created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation or save failed.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  @RequireGuiPermissions([PermissionActions.CREATE])
  async create(@Body() dto: CreateVmDto) {
    return this.vmService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all VM records' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'VMs retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to retrieve VMs.',
  })
  async findAll() {
    return this.vmService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single VM record by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'VM found.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'VM not found.' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  @RequireGuiPermissions([PermissionActions.READ])
  async findOne(@Param('id') id: number) {
    return this.vmService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing VM record by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateVmDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'VM updated successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'VM not found.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation or save failed.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  @RequireGuiPermissions([PermissionActions.UPDATE])
  async update(@Param('id') id: number, @Body() dto: UpdateVmDto) {
    return this.vmService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a VM record by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'VM removed successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'VM not found.' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to delete VM.',
  })
  @RequireGuiPermissions([PermissionActions.DELETE])
  async remove(@Param('id') id: number) {
    return this.vmService.remove(id);
  }
}
