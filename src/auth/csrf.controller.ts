import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('csrf')
export class CsrfController {
  @Get('token')
  getCsrfToken(@Req() req: Request) {
    return {
      isSuccessful: true,
      message: 'CSRF token generated successfully',
      data: {
        csrfToken: req.csrfToken(),
      },
    };
  }
}
