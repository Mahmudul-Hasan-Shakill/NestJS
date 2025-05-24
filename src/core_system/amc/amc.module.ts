import { Module } from '@nestjs/common';
import { AmcService } from './amc.service';
import { AmcController } from './amc.controller';
import { AmcEntity } from './entity/amc.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([AmcEntity])],
  controllers: [AmcController],
  providers: [AmcService, ConfigService],
})
export class AmcModule {}
