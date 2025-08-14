import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmcEntity } from './entity/amc.entity';
import { AmcService } from './amc.service';
import { AmcController } from './amc.controller';
import { DocumentModule } from 'src/document/document.module';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RoleEntity } from 'src/role/entity/role.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AmcEntity, RoleEntity, UserEntity]),
    DocumentModule,
  ],
  controllers: [AmcController],
  providers: [AmcService, PermissionsGuard],
  exports: [AmcService],
})
export class AmcModule {}
