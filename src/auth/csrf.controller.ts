import { Controller, Get, Req, Res } from '@nestjs/common';
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
  // @Get('token')
  // getCsrfToken(@Req() req: Request, @Res() res: Response) {
  //   const token = req.csrfToken();
  //   res.cookie('XSRF-TOKEN', token, {
  //     httpOnly: false, // must be accessible by frontend
  //     sameSite: 'strict',
  //     secure: false,
  //   });
  //   res.json({
  //     isSuccessful: true,
  //     message: 'CSRF token generated successfully',
  //     data: {
  //       csrfToken: token,
  //     },
  //   });
  // }
}
