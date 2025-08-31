// src/device/device.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from './entity/device.entity';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { DynamicFieldEntity } from 'src/dynamic_schema/entity/dynamic-field.entity';
import { DynamicSchemaService } from 'src/dynamic_schema/dynamic-schema.service';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RoleEntity } from 'src/role/entity/role.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeviceEntity,
      DynamicFieldEntity,
      RoleEntity,
      UserEntity,
    ]),
  ],
  controllers: [DeviceController],
  providers: [
    DeviceService,
    DynamicSchemaService,
    PermissionsGuard,
    UserService,
  ],
  exports: [DeviceService],
})
export class DeviceModule {}
