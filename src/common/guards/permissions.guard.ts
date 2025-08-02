import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GUI_PERMISSIONS_KEY } from '../decorators/require-gui-permissions.decorator';
import { RoleEntity } from '../../role/entity/role.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { PermissionActions } from '../enums/permissions.enum';
import { getGuiPathsFromRequest } from '../helpers/api-to-gui-map';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private reflector: Reflector,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get metadata: which actions, maybe which GUI path explicitly
    const { actions, guiPath: metaGuiPath } =
      this.reflector.get<{ actions: PermissionActions[]; guiPath?: string }>(
        GUI_PERMISSIONS_KEY,
        context.getHandler(),
      ) || {};

    if (!actions) return true; // No permission metadata? Allow.

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.userRole) {
      throw new ForbiddenException('No user details found.');
    }

    // Which GUI paths do we check permissions for?
    let guiPaths: string[] = [];
    if (metaGuiPath) {
      guiPaths = [metaGuiPath];
    } else {
      guiPaths = getGuiPathsFromRequest(request);
    }
    if (!guiPaths.length) {
      this.logger.warn('Cannot auto-map API to GUI path(s). Check mapping.');
      throw new ForbiddenException(
        'Unable to determine GUI path for permission.',
      );
    }

    // Try all mapped GUI paths for the user's role. Allow if ANY one is permitted.
    for (const guiPath of guiPaths) {
      // Find the active role entry for this GUI
      const roleRow = await this.roleRepository.findOne({
        where: { roleName: user.userRole, hrefGui: guiPath, isActive: true },
      });
      if (!roleRow) continue;
      const perms = roleRow.permissions || {};
      const hasAll = actions.every((action) => !!perms[action]);
      if (hasAll) return true; // ALLOW on first positive match!
    }

    // If NONE of the mapped GUI paths are permitted
    this.logger.warn(
      `Role "${user.userRole}" lacks required permissions "${actions}" for any GUI assigned to this API. GUIs: ${guiPaths.join(', ')}`,
    );
    throw new ForbiddenException(
      'Insufficient permissions for any GUI mapped to this API.',
    );
  }
}
