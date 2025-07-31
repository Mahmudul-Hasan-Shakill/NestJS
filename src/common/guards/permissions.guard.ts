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
import {
  PERMISSIONS_KEY,
  RequiredPermissions,
} from '../decorators/require-permissions.decorator';
import { RoleEntity } from '../../role/entity/role.entity';
import { UserEntity } from 'src/user/entity/user.entity';

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
    const requiredPermissions = this.reflector.get<RequiredPermissions[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id || !user.userRole) {
      throw new ForbiddenException(
        'User authentication details missing for permission check.',
      );
    }

    const userRoleEntities = await this.roleRepository.find({
      where: { roleName: user.userRole, isActive: true },
    });

    if (!userRoleEntities || userRoleEntities.length === 0) {
      this.logger.warn(
        `User ${user.id} (${user.userRole}) has no active role definitions.`,
      );
      throw new ForbiddenException(
        'User has no active roles or permissions defined.',
      );
    }

    const aggregatedUserPermissions: Record<
      string,
      Record<string, boolean>
    > = {};
    userRoleEntities.forEach((roleEntity) => {
      if (roleEntity.permissions) {
        for (const moduleName in roleEntity.permissions) {
          if (roleEntity.permissions.hasOwnProperty(moduleName)) {
            if (!aggregatedUserPermissions[moduleName]) {
              aggregatedUserPermissions[moduleName] = {};
            }
            for (const actionName in roleEntity.permissions[moduleName]) {
              if (
                roleEntity.permissions[moduleName].hasOwnProperty(actionName) &&
                roleEntity.permissions[moduleName][actionName]
              ) {
                aggregatedUserPermissions[moduleName][actionName] = true;
              }
            }
          }
        }
      }
    });

    let hasAllRequiredPermissions = true;
    for (const reqPermObject of requiredPermissions) {
      for (const moduleName in reqPermObject) {
        if (reqPermObject.hasOwnProperty(moduleName)) {
          const requiredActions =
            reqPermObject[moduleName as keyof RequiredPermissions];
          if (requiredActions) {
            for (const actionName of requiredActions) {
              if (
                !aggregatedUserPermissions[moduleName] ||
                !aggregatedUserPermissions[moduleName][actionName]
              ) {
                this.logger.warn(
                  `User ${user.id} (${user.userRole}) missing permission: ${moduleName}:${actionName} for route ${context.getHandler().name}`,
                );
                hasAllRequiredPermissions = false;
                break;
              }
            }
          }
        }
        if (!hasAllRequiredPermissions) break;
      }
      if (!hasAllRequiredPermissions) break;
    }

    if (!hasAllRequiredPermissions) {
      throw new ForbiddenException(
        'You do not have sufficient permissions to perform this action.',
      );
    }

    return true;
  }
}
