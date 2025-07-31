import { SetMetadata } from '@nestjs/common';
import { AppModules, PermissionActions } from '../enums/permissions.enum';

export type RequiredPermissions = {
  [key in AppModules]?: PermissionActions[];
};

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermissions = (...permissions: RequiredPermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
