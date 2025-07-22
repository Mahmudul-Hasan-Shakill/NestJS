import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseEntity } from './entity/database.entity';
import { VmEntity } from '../vm/entity/vm.entity';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { AutomationEntity } from '../automation/entity/automation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DatabaseEntity, VmEntity, AutomationEntity]),
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService],
})
export class DatabaseModule {}
