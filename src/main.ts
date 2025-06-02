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
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: 'Authorization',
    optionsSuccessStatus: 200,
  });

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
  // app.use(
  //   (
  //     _req: any,
  //     res: { setTimeout: (arg0: number) => void },
  //     next: () => void,
  //   ) => {
  //     res.setTimeout(5000); // Set timeout to 10 seconds
  //     next();
  //   },
  // );

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
