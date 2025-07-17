// import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import { VmEntity } from '../../vm/entity/vm.entity';

// @Entity()
// export class PhysicalEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   deviceCategory: string;

//   @Column()
//   hostname: string;

//   @Column()
//   primaryIdentificationName: string;

//   @Column()
//   makeOrBrand: string;

//   @Column()
//   serverModel: string;

//   @Column()
//   serviceTag: string;

//   @Column()
//   enclosureIp: string;

//   @Column()
//   managementIp: string;

//   @Column()
//   serviceIp: string;

//   @Column()
//   zone: string;

//   @Column()
//   os: string;

//   @Column()
//   osVersion: string;

//   @Column({ nullable: true })
//   hypervisorEOSL: string;

//   @Column({ nullable: true })
//   serverEOSL: string;

//   @Column({ type: 'date', nullable: true })
//   purchasedDate: Date;

//   @Column({ type: 'date', nullable: true })
//   installationDate: Date;

//   @Column({ nullable: true })
//   purchasedFrom: string;

//   @Column({ nullable: true })
//   workOrderNumber: string;

//   @Column({ nullable: true })
//   warranty: string;

//   @Column({ default: false })
//   underAMC: boolean;

//   @Column({ nullable: true })
//   floorName: string;

//   @Column({ nullable: true })
//   rack: string;

//   @Column({ nullable: true })
//   row: string;

//   @Column({ nullable: true })
//   uInformation: string;

//   @Column({ nullable: true })
//   numberOfNICCards: number;

//   @Column({ nullable: true })
//   numberOfNICPorts: number;

//   @Column({ nullable: true })
//   numberOfHBACards: number;

//   @Column({ nullable: true })
//   numberOfHBAPorts: number;

//   @Column({ nullable: true })
//   numberOfSockets: number;

//   @Column({ nullable: true })
//   coresPerSocket: number;

//   @Column({ default: false })
//   isDecommissioned: boolean;

//   @Column({ nullable: true })
//   physicalCores: number;

//   @Column({ nullable: true })
//   physicalRamGb: number;

//   @Column({ nullable: true })
//   physicalDiskSize: number;

//   @Column({ nullable: true })
//   numberOfDisks: number;

//   @Column({ nullable: true })
//   diskType: string;

//   @Column({ nullable: true })
//   nicFirmwareVersion: string;

//   @Column({ nullable: true })
//   sanFirmwareVersion: string;

//   @Column({ nullable: true })
//   chasis: string;

//   @Column({ default: false })
//   dualConnectivity: boolean;

//   @Column({ nullable: true })
//   nicCapacity: string;

//   @Column({ nullable: true })
//   switchUplink: string;

//   @Column({ nullable: true })
//   serverUplink: string;

//   @Column({ nullable: true })
//   uplinkPort: string;

//   @Column({ nullable: true })
//   remarks: string;

//   @Column({ default: true, name: 'is_active' })
//   isActive: boolean;

//   @Column({
//     name: 'make_date',
//     type: 'timestamp',
//     default: () => 'CURRENT_TIMESTAMP',
//   })
//   makeDate: Date;

//   @Column({ name: 'make_by', nullable: false })
//   makeBy: string;

//   @Column({
//     name: 'edit_date',
//     type: 'timestamp',
//     default: () => 'CURRENT_TIMESTAMP',
//   })
//   editDate: Date;

//   @Column({ name: 'edit_by', nullable: true })
//   editBy: string;

//   @OneToMany(() => VmEntity, (vm) => vm.physical)
//   virtualMachines: VmEntity[];
// }

import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { VmEntity } from '../../vm/entity/vm.entity';

