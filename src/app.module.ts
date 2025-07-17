import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { getDatabaseConfig } from '../ormconfig';
import { RoleModule } from './role/role.module';
import { AmcModule } from './core_system/amc/amc.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { DynamicSchemaEntity } from './dynamic_schema/entity/dynamic-schema.entity';
import { DynamicSchemaController } from './dynamic_schema/dynamic-schema.controller';
import { DynamicSchemaService } from './dynamic_schema/dynamic-schema.service';
import { EncryptionService } from './auth/strategies/encryption.service';
import { VmModule } from './core_system/vm/vm.module';
import { ApplicationModule } from './core_system/application/application.module';
import { DatabaseModule } from './core_system/database/database.module';
import { PhysicalModule } from './core_system/physical/physical.module';
import { UploadController } from './upload/upload.controller';
import { UploadService } from './upload/upload.service';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 5000, //5 seconds
          limit: 100,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([DynamicSchemaEntity]),
    AuthModule,
    UserModule,
    RoleModule,
    AmcModule,
    VmModule,
    ApplicationModule,
    DatabaseModule,
    PhysicalModule,
  ],
  controllers: [AppController, DynamicSchemaController, UploadController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    DynamicSchemaService,
    EncryptionService,
    UploadService,
  ],
  exports: [EncryptionService],
})
export class AppModule {}
