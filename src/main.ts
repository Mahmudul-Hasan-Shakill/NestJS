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
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  // Create the Nest application
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // Access configuration service
  const logger = new Logger('Bootstrap'); // Initialize logger for bootstrapping

  // Parse cookies
  app.use(cookieParser()); // CSRF protection middleware

  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      },
    }),
  );

  // Global validation pipe to validate incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that are not defined in the DTO
      forbidNonWhitelisted: true, // Reject requests with non-whitelisted properties
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Helmet middleware for securing HTTP headers
  app.use(helmet());

  // HTTP request logging
  app.use(morgan('combined'));

  // Enable response compression
  app.use(compression());

  // // CORS configuration
  const allowedOrigins =
    configService.get<string>('CORS_ORIGIN')?.split(',') || [];
  app.enableCors({
    origin: allowedOrigins, // Allow specified origins
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Accept, Authorization', // Allowed headers
    exposedHeaders: 'Authorization', // Expose Authorization header to client
  });

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
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Inventory Management System')
    .setDescription('API description of Inventory Management System')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // Swagger path: http://localhost:4000/api/docs
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
