// src/common/cookies/cookies.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions } from 'express';

type SameSiteOpt = 'lax' | 'strict' | 'none';

@Injectable()
export class CookiesService {
  constructor(private readonly config: ConfigService) {}

  private sameSite(): SameSiteOpt {
    const v = (
      this.config.get<string>('COOKIE_SAMESITE') || 'lax'
    ).toLowerCase();
    if (v === 'strict' || v === 'none') return v as SameSiteOpt;
    return 'lax';
  }

  private secure(): boolean {
    return String(this.config.get('COOKIE_SECURE')).toLowerCase() === 'true';
  }

  private domain(): string | undefined {
    const d = this.config.get<string>('COOKIE_DOMAIN');
    return d && d.trim() !== '' ? d : undefined;
  }

  private baseOptions(maxAgeMs: number): CookieOptions {
    return {
      path: '/',
      domain: this.domain(),
      sameSite: this.sameSite() as any,
      secure: this.secure(),
      maxAge: maxAgeMs, // preferred over expires
    };
  }

  accessOptions(maxAgeMs: number): CookieOptions {
    const httpOnly =
      String(this.config.get('COOKIE_HTTPONLY_ACCESS')).toLowerCase() ===
      'true';
    return { ...this.baseOptions(maxAgeMs), httpOnly };
  }

  miscOptions(maxAgeMs: number): CookieOptions {
    const httpOnly =
      String(this.config.get('COOKIE_HTTPONLY_MISC')).toLowerCase() === 'true';
    return { ...this.baseOptions(maxAgeMs), httpOnly };
  }

  clearAccess(): CookieOptions {
    const o = this.accessOptions(0);
    return { ...o, maxAge: 0 };
  }

  clearMisc(): CookieOptions {
    const o = this.miscOptions(0);
    return { ...o, maxAge: 0 };
  }
}
