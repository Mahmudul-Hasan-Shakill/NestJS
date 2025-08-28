// src/logging/app-log.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLogEntity } from './entity/app-log.entity';
import { AppLogService } from './app-log.service';
import { DbLogger } from './db-logger.service';
import { RequestContextService } from './request-context.service';
import { RequestContextMiddleware } from './middlewares/request-context.middleware';
import { HttpLoggerMiddleware } from './middlewares/http-logger.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([AppLogEntity])],
  providers: [
    AppLogService,
    DbLogger,
    RequestContextService,
    RequestContextMiddleware,
    HttpLoggerMiddleware,
  ],
  exports: [
    AppLogService,
    DbLogger,
    RequestContextService,
    RequestContextMiddleware,
    HttpLoggerMiddleware,
  ],
})
export class AppLogModule {}
