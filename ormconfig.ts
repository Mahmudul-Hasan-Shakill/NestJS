import { ConfigService } from '@nestjs/config';
import { AmcEntity } from './src/core_system/amc/entity/amc.entity';
import { ServerEntity } from './src/core_system/server/entity/server.entity';
import { RoleEntity } from './src/role/entities/role.entity';
import { UserEntity } from './src/user/entity/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DynamicSchemaEntity } from 'src/dynamic_schema/entity/dynamic-schema.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): PostgresConnectionOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [
      UserEntity,
      RoleEntity,
      ServerEntity,
      AmcEntity,
      DynamicSchemaEntity,
    ],
    synchronize: true,
  };
};

export default (configService: ConfigService) =>
  getDatabaseConfig(configService);
