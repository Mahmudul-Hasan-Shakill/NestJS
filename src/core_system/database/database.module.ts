import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseEntity } from './entity/database.entity';
import { VmEntity } from '../vm/entity/vm.entity';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { AutomationEntity } from '../automation/entity/automation.entity';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RoleEntity } from 'src/role/entity/role.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { DynamicFieldEntity } from 'src/dynamic_schema/entity/dynamic-field.entity';
import { DynamicSchemaService } from 'src/dynamic_schema/dynamic-schema.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DatabaseEntity,
      VmEntity,
      AutomationEntity,
      RoleEntity,
      UserEntity,
      DynamicFieldEntity,
    ]),
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService, PermissionsGuard, DynamicSchemaService],
})
export class DatabaseModule {}