@Entity()
export class PhysicalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Device Category
  @Column()
  deviceCategory: string;

  // Basic Detail & Hardware Info
  @Column({ nullable: true })
  makeOrBrand: string;

  @Column({ nullable: true })
  serverModel: string;

  @Column({ nullable: true })
  enclosureIp: string;

  @Column({ nullable: true })
  dcZone: string;

  @Column({ nullable: true })
  drZone: string;

  @Column({ nullable: true })
  rack: string;

  @Column({ nullable: true })
  floorName: string;

  @Column({ nullable: true })
  dimensionMm: string;

  @Column({ nullable: true })
  dimensionRackU: number;

  @Column({ nullable: true })
  uInformation: string;

  @Column({ nullable: true })
  numberOfNICPorts: string;

  @Column({ nullable: true })
  numberOfHBAPorts: string;

  // Server Detail
  @Column({ nullable: true })
  hostname: string;

  @Column({ nullable: true })
  serviceIp: string;

  @Column({ nullable: true })
  servicePort: string;

  @Column({ nullable: true })
  loginProtocol: string;

  @Column({ nullable: true })
  serverStatus: string;

  @Column({ nullable: true })
  kernelVersion: string;

  @Column({ nullable: true })
  serverType: string;

  @Column({ nullable: true })
  serverMacAddress: string;

  @Column({ nullable: true })
  numberOfSockets: number;

  @Column({ nullable: true })
  coresPerSocket: number;

  @Column({ nullable: true })
  totalVcpu: number;

  @Column({ type: 'float', nullable: true })
  physicalRamGb: number;

  @Column({ nullable: true })
  custodianInformation: string;

  // OS Information
  @Column({ nullable: true })
  os: string;

  @Column({ nullable: true })
  osClusterName: string;

  @Column({ nullable: true })
  latestPatchVersion: string;

  // Network Detail
  @Column({ nullable: true })
  osIpAddress: string;

  @Column({ nullable: true })
  subnetMask: string;

  @Column({ nullable: true })
  defaultGateway: string;

  @Column({ nullable: true })
  serviceVlan: string;

  @Column({ nullable: true })
  onmIpGateway: string;

  @Column({ nullable: true })
  onmIpMask: string;

  @Column({ nullable: true })
  onmVlan: string;

  @Column({ nullable: true })
  primaryDns: string;

  @Column({ nullable: true })
  secondaryDns: string;

  @Column({ nullable: true })
  dualConnectivity: string;

  @Column({ nullable: true })
  nicCapacity: string;

  @Column({ nullable: true })
  rdpEnabled: boolean;

  @Column({ nullable: true })
  switchUplink: string;

  @Column({ nullable: true })
  serverUplink: string;

  @Column({ nullable: true })
  uplinkPort: string;

  @Column({ nullable: true })
  managementIp: string;

  // DB Information
  @Column({ nullable: true })
  dbName: string;

  @Column({ nullable: true })
  dbVirtualIp: string;

  @Column({ nullable: true })
  dbAdditionalIp: string;

  @Column({ nullable: true })
  dbInstance: string;

  @Column({ nullable: true })
  dbVersion: string;

  @Column({ nullable: true })
  rdmsType: string;

  @Column({ nullable: true })
  dbPort: string;

  @Column({ nullable: true })
  dbStatus: string;

  @Column({ nullable: true })
  dbType: string;

  @Column({ nullable: true })
  dbOwnerEmail: string;

  // Application Information
  @Column({ nullable: true })
  environmentCategory: string;

  @Column({ nullable: true })
  serviceName: string;

  @Column({ nullable: true })
  middlewareDetails: string;

  @Column({ nullable: true })
  loadBalancerDetails: string;

  // OEM, AMC & Vendor Information
  @Column({ nullable: true })
  oem: string;

  @Column({ nullable: true })
  maintenanceVendor: string;

  @Column({ type: 'date', nullable: true })
  eolDate: Date;

  @Column({ type: 'date', nullable: true })
  eosDate: Date;

  // Backup Information
  @Column({ default: 'No' })
  backupAvailable: string;

  @Column({ nullable: true })
  backupType: string;

  @Column({ nullable: true })
  backupSchedule: string;

  // Power Detail
  @Column({ nullable: true })
  powerConnectivity: string;

  @Column({ nullable: true })
  powerRedundancy: string;

  @Column({ nullable: true })
  powerRedundancyMethodology: string;

  @Column({ nullable: true })
  inputPowerType: string;

  @Column({ nullable: true })
  powerPhase: string;

  @Column({ nullable: true })
  powerConsumptionVa: string;

  // Monitoring Status
  @Column({ default: false })
  infraMonitoring: boolean;

  @Column({ default: false })
  appMonitoring: boolean;

  // Remarks
  @Column({ nullable: true })
  remarks: string;

  // Metadata
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
