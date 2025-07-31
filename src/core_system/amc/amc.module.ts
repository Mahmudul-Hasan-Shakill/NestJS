import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmcEntity } from './entity/amc.entity';
import { AmcService } from './amc.service';
import { AmcController } from './amc.controller';
import { DocumentModule } from 'src/document/document.module';

@Module({
  imports: [TypeOrmModule.forFeature([AmcEntity]), DocumentModule],
  controllers: [AmcController],
  providers: [AmcService],
  exports: [AmcService],
})
export class AmcModule {}
