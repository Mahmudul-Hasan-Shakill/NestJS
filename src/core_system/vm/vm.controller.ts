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
} from '@nestjs/swagger';

// RBAC Imports
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import {
  AppModules,
  PermissionActions,
} from '../../common/enums/permissions.enum';

@ApiBearerAuth('access-token')
@ApiTags('VM Inventory')
@UseGuards(JwtGuard, PermissionsGuard)
@Controller('vm')
export class VmController {
  constructor(private readonly vmService: VmService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new VM record' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'VM created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @RequirePermissions({ [AppModules.VM]: [PermissionActions.CREATE] })
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
  @RequirePermissions({ [AppModules.VM]: [PermissionActions.READ] })
  async findAll() {
    return this.vmService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single VM record by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'VM found.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'VM not found.' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findOne(@Param('id') id: number) {
    return this.vmService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing VM record by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'VM updated successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'VM not found.' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @RequirePermissions({ [AppModules.VM]: [PermissionActions.UPDATE] })
  async update(@Param('id') id: number, @Body() dto: UpdateVmDto) {
    return this.vmService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a VM record by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'VM removed successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'VM not found.' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  @RequirePermissions({ [AppModules.VM]: [PermissionActions.DELETE] })
  async remove(@Param('id') id: number) {
    return this.vmService.remove(id);
  }
}
