import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationEntity } from './entity/automation.entity';
import { ApplicationEntity } from '../application/entity/application.entity';
import { DatabaseEntity } from '../database/entity/database.entity';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RoleEntity } from 'src/role/entity/role.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AutomationEntity,
      ApplicationEntity,
      DatabaseEntity,
      RoleEntity,
      UserEntity,
    ]),
  ],
  controllers: [AutomationController],
  providers: [AutomationService, PermissionsGuard],
})
export class AutomationModule {}
