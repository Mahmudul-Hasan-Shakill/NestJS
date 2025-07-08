import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  pin: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  division: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  unit: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({ nullable: true })
  marital: string;

  @Column({ nullable: true })
  nid: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({ name: 'user_role' })
  userRole: string;

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
  })
  editDate: Date;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'is_reset', type: 'boolean', default: true })
  isReset: boolean;

  @Column({ name: 'is_login', type: 'boolean', default: false })
  isLogin: boolean;

  @Column({ name: 'is_locked', type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ name: 'login_attempts', type: 'int', default: 0 })
  loginAttempts: number;
}
