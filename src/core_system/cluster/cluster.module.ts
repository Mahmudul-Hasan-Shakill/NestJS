import { Module } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { ClusterController } from './cluster.controller';
import { ClusterEntity } from './entity/cluster.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RoleEntity } from 'src/role/entity/role.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClusterEntity, RoleEntity, UserEntity])],
  controllers: [ClusterController],
  providers: [ClusterService, PermissionsGuard],
})
export class ClusterModule {}
