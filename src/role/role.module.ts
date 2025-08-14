import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entity/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { UserEntity } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, UserEntity])],
  controllers: [RoleController],
  providers: [RoleService, PermissionsGuard],
  exports: [RoleService],
})
export class RoleModule {}
