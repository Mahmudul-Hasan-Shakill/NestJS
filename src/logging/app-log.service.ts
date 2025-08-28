// src/logging/app-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppLogEntity, AppLogLevel } from './entity/app-log.entity';

@Injectable()
export class AppLogService {
  constructor(
    @InjectRepository(AppLogEntity)
    private readonly repo: Repository<AppLogEntity>,
  ) {}

  /** fire-and-forget insert */
  private asyncInsert(payload: Partial<AppLogEntity>) {
    // Don’t await to avoid blocking req cycle
    this.repo.insert(payload as any).catch(() => {
      // swallow errors to not break prod path
    });
  }

  app(
    level: AppLogLevel,
    message: string,
    context?: string,
    meta?: any,
    reqId?: string,
    userId?: string,
  ) {
    this.asyncInsert({
      level,
      message,
      context: context ?? null,
      meta: meta ?? {},
      reqId: reqId ?? null,
      userId: userId ?? null,
    });
  }

  http(entry: {
    message?: string;
    method: string;
    url: string;
    statusCode: number;
    responseTimeMs: number;
    ip?: string | null;
    userAgent?: string | null;
    reqId?: string | null;
    userId?: string | null;
    meta?: any;
  }) {
    this.asyncInsert({
      level: 'http',
      message: entry.message ?? `${entry.method} ${entry.url}`,
      method: entry.method,
      url: entry.url,
      statusCode: entry.statusCode,
      responseTimeMs: entry.responseTimeMs,
      ip: entry.ip ?? null,
      userAgent: entry.userAgent ?? null,
      reqId: entry.reqId ?? null,
      userId: entry.userId ?? null,
      meta: entry.meta ?? {},
    });
  }
}
