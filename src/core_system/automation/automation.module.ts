import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationEntity } from './entity/automation.entity';
import { ApplicationEntity } from '../application/entity/application.entity';
import { DatabaseEntity } from '../database/entity/database.entity';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AutomationEntity,
      ApplicationEntity,
      DatabaseEntity,
    ]),
  ],
  controllers: [AutomationController],
  providers: [AutomationService],
})
export class AutomationModule {}
