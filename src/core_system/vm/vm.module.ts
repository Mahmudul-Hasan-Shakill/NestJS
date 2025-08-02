import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VmEntity } from './entity/vm.entity';
import { ApplicationEntity } from '../application/entity/application.entity';
import { DatabaseEntity } from '../database/entity/database.entity';
import { VmService } from './vm.service';
import { VmController } from './vm.controller';
import { PhysicalEntity } from '../physical/entity/physical.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { RoleEntity } from 'src/role/entity/role.entity';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VmEntity,
      ApplicationEntity,
      DatabaseEntity,
      PhysicalEntity,
      RoleEntity,
      UserEntity,
    ]),
  ],
  controllers: [VmController],
  providers: [VmService, PermissionsGuard],
})
export class VmModule {}
