// src/logging/request-context.service.ts
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContextData {
  reqId?: string;
  userId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}

@Injectable()
export class RequestContextService {
  private als = new AsyncLocalStorage<RequestContextData>();

  run(data: RequestContextData, cb: () => void) {
    this.als.run(data, cb);
  }

  get(): RequestContextData | undefined {
    return this.als.getStore();
  }
}
