// import { Injectable } from '@nestjs/common';
// import * as fs from 'fs';
// import * as path from 'path';
// import { ConfigService } from '@nestjs/config';
// import { v4 as uuidv4 } from 'uuid';

// interface MulterFile {
//   fieldname: string;
//   originalname: string;
//   encoding: string;
//   mimetype: string;
//   size: number;
//   buffer: Buffer;
// }

// @Injectable()
// export class UploadService {
//   constructor(private readonly configService: ConfigService) {}

//   async saveFiles(
//     files: MulterFile[],
//     folder: string,
//     baseFilename: string,
//   ): Promise<string[]> {
//     const uploadRoot =
//       this.configService.get<string>('UPLOAD_ROOT') ||
//       path.join(process.cwd(), 'uploads');
//     const targetDir = path.join(uploadRoot, folder);

//     // Ensure the target directory exists
//     if (!fs.existsSync(targetDir)) {
//       fs.mkdirSync(targetDir, { recursive: true });
//     }

//     return files.map((file) => {
//       const ext = path.extname(file.originalname) || '.txt';
//       const uuid = uuidv4().split('-')[0]; // Use first part of UUID for brevity
//       const now = new Date();
//       const timestamp =
//         now
//           .toISOString()
//           .replace(/[-:.TZ]/g, '')
//           .slice(0, 14) + now.getMilliseconds();

//       const filename = `${baseFilename}_${uuid}_${timestamp}${ext}`;
//       const filePath = path.join(targetDir, filename);
//       fs.writeFileSync(filePath, file.buffer);
//       return `/uploads/${folder}/${filename}`;
//     });
//   }
// }

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface UploadedFileInfo {
  fileName: string;
  storedFileName: string;
  filePath: string;
  mimeType: string;
  size: number;
}

@Injectable()
export class UploadService {
  private readonly uploadRoot: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadRoot =
      this.configService.get<string>('UPLOAD_ROOT') ||
      path.join(process.cwd(), 'uploads');
  }

  async saveSingleFile(
    file: MulterFile,
    folder: string,
    baseFilename: string,
  ): Promise<UploadedFileInfo> {
    const targetDir = path.join(this.uploadRoot, folder);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const ext = path.extname(file.originalname);
    const uniqueId = uuidv4().split('-')[0];
    const now = new Date();
    const timestamp =
      now
        .toISOString()
        .replace(/[-:.TZ]/g, '')
        .slice(0, 14) + now.getMilliseconds();

    const storedFileName = `${baseFilename}_${uniqueId}_${timestamp}${ext}`;
    const filePath = path.join(targetDir, storedFileName);

    try {
      fs.writeFileSync(filePath, file.buffer);
    } catch (error) {
      console.error('Failed to write file to disk:', error);
      throw new InternalServerErrorException('Failed to save file physically.');
    }

    const relativePath = path.join('/uploads', folder, storedFileName);

    return {
      fileName: file.originalname,
      storedFileName: storedFileName,
      filePath: relativePath,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async saveFiles(
    files: MulterFile[],
    folder: string,
    baseFilename: string,
  ): Promise<UploadedFileInfo[]> {
    const uploadedInfos: UploadedFileInfo[] = [];
    for (const file of files) {
      const info = await this.saveSingleFile(file, folder, baseFilename);
      uploadedInfos.push(info);
    }
    return uploadedInfos;
  }

  async deleteFile(relativePath: string): Promise<void> {
    const fullPath = path.join(
      this.uploadRoot,
      relativePath.replace('/uploads/', ''),
    );
    try {
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      } else {
        console.warn(`File not found for deletion: ${fullPath}`);
      }
    } catch (error) {
      console.error(`Error deleting file ${fullPath}:`, error);
      throw new InternalServerErrorException(
        `Failed to delete file from storage: ${error.message}`,
      );
    }
  }

  getFullFilePath(relativePath: string): string {
    return path.join(this.uploadRoot, relativePath.replace('/uploads/', ''));
  }
}
