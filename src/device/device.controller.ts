// src/device/device.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { DeviceService, AuthUserCtx } from './device.service';
import { CreateDeviceDto, UpdateDeviceDto } from './dto/device.dto';
import { RequireGuiPermissions } from 'src/common/decorators/require-gui-permissions.decorator';
import { PermissionActions } from 'src/common/enums/permissions.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { UserService } from '../user/user.service';

@Controller('device')
@UseGuards(JwtGuard, PermissionsGuard)
export class DeviceController {
  constructor(
    private readonly svc: DeviceService,
    private readonly userService: UserService,
  ) {}

  /** Ensure we pass role from JWT (userRole OR role) + hydrate unit from DB */
  private async resolveUserCtx(req: any): Promise<AuthUserCtx> {
    const jwtUser = req.user as {
      id: number;
      pin: string;
      userRole?: string;
      role?: string;
    };
    const role = jwtUser.userRole ?? jwtUser.role ?? '';
    let unit: string | undefined = undefined;

    try {
      const resp = await this.userService.getUserByPin(jwtUser.pin);
      unit = resp?.data?.unit ?? resp?.data?.department ?? undefined; // fallback to department if present
    } catch {
      // ignore; service will handle missing unit for non-root safely
    }

    return { id: jwtUser.id, pin: jwtUser.pin, role, unit };
  }

  @Post()
  @RequireGuiPermissions([PermissionActions.CREATE])
  async create(@Body() dto: CreateDeviceDto, @Req() req: any) {
    const user = await this.resolveUserCtx(req);
    return this.svc.create(dto, user);
  }

  @Get()
  @RequireGuiPermissions([PermissionActions.READ])
  async findAll(@Req() req: any) {
    const user = await this.resolveUserCtx(req);
    return this.svc.findAllForUser(user);
  }

  @Get(':id')
  @RequireGuiPermissions([PermissionActions.READ])
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const user = await this.resolveUserCtx(req);
    return this.svc.findOneForUser(id, user);
  }

  @Patch(':id')
  @RequireGuiPermissions([PermissionActions.UPDATE])
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeviceDto,
    @Req() req: any,
  ) {
    const user = await this.resolveUserCtx(req);
    return this.svc.updateForUser(id, dto, user);
  }

  @Delete(':id')
  @RequireGuiPermissions([PermissionActions.DELETE])
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const user = await this.resolveUserCtx(req);
    return this.svc.removeForUser(id, user);
  }
}
