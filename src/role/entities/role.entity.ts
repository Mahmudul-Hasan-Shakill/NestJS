import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_name', type: 'varchar', length: 255 })
  roleName: string;

  @Column({ name: 'href_gui', type: 'varchar', length: 255 })
  hrefGui: string;

  @Column({ name: 'href_label', type: 'varchar', length: 255, nullable: true })
  hrefLabel: string;

  @Column({ name: 'make_by', type: 'varchar', length: 255, nullable: true })
  makeBy: string;

  @Column({
    name: 'make_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  makeDate: Date;

  @Column({ name: 'edit_by', type: 'varchar', length: 255, nullable: true })
  editBy: string;

  @Column({
    name: 'edit_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  editDate: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
