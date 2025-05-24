import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ServerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  ip: string;

  @Column({ nullable: false })
  hostname: string;

  @Column({ name: 'server_platform', nullable: false })
  serverPlatform: string;

  @Column({ name: 'platform_category', nullable: false })
  platformCategory: string;

  @Column({ nullable: false })
  zone: string;

  @Column({ name: 'application_name', nullable: false })
  applicationName: string;

  @Column({ name: 'application_owner', nullable: false })
  applicationOwner: string;

  @Column({ name: 'os_version', nullable: false })
  osVersion: string;

  @Column({ nullable: false })
  core: number;

  @Column({ nullable: false })
  memory: number;

  @Column({ nullable: false })
  storage: number;

  @Column({ nullable: false })
  socket: number;

  @Column({ name: 'ssh_port', nullable: false })
  sshPort: number;

  @Column({ name: 'system_state', nullable: false })
  systemState: string;

  @Column({ nullable: false })
  status: string;

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
