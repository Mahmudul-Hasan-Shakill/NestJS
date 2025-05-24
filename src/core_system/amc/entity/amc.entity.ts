import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AmcEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item', nullable: false })
  item: string;

  @Column({ name: 'product_name', nullable: false })
  productName: string;

  @Column({ nullable: false })
  quantity: number;

  @Column({ name: 'eol_or_eosl', type: 'boolean', nullable: false })
  eolOrEosl: boolean;

  @Column({ name: 'declared_eol_or_eosl', type: 'date', nullable: false })
  declaredEolOrEosl: Date;

  @Column({ name: 'under_amc', type: 'boolean', nullable: false })
  underAmc: boolean;

  @Column({ name: 'support_type', nullable: false })
  supportType: string;

  @Column({ name: 'amc_start', type: 'date', nullable: false })
  amcStart: Date;

  @Column({ name: 'amc_end', type: 'date', nullable: false })
  amcEnd: Date;

  @Column({ name: 'warranty_start', type: 'date', nullable: false })
  warrantyStart: Date;

  @Column({ name: 'warranty_end', type: 'date', nullable: false })
  warrantyEnd: Date;

  @Column({ name: 'vendor_name', nullable: false })
  vendorName: string;

  @Column({ name: 'oem', nullable: false })
  oem: string;

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
}
