import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseEntity } from './entity/database.entity';
import { VmEntity } from '../vm/entity/vm.entity';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DatabaseEntity, VmEntity])],
  controllers: [DatabaseController],
  providers: [DatabaseService],
})
export class DatabaseModule {}
