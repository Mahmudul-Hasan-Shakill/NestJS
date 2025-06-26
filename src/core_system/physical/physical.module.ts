import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhysicalEntity } from './entity/physical.entity';
import { VmEntity } from '../vm/entity/vm.entity';
import { PhysicalService } from './physical.service';
import { PhysicalController } from './physical.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PhysicalEntity, VmEntity])],
  controllers: [PhysicalController],
  providers: [PhysicalService],
})
export class PhysicalModule {}
