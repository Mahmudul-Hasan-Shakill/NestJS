import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhysicalEntity } from './entity/physical.entity';
import { VmEntity } from '../vm/entity/vm.entity';
import { PhysicalService } from './physical.service';
import { PhysicalController } from './physical.controller';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RoleEntity } from 'src/role/entity/role.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhysicalEntity, VmEntity, RoleEntity, UserEntity])],
  controllers: [PhysicalController],
  providers: [PhysicalService, PermissionsGuard],
})
export class PhysicalModule {}
