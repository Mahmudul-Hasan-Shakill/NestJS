import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { VmEntity } from '../../vm/entity/vm.entity';

@Entity()
export class PhysicalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deviceCategory: string;

  @Column()
  hostname: string;

  @Column()
  primaryIdentificationName: string;

  @Column()
  makeOrBrand: string;

  @Column()
  serverModel: string;

  @Column()
  serviceTag: string;

  @Column()
  enclosureIp: string;

  @Column()
  managementIp: string;

  @Column()
  serviceIp: string;

  @Column()
  zone: string;

  @Column()
  os: string;

  @Column()
  osVersion: string;

  @Column({ nullable: true })
  hypervisorEOSL: string;

  @Column({ nullable: true })
  serverEOSL: string;

  @Column({ type: 'date', nullable: true })
  purchasedDate: Date;

  @Column({ type: 'date', nullable: true })
  installationDate: Date;

  @Column({ nullable: true })
  purchasedFrom: string;

  @Column({ nullable: true })
  workOrderNumber: string;

  @Column({ nullable: true })
  warranty: string;

  @Column({ default: false })
  underAMC: boolean;

  @Column({ nullable: true })
  floorName: string;

  @Column({ nullable: true })
  rack: string;

  @Column({ nullable: true })
  row: string;

  @Column({ nullable: true })
  uInformation: string;

  @Column({ nullable: true })
  numberOfNICCards: number;

  @Column({ nullable: true })
  numberOfNICPorts: number;

  @Column({ nullable: true })
  numberOfHBACards: number;

  @Column({ nullable: true })
  numberOfHBAPorts: number;

  @Column({ nullable: true })
  numberOfSockets: number;

  @Column({ nullable: true })
  coresPerSocket: number;

  @Column({ default: false })
  isDecommissioned: boolean;

  @Column({ nullable: true })
  physicalCores: number;

  @Column({ nullable: true })
  physicalRamGb: number;

  @Column({ nullable: true })
  physicalDiskSize: number;

  @Column({ nullable: true })
  numberOfDisks: number;

  @Column({ nullable: true })
  diskType: string;

  @Column({ nullable: true })
  nicFirmwareVersion: string;

  @Column({ nullable: true })
  sanFirmwareVersion: string;

  @Column({ nullable: true })
  chasis: string;

  @Column({ default: false })
  dualConnectivity: boolean;

  @Column({ nullable: true })
  nicCapacity: string;

  @Column({ nullable: true })
  switchUplink: string;

  @Column({ nullable: true })
  serverUplink: string;

  @Column({ nullable: true })
  uplinkPort: string;

  @Column({ nullable: true })
  remarks: string;

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

  @OneToMany(() => VmEntity, (vm) => vm.physical)
  virtualMachines: VmEntity[];
}
