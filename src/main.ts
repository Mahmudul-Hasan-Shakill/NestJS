import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { Request, Response, NextFunction } from 'express';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  // Create the Nest application
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Parse cookies
  app.use(cookieParser());

  // CORS configuration
  const allowedOrigins =
    configService.get<string>('CORS_ORIGIN')?.split(',') || [];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-CSRF-Token'],
    exposedHeaders: 'Authorization',
  });

  // CSRF protection middleware
  // const csrfProtection = csurf({
  //   cookie: {
  //     httpOnly: true,
  //     secure: false,
  //     sameSite: 'strict',
  //   },
  // });

  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   const excludedPaths = [
  //     '/auth/refresh',
  //     '/csrf/token',
  //     '/docs',
  //     '/docs-json',
  //     '/favicon.ico',
  //   ];

  //   // Check if the request path is in the excluded paths
  //   if (excludedPaths.some((path) => req.path.startsWith(path))) {
  //     return next(); // Skip CSRF protection
  //   }

  //   // Apply CSRF protection
  //   csrfProtection(req, res, (err: any) => {
  //     if (err) {
  //       return next(err); // Pass the error to the next middleware
  //     }
  //     next();
  //   });
  // });

  // Global validation pipe to validate incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Helmet middleware for securing HTTP headers
  app.use(helmet());

  // HTTP request logging
  app.use(morgan('combined'));

  // Enable response compression
  app.use(compression());

  // Set a global prefix for all routes
  const prefix = configService.get<string>('PREFIX');
  app.setGlobalPrefix(prefix);

  // Set body size limits for JSON and URL-encoded data
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ limit: '1mb', extended: true }));

  // Global exception filter for consistent error handling
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enable shutdown hooks for graceful shutdown
  app.enableShutdownHooks();

  // Middleware to set a timeout for requests
  app.use(
    (
      _req: any,
      res: { setTimeout: (arg0: number) => void },
      next: () => void,
    ) => {
      res.setTimeout(10000); // Set timeout to 10 seconds
      next();
    },
  );

  // Swagger Options
  const config = new DocumentBuilder()
    .setTitle('Inventory Management System')
    .setDescription(
      'API documentation for the Inventory Management System, which allows users to manage inventory items, track stock levels, and handle orders efficiently.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    // .addApiKey(
    //   {
    //     type: 'apiKey',
    //     name: 'X-CSRF-Token',
    //     in: 'header',
    //   },
    //   'csrf-token',
    // )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/docs`, app, document);

  // Start the application on the specified port
  const port = configService.get<number>('PORT');
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1); // Exit the process with an error code
  });
}

bootstrap();
