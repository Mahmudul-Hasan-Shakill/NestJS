// ormconfig.ts (minimal, development only)
import { ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

// --- Entities ---
import { AmcEntity } from './src/core_system/amc/entity/amc.entity';
import { RoleEntity } from './src/role/entity/role.entity';
import { UserEntity } from './src/user/entity/user.entity';
import { VmEntity } from './src/core_system/vm/entity/vm.entity';
import { ApplicationEntity } from './src/core_system/application/entity/application.entity';
import { DatabaseEntity } from './src/core_system/database/entity/database.entity';
import { PhysicalEntity } from './src/core_system/physical/entity/physical.entity';
import { AutomationEntity } from './src/core_system/automation/entity/automation.entity';
import { ClusterEntity } from './src/core_system/cluster/entity/cluster.entity';
import { DocumentEntity } from './src/document/entity/document.entity';
import { PhysicalHostEntity } from './src/core_system/physical_host/entity/physical-host.entity';
import { DynamicFieldEntity } from './src/dynamic_schema/entity/dynamic-field.entity';
import { FilesystemEntity } from 'src/core_system/filesystem/entity/filesystem.entity';
import { AppLogEntity } from 'src/logging/entity/app-log.entity';
import { DeviceEntity } from 'src/device/entity/device.entity';

export const getDatabaseConfig = (
  config: ConfigService,
): PostgresConnectionOptions => ({
  type: 'postgres',
  host: config.get<string>('DB_HOST'),
  port: Number(config.get<string>('DB_PORT') ?? 5432),
  username: config.get<string>('DB_USER'),
  password: config.get<string>('DB_PASSWORD'),
  database: config.get<string>('DB_DATABASE'),
  schema: config.get<string>('DB_SCHEMA') || 'public',

  synchronize: false,
  dropSchema: false,

  logging: true,

  entities: [
    UserEntity,
    RoleEntity,
    AmcEntity,
    DocumentEntity,
    VmEntity,
    ApplicationEntity,
    DatabaseEntity,
    PhysicalEntity,
    AutomationEntity,
    ClusterEntity,
    PhysicalHostEntity,
    DynamicFieldEntity,
    FilesystemEntity,
    AppLogEntity,
    DeviceEntity,
  ],
});

export default (configService: ConfigService) =>
  getDatabaseConfig(configService);
