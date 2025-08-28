// src/logging/middlewares/http-logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import * as morgan from 'morgan';
import { AppLogService } from '../app-log.service';
import { RequestContextService } from '../request-context.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private handler: any;

  constructor(
    private readonly logs: AppLogService,
    private readonly ctx: RequestContextService,
  ) {
    // custom morgan format → also persist to DB
    this.handler = morgan((tokens, req: any, res) => {
      const rt = Number(tokens['response-time'](req, res));
      const rtMs = Number.isFinite(rt) ? Math.round(rt) : 0;

      const method = tokens.method(req, res) as string;
      const url = tokens.url(req, res) as string;
      const status = Number(tokens.status(req, res)) || 0;
      const ip = tokens['remote-addr'](req, res) as string;
      const ua = tokens['user-agent'](req, res) as string;
      const contentLength = tokens.res(req, res, 'content-length');
      const referrer = tokens.referrer(req, res);

      // enrich with CLS data
      const c = this.ctx.get();

      // fire-and-forget
      this.logs.http({
        method,
        url,
        statusCode: status,
        responseTimeMs: rtMs,
        ip: ip || c?.ip || null,
        userAgent: ua || c?.userAgent || null,
        reqId: c?.reqId,
        userId: c?.userId,
        meta: { contentLength, referrer },
      });

      // compact console line
      return `${c?.reqId ?? '-'} ${method} ${url} ${status} ${rtMs}ms`;
    });
  }

  use(req: any, res: Response, next: NextFunction) {
    this.handler(req, res, next);
  }
}
