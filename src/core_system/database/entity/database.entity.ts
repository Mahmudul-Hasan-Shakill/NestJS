import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { VmEntity } from '../../vm/entity/vm.entity';
import { AutomationEntity } from 'src/core_system/automation/entity/automation.entity';

@Entity()
export class DatabaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dbName: string;

  @Column()
  virtualIp: string;

  @Column({ nullable: true })
  additionalIp: string;

  @Column()
  dbInstance: string;

  @Column()
  dbVersion: string;

  @Column()
  rdbmsType: string;

  @Column()
  dbPort: number;

  @Column()
  dbStatus: string;

  @Column()
  dbType: string;

  @Column()
  dbOwnerEmail: string;

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

  @ManyToMany(() => VmEntity, (vm) => vm.databases)
  @JoinTable({ name: 'database_vm' })
  vms: VmEntity[];

  // In DatabaseEntity
  @ManyToMany(() => AutomationEntity, (automation) => automation.databases)
  automations: AutomationEntity[];
}
