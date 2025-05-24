import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { ServerEntity } from './entity/server.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ServerEntity])],
  controllers: [ServerController],
  providers: [ServerService, ConfigService],
})
export class ServerModule {}
