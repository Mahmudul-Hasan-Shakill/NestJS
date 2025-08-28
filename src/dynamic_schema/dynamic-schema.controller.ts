import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DynamicSchemaService } from './dynamic-schema.service';
import { UpsertFieldDto } from './dto/upsert-field.dto';
import { RemoveFieldDto } from './dto/remove-field.dto';
import { ReorderFieldsDto } from './dto/reorder-fields.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';

// If you have a permissions guard, add it here as well
// import { PermissionsGuard } from '../common/guards/permissions.guard';
// import { RequireGuiPermissions } from '../common/decorators/require-gui-permissions.decorator';
// import { PermissionActions } from '../common/enums/permissions.enum';

@ApiBearerAuth('access-token')
@ApiTags('Dynamic Schema')
@UseGuards(JwtGuard /*, PermissionsGuard*/)
@Controller('dynamic-fields')
export class DynamicSchemaController {
  constructor(private readonly svc: DynamicSchemaService) {}

  // Create or update a field definition
  @Post('upsert')
  // @RequireGuiPermissions([PermissionActions.UPDATE])
  upsert(@Body() dto: UpsertFieldDto) {
    return this.svc.upsertField(dto);
  }

  // Deactivate (soft-delete) a field
  @Post('remove')
  // @RequireGuiPermissions([PermissionActions.UPDATE])
  remove(@Body() dto: RemoveFieldDto) {
    return this.svc.removeField(dto);
  }

  // Reorder fields for a table
  @Post('reorder')
  // @RequireGuiPermissions([PermissionActions.UPDATE])
  reorder(@Body() dto: ReorderFieldsDto) {
    return this.svc.reorder(dto);
  }

  // UI schema for a table
  @Get(':table/schema')
  // @RequireGuiPermissions([PermissionActions.READ])
  getSchema(@Param('table') table: string) {
    return this.svc.getUiSchema(table);
  }
}
