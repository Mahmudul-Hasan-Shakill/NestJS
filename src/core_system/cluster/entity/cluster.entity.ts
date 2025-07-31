import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClusterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cluster_name', nullable: false })
  clusterName: string;

  @Column({ name: 'vm_ip', nullable: false })
  vmIp: string;

  @Column({ nullable: true })
  remarks: string;

  @Column({ name: 'make_by', nullable: false })
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

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;
}
