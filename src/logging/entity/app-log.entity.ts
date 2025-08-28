// src/logging/entity/app-log.entity.ts
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type AppLogLevel =
  | 'log'
  | 'error'
  | 'warn'
  | 'debug'
  | 'verbose'
  | 'http';

@Entity({ name: 'app_log' })
@Index('idx_app_log_created_at', ['createdAt'])
@Index('idx_app_log_level', ['level'])
@Index('idx_app_log_req_id', ['reqId'])
export class AppLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 16 })
  level: AppLogLevel;

  @Column({ type: 'varchar', length: 255, nullable: true })
  context: string | null;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'jsonb', default: () => `'{}'::jsonb'` })
  meta: Record<string, any>;

  // Correlation
  @Column({ type: 'varchar', length: 64, nullable: true, name: 'req_id' })
  reqId: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true, name: 'user_id' })
  userId: string | null;

  // HTTP (when level = http)
  @Column({ type: 'varchar', length: 8, nullable: true })
  method: string | null;

  @Column({ type: 'text', nullable: true })
  url: string | null;

  @Column({ type: 'int', nullable: true, name: 'status_code' })
  statusCode: number | null;

  @Column({ type: 'double precision', nullable: true, name: 'response_time_ms' })
  responseTimeMs: number | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ip: string | null;

  @Column({ type: 'text', nullable: true, name: 'user_agent' })
  userAgent: string | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;
}
