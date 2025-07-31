import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DocumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'stored_file_path' })
  storedFilePath: string;

  @Column({ name: 'mime_type', nullable: true })
  mimeType: string;

  @Column({ nullable: true })
  size: number;

  @Column({
    name: 'upload_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  uploadDate: Date;

  @Column({ name: 'uploaded_by', nullable: true })
  uploadedBy: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'related_type' }) // e.g., 'amc', 'procurement'
  relatedType: string;

  @Column({ name: 'related_id' }) // e.g., AMC ID or Procurement ID
  relatedId: number;
}
