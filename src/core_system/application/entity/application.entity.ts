import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { VmEntity } from '../../vm/entity/vm.entity';
import { AutomationEntity } from 'src/core_system/automation/entity/automation.entity';

@Entity()
export class ApplicationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  environment: string;

  @Column()
  serviceName: string;

  @Column()
  serviceOwner: string;

  @Column()
  applicationCategory: string;

  @Column()
  appModule: string;

  @Column()
  appOwner: string;

  @Column()
  appOwnerEmail: string;

  @Column()
  applicationUrl: string;

  @Column()
  applicationCertificateDetail: string;

  @Column({ type: 'date', nullable: true })
  certificationExpiryDate: Date;

  @Column({ nullable: true })
  connectedApps: string;

  @Column({ nullable: true })
  middlewareDetails: string;

  @Column({ nullable: true })
  databaseDetails: string;

  @Column({ nullable: true })
  loadBalancerDetails: string;

  @Column({ nullable: true })
  buildLanguage: string;

  @Column({ nullable: true })
  licenceType: string;

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

  @ManyToMany(() => VmEntity, (vm) => vm.applications)
  @JoinTable({ name: 'application_vm' })
  vms: VmEntity[];

  @ManyToMany(() => AutomationEntity, (automation) => automation.apps)
  @JoinTable({ name: 'application_automation' })
  automations: AutomationEntity[];
}
