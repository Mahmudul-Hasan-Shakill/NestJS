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

  @ManyToMany(() => VmEntity, (vm) => vm.databases)
  @JoinTable({ name: 'database_vm' })
  vms: VmEntity[];
}
