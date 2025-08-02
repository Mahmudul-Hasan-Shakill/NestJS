import { SetMetadata } from '@nestjs/common';
import { PermissionActions } from '../enums/permissions.enum';

export const GUI_PERMISSIONS_KEY = 'gui_permissions';

export const RequireGuiPermissions = (
  actions: PermissionActions[],
  guiPath?: string, // Optional. If not provided, auto-map.
) => SetMetadata(GUI_PERMISSIONS_KEY, { actions, guiPath });
