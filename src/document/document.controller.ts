import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  Body,
  UploadedFile,
  UseInterceptors,
  Res,
  Header,
  StreamableFile,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { UpdateDocumentDto } from './dto/document.dto';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';

@ApiBearerAuth('access-token')
@ApiTags('Documents')
@UseGuards(JwtGuard)
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload/:relatedType/:relatedId')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 25 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (
          !file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx)$/)
        ) {
          return callback(
            new Error('Only image, PDF, or common document files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        uploadedBy: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  async uploadDocument(
    @Param('relatedType') relatedType: string,
    @Param('relatedId') relatedId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { uploadedBy?: string; description?: string },
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    const document = await this.documentService.uploadFileForEntity(
      relatedType,
      relatedId,
      file,
      body.uploadedBy,
      body.description,
    );

    return {
      isSuccessful: true,
      message: 'Document uploaded successfully',
      data: document,
    };
  }

  @Get(':relatedType/:relatedId')
  async getDocumentsByEntity(
    @Param('relatedType') relatedType: string,
    @Param('relatedId') relatedId: number,
  ) {
    const documents = await this.documentService.findAllByEntity(
      relatedType,
      relatedId,
    );
    return {
      isSuccessful: true,
      message: `Documents for ${relatedType} ID ${relatedId} retrieved successfully`,
      data: documents,
    };
  }

  @Get(':id')
  async getDocument(@Param('id') id: number) {
    const document = await this.documentService.findOne(id);
    return {
      isSuccessful: true,
      message: 'Document retrieved successfully',
      data: document,
    };
  }

  @Get(':id/download')
  @Header('Content-Type', 'application/octet-stream')
  async downloadDocument(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const fileInfo = await this.documentService.getFileStream(id);

    res.set({
      'Content-Type': fileInfo.mimeType,
      'Content-Disposition': `attachment; filename="${fileInfo.fileName}"`,
    });

    return new StreamableFile(fileInfo.stream);
  }

  @Patch(':id')
  async updateDocument(
    @Param('id') id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    const updatedDoc = await this.documentService.update(id, updateDocumentDto);
    return {
      isSuccessful: true,
      message: 'Document metadata updated successfully',
      data: updatedDoc,
    };
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: number) {
    return await this.documentService.remove(id);
  }
}
