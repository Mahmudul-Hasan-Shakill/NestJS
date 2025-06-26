import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VmEntity } from './entity/vm.entity';
import { ApplicationEntity } from '../application/entity/application.entity';
import { DatabaseEntity } from '../database/entity/database.entity';
import { VmService } from './vm.service';
import { VmController } from './vm.controller';
import { PhysicalEntity } from '../physical/entity/physical.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VmEntity,
      ApplicationEntity,
      DatabaseEntity,
      PhysicalEntity,
    ]),
  ],
  controllers: [VmController],
  providers: [VmService],
})
export class VmModule {}
