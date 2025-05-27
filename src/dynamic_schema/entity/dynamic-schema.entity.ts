// src/entities/dynamic-schema.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class DynamicSchemaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tableName: string;

  @Column()
  fieldName: string;

  @Column()
  fieldType: string;

  @Column({ default: true })
  isActive: boolean;
}
