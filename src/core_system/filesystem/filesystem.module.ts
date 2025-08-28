// src/core_system/filesystem/filesystem.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesystemEntity } from './entity/filesystem.entity';
import { FilesystemService } from './filesystem.service';
import { FilesystemController } from './filesystem.controller';
import { DynamicFieldEntity } from 'src/dynamic_schema/entity/dynamic-field.entity';
import { DynamicSchemaService } from 'src/dynamic_schema/dynamic-schema.service';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { UserEntity } from 'src/user/entity/user.entity';
import { RoleEntity } from 'src/role/entity/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FilesystemEntity,
      DynamicFieldEntity,
      UserEntity,
      RoleEntity,
    ]),
  ],
  providers: [FilesystemService, DynamicSchemaService, PermissionsGuard],
  controllers: [FilesystemController],
  exports: [FilesystemService],
})
export class FilesystemModule {}
