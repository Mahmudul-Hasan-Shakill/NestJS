// automation.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApplicationEntity } from 'src/core_system/application/entity/application.entity';
import { DatabaseEntity } from 'src/core_system/database/entity/database.entity';

@Entity()
export class AutomationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true }) hostname: string;
  @Column({ nullable: true }) ipAddress: string;
  @Column({ nullable: true }) serverEnvironment: string;
  @Column({ nullable: true }) cpuPhysicalCores: number;
  @Column({ nullable: true }) cpuVirtualCores: number;
  @Column({ nullable: true }) cpuModel: string;
  @Column({ nullable: true }) totalRam: string;
  @Column({ nullable: true }) totalDiskSize: string;
  @Column({ nullable: true }) osVersion: string;
  @Column({ nullable: true }) kernelVersion: string;
  @Column({ nullable: true }) serverPlatform: string;
  @Column({ nullable: true }) serialNumber: string;
  @Column({ nullable: true }) sshPort: string;
  @Column({ nullable: true }) sockets: number;
  @Column({ type: 'timestamp', nullable: true }) lastPatchInstalled: Date;
  @Column({ nullable: true }) systemUptime: string;

  // Falcon Sensor
  @Column({ nullable: true }) falconInstalled: string;
  @Column({ nullable: true }) falconVersion: string;
  @Column({ type: 'timestamp', nullable: true }) falconInstallDate: Date;
  @Column({ nullable: true }) falconStatus: string;

  // Qualys
  @Column({ nullable: true }) qualysInstalled: string;
  @Column({ nullable: true }) qualysVersion: string;
  @Column({ type: 'timestamp', nullable: true }) qualysInstallDate: Date;
  @Column({ nullable: true }) qualysStatus: string;

  // Disk Info
  @Column({ nullable: true }) diskTotalSize: string;
  @Column({ nullable: true }) diskUsed: string;
  @Column({ nullable: true }) diskFree: string;

  // Network Info
  @Column({ nullable: true }) subnetMask: string;
  @Column({ nullable: true }) gateway: string;
  @Column({ nullable: true }) networkIp: string;

  // NTP Info
  @Column({ nullable: true }) ntpService: string;
  @Column({ nullable: true }) ntpServers: string;
  @Column({ nullable: true }) ntpSyncSource: string;

  // User Info
  @Column({ nullable: true }) systemUsersCount: number;
  @Column({ nullable: true }) sudoUsers: string;

  @Column({ nullable: true }) remarks: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({
    name: 'make_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  makeDate: Date;

  @Column({ name: 'make_by', nullable: false })
  makeBy: string;

  @Column({
    name: 'edit_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  editDate: Date;

  @Column({ name: 'edit_by', nullable: true })
  editBy: string;

  @ManyToMany(() => ApplicationEntity, (app) => app.automations)
  apps: ApplicationEntity[];

  @ManyToMany(() => DatabaseEntity, (db) => db.automations)
  dbs: DatabaseEntity[];
}
