// src/core_system/filesystem/entity/filesystem.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FilesystemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // ==== Static columns (from your sheet) ====
  @Column()
  application: string;

  @Column({ name: 'node_name', nullable: true })
  node: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'backup_environment', nullable: true })
  backupEnvironment: string;

  @Column({ name: 'backup_type', nullable: true })
  backupType: string; // e.g., "FileSystem"

  @Column({ name: 'schedule_type', nullable: true })
  scheduleType: string; // e.g., "FileSystem"

  @Column({ name: 'sub_client_name', nullable: true })
  subClientName: string;

  @Column({ type: 'text', name: 'content_details', nullable: true })
  contentDetails: string; // can hold multiline like /apporacle\n/finacle

  @Column({ name: 'backup_schedule', nullable: true })
  backupSchedule: string; // e.g., "4:00 AM"

  @Column({ name: 'storage_policy', nullable: true })
  storagePolicy: string; // e.g., "SP-DC-FS-10Y"

  @Column({ name: 'backup_start_time', nullable: true })
  backupStartTime: string; // "4:00AM"

  @Column({ name: 'backup_end_time', nullable: true })
  backupEndTime: string; // "5:14AM"

  @Column({ name: 'full_backup_size', nullable: true })
  fullBackupSize: string; // "370 GB", "1.23GB"

  @Column({ name: 'retention', nullable: true })
  retention: string; // "10 YR", "1YR"

  // ==== Common columns ====
  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({
    name: 'make_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  makeDate: Date;

  @Column({ name: 'make_by' })
  makeBy: string;

  @Column({
    name: 'edit_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  editDate: Date;

  @Column({ name: 'edit_by', nullable: true })
  editBy: string | null;

  // ==== Dynamic (Option B) ====
  @Column({ type: 'jsonb', default: () => `'{}'::jsonb` })
  extras: Record<string, any>;
}
