// src/logging/middlewares/request-context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { randomUUID } from 'crypto';
import { RequestContextService } from '../request-context.service';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly ctx: RequestContextService) {}

  use(req: any, res: Response, next: NextFunction) {
    const reqId = req.headers['x-request-id'] || randomUUID();
    res.setHeader('x-request-id', reqId);

    // If you use JwtGuard, user info typically sits on req.user
    const userId = req.user?.sub ?? req.user?.id ?? null;

    const data = {
      reqId: String(reqId),
      userId,
      ip: req.ip || req.connection?.remoteAddress || null,
      userAgent: req.headers['user-agent'] || null,
    };

    this.ctx.run(data, next);
  }
}
