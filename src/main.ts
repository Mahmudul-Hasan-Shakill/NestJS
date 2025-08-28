// import { Logger, ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';
// import helmet from 'helmet';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import * as morgan from 'morgan';
// import * as compression from 'compression';
// import * as express from 'express';
// import * as cookieParser from 'cookie-parser';
// import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
// import { NestExpressApplication } from '@nestjs/platform-express';

// async function bootstrap() {
//   // Create the Nest application
//   // const app = await NestFactory.create(AppModule);
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);
//   const configService = app.get(ConfigService);
//   const logger = new Logger('Bootstrap');

//   // Parse cookies
//   app.use(cookieParser());

//   // CORS configuration
//   const allowedOrigins =
//     configService.get<string>('CORS_ORIGIN')?.split(',') || [];

//   app.enableCors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
//     exposedHeaders: 'Authorization',
//     optionsSuccessStatus: 200,
//   });

//   // Global validation pipe to validate incoming requests
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

//   // Helmet middleware for securing HTTP headers
//   app.use(helmet());

//   // HTTP request logging
//   app.use(morgan('combined'));

//   // Enable response compression
//   app.use(compression());

//   // Set a global prefix for all routes
//   const prefix = configService.get<string>('PREFIX');
//   app.setGlobalPrefix(prefix);

//   // Set body size limits for JSON and URL-encoded data
//   app.use(express.json({ limit: '1mb' }));
//   app.use(express.urlencoded({ limit: '1mb', extended: true }));

//   // Global exception filter for consistent error handling
//   app.useGlobalFilters(new AllExceptionsFilter());

//   // Enable shutdown hooks for graceful shutdown
//   app.enableShutdownHooks();

//   app.useStaticAssets(configService.get<string>('UPLOAD_ROOT'), {
//     prefix: '/uploads/',
//   });

//   // Swagger Options
//   const config = new DocumentBuilder()
//     .setTitle('Inventory Management System')
//     .setDescription(
//       'API documentation for the Inventory Management System, which allows users to manage inventory items, track stock levels, and handle orders efficiently.',
//     )
//     .setVersion('1.0')
//     .addBearerAuth(
//       {
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT',
//         name: 'Authorization',
//         in: 'header',
//       },
//       'access-token',
//     )
//     .setLicense('MIT', 'https://opensource.org/licenses/MIT')
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup(`${prefix}/docs`, app, document);

//   // Start the application on the specified port
//   const port = configService.get<number>('PORT');
//   // await app.listen(port);
//   await app.listen(port, '0.0.0.0');
//   logger.log(`Application is running on: http://localhost:${port}`);

//   // Handle unhandled promise rejections
//   process.on('unhandledRejection', (reason, promise) => {
//     logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
//   });

//   // Handle uncaught exceptions
//   process.on('uncaughtException', (err) => {
//     logger.error(`Uncaught Exception: ${err.message}`);
//     process.exit(1);
//   });
// }

// bootstrap();

// main.ts
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DbLogger } from './logging/db-logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);

  // DB-backed logger
  const dbLogger = app.get(DbLogger);
  app.useLogger(dbLogger);

  // Parse cookies
  app.use(cookieParser());

  // Trust proxy for correct HTTPS/secure-cookie behavior behind LB/reverse proxy
  const trustProxyEnv = String(
    configService.get('TRUST_PROXY') ?? '0',
  ).toLowerCase();
  const trustProxy = trustProxyEnv === '1' || trustProxyEnv === 'true';
  if (trustProxy) {
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
  }

  // CORS (credentials required when sending cookies)
  const rawOrigins = (configService.get<string>('CORS_ORIGIN') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const corsOrigin = rawOrigins.length ? rawOrigins : true; // true mirrors request origin
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['Authorization'],
    optionsSuccessStatus: 200,
  });

  // Validation pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Helmet (relax CSP in dev so Swagger UI works easily)
  const isProd = process.env.NODE_ENV === 'production';
  app.use(
    helmet({
      contentSecurityPolicy: isProd ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Compression
  app.use(compression());

  // Global prefix (optional)
  const prefix = configService.get<string>('PREFIX') || '';
  if (prefix) app.setGlobalPrefix(prefix);

  // Body limits
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ limit: '1mb', extended: true }));

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Graceful shutdown hooks
  app.enableShutdownHooks();

  // Static uploads (optional)
  const uploadRoot = configService.get<string>('UPLOAD_ROOT');
  if (uploadRoot) {
    app.useStaticAssets(uploadRoot, { prefix: '/uploads/' });
  }

  // Swagger
  const swaggerConfig = new DocumentBuilder()
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

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerPath = prefix ? `${prefix}/docs` : 'docs';
  SwaggerModule.setup(swaggerPath, app, document);

  // Listen
  const port = Number(configService.get<number>('PORT') ?? 4000);
  await app.listen(port, '0.0.0.0');

  const logger = new Logger('Bootstrap');
  logger.log(
    `Application is running on: http://localhost:${port}${prefix ? `/${prefix}` : ''}`,
  );

  // Safety nets
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise as any, 'reason:', reason);
  });
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
}

bootstrap();
