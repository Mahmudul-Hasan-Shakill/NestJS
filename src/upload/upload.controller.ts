import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 25 * 1024 * 1024, // 25MB limit
      },
      fileFilter: (req, file, callback) => {
        callback(null, true);
      },
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder: string,
    @Body('filename') filename: string,
  ) {
    try {
      if (!files || files.length === 0) {
        throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
      }

      // Check file sizes (additional client-side check)
      const invalidFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
      if (invalidFiles.length > 0) {
        throw new HttpException(
          `Some files exceed the 5MB limit: ${invalidFiles.map((f) => f.originalname).join(', ')}`,
          HttpStatus.PAYLOAD_TOO_LARGE,
        );
      }

      const paths = await this.uploadService.saveFiles(files, folder, filename);
      return { paths };
    } catch (error) {
      throw new HttpException(
        error.message || 'File upload failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
