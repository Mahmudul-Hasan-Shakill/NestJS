import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEntity } from './entity/document.entity';
import {
  CreateDocumentDto,
  DocumentResponseDto,
  UpdateDocumentDto,
} from './dto/document.dto';
import { UploadService } from 'src/upload/upload.service';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create a document record manually (metadata only).
   */
  file_path = this.configService.get<string>('FILE_PATH');

  async create(createDocumentDto: CreateDocumentDto): Promise<DocumentEntity> {
    const document = this.documentRepository.create(createDocumentDto);
    return await this.documentRepository.save(document);
  }

  /**
   * Upload a file and create a document record for any entity.
   */
  // async uploadFileForEntity(
  //   relatedType: string,
  //   relatedId: number,
  //   file: Express.Multer.File,
  // ): Promise<DocumentResponseDto> {
  //   const folder = `${relatedType}-documents/${relatedId}`;
  //   const baseFilename = path.parse(file.originalname).name;

  //   const uploadedFileInfo = await this.uploadService.saveSingleFile(
  //     file,
  //     folder,
  //     baseFilename,
  //   );

  //   if (!uploadedFileInfo) {
  //     throw new InternalServerErrorException('Failed to save file to storage.');
  //   }

  //   const createDocumentDto: CreateDocumentDto = {
  //     relatedType,
  //     relatedId,
  //     fileName: file.originalname,
  //     storedFilePath: uploadedFileInfo.filePath,
  //     mimeType: file.mimetype,
  //     size: file.size,
  //     uploadedBy: 'CurrentUser', // Replace with actual user context
  //     description: null,
  //   };

  //   const documentEntity = await this.create(createDocumentDto);
  //   return this.mapToDocumentResponseDto(documentEntity);
  // }
  async uploadFileForEntity(
    relatedType: string,
    relatedId: number,
    file: Express.Multer.File,
    uploadedBy?: string,
    description?: string,
  ): Promise<DocumentResponseDto> {
    const folder = `${relatedType}-documents/${relatedId}`;
    const baseFilename = path.parse(file.originalname).name;

    const uploadedFileInfo = await this.uploadService.saveSingleFile(
      file,
      folder,
      baseFilename,
    );

    if (!uploadedFileInfo) {
      throw new InternalServerErrorException('Failed to save file to storage.');
    }

    const createDocumentDto: CreateDocumentDto = {
      relatedType,
      relatedId,
      fileName: file.originalname,
      storedFilePath: uploadedFileInfo.filePath,
      mimeType: file.mimetype,
      size: file.size,
      uploadedBy: uploadedBy ?? 'CurrentUser',
      description: description ?? null,
    };

    const documentEntity = await this.create(createDocumentDto);
    return this.mapToDocumentResponseDto(documentEntity);
  }

  /**
   * Find a single document by ID.
   */
  async findOne(id: number): Promise<DocumentResponseDto> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return this.mapToDocumentResponseDto(document);
  }

  /**
   * Find all documents associated with a specific entity.
   */
  async findAllByEntity(
    relatedType: string,
    relatedId: number,
  ): Promise<DocumentResponseDto[]> {
    const documents = await this.documentRepository.find({
      where: { relatedType, relatedId },
    });
    return documents.map((doc) => this.mapToDocumentResponseDto(doc));
  }

  /**
   * Update document metadata.
   */
  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<DocumentResponseDto> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    await this.documentRepository.update(id, updateDocumentDto);
    const updatedDocument = await this.documentRepository.findOne({
      where: { id },
    });
    return this.mapToDocumentResponseDto(updatedDocument!);
  }

  /**
   * Remove a document and delete its associated file.
   */
  async remove(
    id: number,
  ): Promise<{ isSuccessful: boolean; message: string }> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    try {
      await this.uploadService.deleteFile(document.storedFilePath);
    } catch (error) {
      // Optional: log error
    }

    await this.documentRepository.remove(document);
    return {
      isSuccessful: true,
      message: 'Document removed successfully',
    };
  }

  /**
   * Get a file stream for downloading or previewing.
   */
  async getFileStream(
    documentId: number,
  ): Promise<{ stream: fs.ReadStream; mimeType: string; fileName: string }> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });
    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found.`);
    }

    try {
      const filePath = this.uploadService.getFullFilePath(
        document.storedFilePath,
      );
      const stream = fs.createReadStream(filePath);
      return {
        stream,
        mimeType: document.mimeType,
        fileName: document.fileName,
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(
          `File not found for document ID ${documentId}`,
        );
      }
      throw new InternalServerErrorException(
        `Failed to retrieve file: ${error.message}`,
      );
    }
  }

  /**
   * Map a document entity to a response DTO.
   */
  mapToDocumentResponseDto(document: DocumentEntity): DocumentResponseDto {
    return {
      id: document.id,
      fileName: document.fileName,
      mimeType: document.mimeType,
      size: document.size,
      uploadDate: document.uploadDate,
      uploadedBy: document.uploadedBy,
      description: document.description,
      relatedId: document.relatedId,
      relatedType: document.relatedType,
      // downloadUrl: `/api/documents/${document.id}/download`,
      downloadUrl: `${this.file_path}${document.storedFilePath.replace(/\\/g, '/')}`,
    };
  }
}
