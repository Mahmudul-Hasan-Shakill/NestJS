import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AmcEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_name' })
  productName: string;

  @Column()
  quantity: number;

  @Column({ name: 'serial_number', nullable: true })
  serialNumber: string;

  @Column({ name: 'asset_tag', nullable: true })
  assetTag: string;

  @Column({ name: 'is_eol_or_eosl', default: false })
  isEolOrEosl: boolean;

  @Column({ name: 'declared_eol_or_eosl', type: 'date', nullable: true })
  declaredEolOrEosl: Date;

  @Column({ name: 'under_amc', default: false })
  underAmc: boolean;

  @Column({ name: 'support_type', nullable: true })
  supportType: string;

  @Column({ name: 'amc_start', type: 'date', nullable: true })
  amcStart: Date;

  @Column({ name: 'amc_end', type: 'date', nullable: true })
  amcEnd: Date;

  @Column({ name: 'warranty_start', type: 'date', nullable: true })
  warrantyStart: Date;

  @Column({ name: 'warranty_end', type: 'date', nullable: true })
  warrantyEnd: Date;

  @Column({ name: 'vendor_name', nullable: true })
  vendorName: string;

  @Column({ nullable: true })
  oem: string;

  @Column({ name: 'purchase_date', type: 'date', nullable: true })
  purchaseDate: Date;

  @Column({ name: 'purchase_order_number', nullable: true })
  purchaseOrderNumber: string;

  @Column({ nullable: true })
  remarks: string;

  @Column({ nullable: true })
  location: string;

  @Column()
  status: string;

  @Column({ name: 'make_by' })
  makeBy: string;

  @Column({
    name: 'make_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  makeDate: Date;

  @Column({ name: 'edit_by', nullable: true })
  editBy: string;

  @Column({
    name: 'edit_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  editDate: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
