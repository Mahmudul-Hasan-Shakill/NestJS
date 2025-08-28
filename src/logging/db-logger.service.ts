// src/logging/db-logger.service.ts
import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { AppLogService } from './app-log.service';
import { RequestContextService } from './request-context.service';

@Injectable()
export class DbLogger extends ConsoleLogger implements LoggerService {
  constructor(
    private readonly logs: AppLogService,
    private readonly ctx: RequestContextService,
  ) {
    super();
  }

  private enrich() {
    const c = this.ctx.get();
    return { reqId: c?.reqId, userId: c?.userId };
  }

  log(message: any, context?: string) {
    super.log(message, context);
    const { reqId, userId } = this.enrich();
    this.logs.app('log', String(message), context, {}, reqId, userId);
  }

  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
    const { reqId, userId } = this.enrich();
    this.logs.app(
      'error',
      String(message),
      context,
      stack ? { stack } : {},
      reqId,
      userId,
    );
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    const { reqId, userId } = this.enrich();
    this.logs.app('warn', String(message), context, {}, reqId, userId);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
    const { reqId, userId } = this.enrich();
    this.logs.app('debug', String(message), context, {}, reqId, userId);
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
    const { reqId, userId } = this.enrich();
    this.logs.app('verbose', String(message), context, {}, reqId, userId);
  }
}
