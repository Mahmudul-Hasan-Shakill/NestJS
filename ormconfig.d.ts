import { ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
export declare const getDatabaseConfig: (configService: ConfigService) => PostgresConnectionOptions;
declare const _default: (configService: ConfigService) => PostgresConnectionOptions;
export default _default;
