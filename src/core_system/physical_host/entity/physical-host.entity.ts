import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PhysicalHostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cluster_name', nullable: true })
  clusterName?: string;

  @Column({ nullable: false })
  hostname: string;

  @Column({ name: 'physical_ip', nullable: false })
  physicalIp: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  brand?: string;

  @Column({ nullable: true })
  model?: string;

  @Column({ name: 'serial_number', nullable: true })
  serialNumber?: string;

  @Column({ name: 'asset_tag', nullable: true })
  assetTag?: string;

  @Column({ name: 'cpu_model', nullable: true })
  cpuModel?: string;

  @Column({ name: 'cpu_cores_total', nullable: true })
  cpuCoresTotal?: number;

  @Column({ name: 'ram_total_gb', nullable: true })
  ramTotalGb?: number;

  @Column({ name: 'storage_total_tb', nullable: true })
  storageTotalTb?: number;

  @Column({ name: 'storage_type', nullable: true })
  storageType?: string;

  @Column({ name: 'power_supply', nullable: true })
  powerSupply?: string;

  @Column({ name: 'network_ports', nullable: true })
  networkPorts?: string;

  @Column({ name: 'os_installed', nullable: true })
  osInstalled?: string;

  @Column({ name: 'os_version', nullable: true })
  osVersion?: string;

  @Column({ name: 'hypervisor_type', nullable: true })
  hypervisorType?: string;

  @Column({ name: 'hypervisor_version', nullable: true })
  hypervisorVersion?: string;

  @Column({ nullable: true })
  status?: string;

  @Column({ name: 'warranty_expiry', type: 'date', nullable: true })
  warrantyExpiry?: Date;

  @Column({ name: 'assigned_to_team', nullable: true })
  assignedToTeam?: string;

  @Column({ name: 'make_by', nullable: false })
  makeBy: string;

  @Column({
    name: 'make_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  makeDate: Date;

  @Column({ name: 'edit_by', nullable: true })
  editBy?: string;

  @Column({
    name: 'edit_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  editDate?: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
