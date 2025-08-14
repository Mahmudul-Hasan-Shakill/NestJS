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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DatabaseEntity,
      VmEntity,
      AutomationEntity,
      RoleEntity,
      UserEntity
    ]),
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService, PermissionsGuard],
})
export class DatabaseModule {}
