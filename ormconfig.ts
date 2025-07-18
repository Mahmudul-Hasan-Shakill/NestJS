import { ConfigService } from '@nestjs/config';
import { AmcEntity } from './src/core_system/amc/entity/amc.entity';
import { RoleEntity } from './src/role/entities/role.entity';
import { UserEntity } from './src/user/entity/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DynamicSchemaEntity } from './src/dynamic_schema/entity/dynamic-schema.entity';
import { VmEntity } from 'src/core_system/vm/entity/vm.entity';
import { ApplicationEntity } from 'src/core_system/application/entity/application.entity';
import { DatabaseEntity } from 'src/core_system/database/entity/database.entity';
import { PhysicalEntity } from 'src/core_system/physical/entity/physical.entity';
import { AutomationEntity } from 'src/core_system/automation/entity/automation.entity';

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
      AmcEntity,
      DynamicSchemaEntity,
      VmEntity,
      ApplicationEntity,
      DatabaseEntity,
      PhysicalEntity,
      AutomationEntity,
    ],
    synchronize: true,
  };
};

export default (configService: ConfigService) =>
  getDatabaseConfig(configService);
