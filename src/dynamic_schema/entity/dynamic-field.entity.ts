import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type UiType =
  | 'text'
  | 'number'
  | 'checkbox'
  | 'textarea'
  | 'datetime'
  | 'select';

@Entity()
@Index(['tableName', 'fieldName'], { unique: true })
export class DynamicFieldEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Which table this schema applies to (e.g., "database_entity")
  @Column()
  tableName: string;

  // JSONB key that will live under extras[key]
  @Column()
  fieldName: string;

  // Logical type the UI/validators will use
  @Column({ default: 'text' })
  uiType: UiType;

  // DB-ish hint if you ever need it later (optional)
  @Column({ default: 'varchar' })
  fieldType: string;

  // Is it currently active (rendered in UI)?
  @Column({ default: true })
  isActive: boolean;

  // Label to show in UI
  @Column({ default: '' })
  label: string;

  // Help text / hint for UI
  @Column({ default: '' })
  helpText: string;

  // Whether UI should require a value (server can mirror this)
  @Column({ default: false })
  required: boolean;

  // Default value for new records (stored as string for simplicity)
  @Column({ nullable: true })
  defaultValue?: string;

  // Order in forms/tables
  @Column({ type: 'int', default: 100 })
  sortOrder: number;

  // For select: option list, or any extra configuration
  @Column({ type: 'jsonb', default: () => `'[]'::jsonb` })
  options: Array<{ label: string; value: string }>;

  // Room for custom validators/config (regex, min/max, etc.)
  @Column({ type: 'jsonb', default: () => `'{}'::jsonb` })
  validators: Record<string, any>;
}
