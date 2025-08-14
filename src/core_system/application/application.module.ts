import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity } from './entity/application.entity';
import { VmEntity } from '../vm/entity/vm.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { AutomationEntity } from '../automation/entity/automation.entity';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RoleEntity } from 'src/role/entity/role.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApplicationEntity,
      VmEntity,
      AutomationEntity,
      RoleEntity,
      UserEntity,
    ]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, PermissionsGuard],
})
export class ApplicationModule {}
