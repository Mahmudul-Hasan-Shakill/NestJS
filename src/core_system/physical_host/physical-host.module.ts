import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhysicalHostEntity } from './entity/physical-host.entity';
import { PhysicalHostService } from './physical-host.service';
import { PhysicalHostController } from './physical-host.controller';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RoleEntity } from '../../role/entity/role.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhysicalHostEntity, RoleEntity, UserEntity]),
  ],
  controllers: [PhysicalHostController],
  providers: [PhysicalHostService, PermissionsGuard],
  exports: [PhysicalHostService],
})
export class PhysicalHostModule {}
