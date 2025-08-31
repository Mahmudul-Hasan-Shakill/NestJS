// import { Module } from '@nestjs/common';
// import { UserModule } from './user/user.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from './auth/auth.module';
// import { ConfigService, ConfigModule } from '@nestjs/config';
// import { getDatabaseConfig } from '../ormconfig';
// import { RoleModule } from './role/role.module';
// import { AmcModule } from './core_system/amc/amc.module';
// import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
// import { APP_GUARD } from '@nestjs/core';
// import { AppController } from './app.controller';
// import { EncryptionService } from './auth/strategies/encryption.service';
// import { VmModule } from './core_system/vm/vm.module';
// import { ApplicationModule } from './core_system/application/application.module';
// import { DatabaseModule } from './core_system/database/database.module';
// import { PhysicalModule } from './core_system/physical/physical.module';
// import { UploadService } from './upload/upload.service';
// import { AutomationModule } from './core_system/automation/automation.module';
// import { ClusterModule } from './core_system/cluster/cluster.module';
// import { UploadModule } from './upload/upload.module';
// import { DocumentModule } from './document/document.module';
// import { PhysicalHostModule } from './core_system/physical_host/physical-host.module';
// import { DynamicSchemaModule } from './dynamic_schema/dynamic-schema.module';
// import { FilesystemModule } from './core_system/filesystem/filesystem.module';
// import { AppLogModule } from './logging/app-log.module';
// @Module({
//   imports: [
//     ThrottlerModule.forRoot({
//       throttlers: [
//         {
//           ttl: 5000, //5 seconds
//           limit: 100,
//         },
//       ],
//     }),
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: (configService: ConfigService) =>
//         getDatabaseConfig(configService),
//       inject: [ConfigService],
//     }),
//     TypeOrmModule.forFeature(),
//     AuthModule,
//     UserModule,
//     RoleModule,
//     AmcModule,
//     VmModule,
//     ApplicationModule,
//     DatabaseModule,
//     PhysicalModule,
//     AutomationModule,
//     ClusterModule,
//     UploadModule,
//     DocumentModule,
//     PhysicalHostModule,
//     DynamicSchemaModule,
//     FilesystemModule,
//     AppLogModule,
//   ],
//   controllers: [AppController],
//   providers: [
//     {
//       provide: APP_GUARD,
//       useClass: ThrottlerGuard,
//     },
//     EncryptionService,
//     UploadService,
//   ],
//   exports: [EncryptionService],
// })
// export class AppModule {}

import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { getDatabaseConfig } from '../ormconfig';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { EncryptionService } from './auth/strategies/encryption.service';

import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';

import { AmcModule } from './core_system/amc/amc.module';
import { VmModule } from './core_system/vm/vm.module';
import { ApplicationModule } from './core_system/application/application.module';
import { DatabaseModule } from './core_system/database/database.module';
import { PhysicalModule } from './core_system/physical/physical.module';
import { AutomationModule } from './core_system/automation/automation.module';
import { ClusterModule } from './core_system/cluster/cluster.module';
import { UploadModule } from './upload/upload.module';
import { DocumentModule } from './document/document.module';
import { PhysicalHostModule } from './core_system/physical_host/physical-host.module';
import { DynamicSchemaModule } from './dynamic_schema/dynamic-schema.module';
import { FilesystemModule } from './core_system/filesystem/filesystem.module';

import { AppLogModule } from './logging/app-log.module';
import { RequestContextMiddleware } from './logging/middlewares/request-context.middleware';
import { HttpLoggerMiddleware } from './logging/middlewares/http-logger.middleware';
import { CookiesModule } from './common/cookies/cookies.module';
import { DeviceModule } from './device/device.module';

@Module({
  imports: [
    // Rate limiting
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 5000, // 5 seconds
          limit: 100,
        },
      ],
    }),

    // Env config
    ConfigModule.forRoot({ isGlobal: true }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UserModule,
    RoleModule,
    AmcModule,
    VmModule,
    ApplicationModule,
    DatabaseModule,
    PhysicalModule,
    AutomationModule,
    ClusterModule,
    UploadModule,
    DocumentModule,
    PhysicalHostModule,
    DynamicSchemaModule,
    FilesystemModule,
    AppLogModule,
    CookiesModule,
    DeviceModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    EncryptionService,
  ],
  exports: [EncryptionService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Order matters: request context first, then HTTP logger
    consumer
      .apply(RequestContextMiddleware, HttpLoggerMiddleware)
      .forRoutes('*');
  }
}
