// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
//   Logger,
// } from '@nestjs/common';
// import { Request, Response } from 'express';

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   private readonly logger = new Logger(AllExceptionsFilter.name);

//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     const status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;

//     const exceptionResponse =
//       exception instanceof HttpException ? exception.getResponse() : null;

//     const message =
//       typeof exceptionResponse === 'string'
//         ? exceptionResponse
//         : (exceptionResponse as any)?.message || 'Internal server error';

//     this.logger.error(
//       `Exception thrown at ${request.method} ${request.url}`,
//       JSON.stringify({
//         statusCode: status,
//         message,
//         stack: (exception as any)?.stack,
//       }),
//     );

//     response.status(status).json({
//       isSuccessful: false,
//       message,
//     });
//   }
// }

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorType = 'InternalServerError';
    let errors: string[] | undefined = undefined;

    // Handle built-in & custom HttpExceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const obj = res as Record<string, any>;
        message = obj.message || obj.error || message;
        errorType = obj.error || errorType;
        if (Array.isArray(obj.message)) {
          errors = obj.message;
          message = obj.message.join(', ');
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorType = exception.name;
    }

    // Logging (always log full info for server)
    this.logger.error(
      `[${request.method}] ${request.url} [${status}] ${message}`,
      (exception as any)?.stack || '',
    );

    // Only show stack in non-production
    const isDev = process.env.NODE_ENV !== 'production';

    response.status(status).json({
      isSuccessful: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      errorType,
      errors,
      ...(isDev && { stack: (exception as any)?.stack }),
    });
  }
}
