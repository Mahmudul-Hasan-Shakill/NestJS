import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../../src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CsrfController } from './csrf.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TIME'),
        },
        // signOptions: { expiresIn: '30s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    RefreshJwtStrategy,
    ConfigService,
  ],
  controllers: [AuthController, CsrfController],
})
export class AuthModule {}
