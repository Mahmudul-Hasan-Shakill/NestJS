import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { getDatabaseConfig } from '../ormconfig';
import { RoleModule } from './role/role.module';
import { ServerModule } from './core_system/server/server.module';
import { AmcModule } from './core_system/amc/amc.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { DynamicSchemaEntity } from './dynamic_schema/entity/dynamic-schema.entity';
import { DynamicSchemaController } from './dynamic_schema/dynamic-schema.controller';
import { DynamicSchemaService } from './dynamic_schema/dynamic-schema.service';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, //60 seconds
          limit: 10,
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
    ServerModule,
    AmcModule,
  ],
  controllers: [AppController, DynamicSchemaController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    DynamicSchemaService,
  ],
})
export class AppModule {}
