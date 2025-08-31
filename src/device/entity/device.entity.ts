// src/device/entity/device.entity.ts
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index('uq_device_asset_tag', ['assetTag'], { unique: true })
@Index('uq_device_serial_number', ['serialNumber'], {
  unique: true,
  where: `"serial_number" IS NOT NULL`,
})
export class DeviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Identity
  @Column({ name: 'device_type', nullable: true })
  deviceType: string | null;

  @Column({ name: 'asset_tag' })
  assetTag: string;

  @Column({ name: 'serial_number', nullable: true })
  serialNumber: string | null;

  @Column({ nullable: true })
  brand: string | null;

  @Column({ nullable: true })
  model: string | null;

  // Ownership & location
  @Column({ name: 'current_owner_pin', nullable: true })
  currentOwnerPin: string | null;

  @Column({ name: 'current_owner_name', nullable: true })
  currentOwnerName: string | null;

  @Column({ name: 'current_owner_email', nullable: true })
  currentOwnerEmail: string | null;

  @Column({ nullable: true })
  unit: string | null;

  @Column({ nullable: true })
  site: string | null;

  @Column({ name: 'location_note', nullable: true })
  locationNote: string | null;

  // Status & lifecycle
  @Column({ nullable: true, default: 'in_stock' })
  status: string | null;

  @Column({ name: 'assigned_date', type: 'date', nullable: true })
  assignedDate: Date | null;

  @Column({ name: 'returned_date', type: 'date', nullable: true })
  returnedDate: Date | null;

  @Column({ nullable: true, type: 'text' })
  remarks: string | null;

  // Technical (generic)
  @Column({ nullable: true })
  hostname: string | null;

  @Column({ nullable: true })
  platform: string | null;

  @Column({ name: 'os_version', nullable: true })
  osVersion: string | null;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string | null;

  @Column({ name: 'mac_address', nullable: true })
  macAddress: string | null;

  // Commercial & warranty
  @Column({ name: 'purchase_order_no', nullable: true })
  purchaseOrderNo: string | null;

  @Column({ nullable: true })
  vendor: string | null;

  @Column({ name: 'purchase_date', type: 'date', nullable: true })
  purchaseDate: Date | null;

  @Column({ name: 'warranty_end', type: 'date', nullable: true })
  warrantyEnd: Date | null;

  // Dynamic payload
  @Column({ type: 'jsonb', default: () => `'{}'::jsonb'` as unknown as any }) // using string literal confuses TS; see below alternative
  extras: Record<string, any>;

  // If TS complains, replace the line above with:
  // @Column({ type: 'jsonb', default: () => `'{}'::jsonb` })
  // extras: Record<string, any>;

  // Common 5
  @Column({ name: 'is_active', type: 'boolean', default: true })
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
}
