import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity } from './entity/application.entity';
import { VmEntity } from '../vm/entity/vm.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { AutomationEntity } from '../automation/entity/automation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationEntity, VmEntity, AutomationEntity])],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
