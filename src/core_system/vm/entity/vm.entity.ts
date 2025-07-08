import { ApplicationEntity } from 'src/core_system/application/entity/application.entity';
import { DatabaseEntity } from 'src/core_system/database/entity/database.entity';
import { PhysicalEntity } from 'src/core_system/physical/entity/physical.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class VmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'device_category', nullable: false })
  deviceCategory: string;

  @Column({ nullable: false })
  hostname: string;

  @Column({ name: 'os_ip_address', nullable: false })
  osIpAddress: string;

  @Column({ name: 'ssh_port', nullable: false })
  sshPort: number;

  @Column({ name: 'os_subnet_mask', nullable: true })
  osSubnetMask: string;

  @Column({ name: 'os_default_gateway', nullable: true })
  osDefaultGateway: string;

  @Column({ name: 'server_type', nullable: true })
  serverType: string;

  @Column({ name: 'volume_label', nullable: true })
  volumeLabel: string;

  @Column({ name: 'volume_size', nullable: true })
  volumeSize: number;

  @Column({ name: 'login_protocol', nullable: true })
  loginProtocol: string;

  @Column({ name: 'patch_version', nullable: true })
  patchVersion: string;

  @Column({ name: 'kernel_version', nullable: true })
  kernelVersion: string;

  @Column({ name: 'platform', nullable: false })
  platform: string;

  @Column({ name: 'os_version', nullable: false })
  osVersion: string;

  @Column({ name: 'os_cluster_name', nullable: true })
  osClusterName: string;

  @Column({ name: 'last_patching_date', type: 'date', nullable: true })
  lastPatchingDate: Date;

  @Column({ name: 'server_status', nullable: false })
  serverStatus: string;

  @Column({ name: 'is_decommissioned', default: false })
  isDecommissioned: boolean;

  @Column({ name: 'total_socket', nullable: true })
  totalSocket: number;

  @Column({ name: 'vcpu', nullable: true })
  vcpu: number;

  @Column({ name: 'ram_gb', nullable: true })
  ramGb: number;

  @Column({ name: 'hdd_size', nullable: true })
  hddSize: number;

  @Column({ name: 'custodian_info', nullable: true })
  custodianInfo: string;

  @Column({ name: 'rdp_enabled', default: false })
  rdpEnabled: boolean;

  @Column({ name: 'management_ip_active', default: false })
  managementIpActive: boolean;

  @Column({ name: 'backup_available', default: false })
  backupAvailable: boolean;

  @Column({ name: 'backup_type', nullable: true })
  backupType: string;

  @Column({ name: 'backup_schedule', nullable: true })
  backupSchedule: string;

  @Column({ name: 'file_system_backup_path', nullable: true })
  fileSystemBackupPath: string;

  @Column({ name: 'backup_db_name', nullable: true })
  backupDbName: string;

  @Column({ name: 'backup_retention', nullable: true })
  backupRetention: string;

  @Column({ name: 'database_info', nullable: true })
  databaseInfo: string;

  @Column({ name: 'application_info', nullable: true })
  applicationInfo: string;

  @Column({ name: 'physical_server', nullable: true })
  physicalServer: string;

  @Column({ nullable: true })
  remarks: string;

  // Common fields
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

  @ManyToMany(() => ApplicationEntity, (app) => app.vms)
  applications: ApplicationEntity[];

  @ManyToMany(() => DatabaseEntity, (db) => db.vms)
  databases: DatabaseEntity[];

  @ManyToOne(() => PhysicalEntity, (physical) => physical.virtualMachines, {
    nullable: true,
  })
  @JoinColumn({ name: 'physical_id' })
  physical: PhysicalEntity;
}
