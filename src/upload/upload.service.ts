import { Injectable } from '@nestjs/common';
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

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async saveFiles(
    files: MulterFile[],
    folder: string,
    baseFilename: string,
  ): Promise<string[]> {
    const uploadRoot =
      this.configService.get<string>('UPLOAD_ROOT') ||
      path.join(process.cwd(), 'uploads');
    const targetDir = path.join(uploadRoot, folder);

    // Ensure the target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    return files.map((file) => {
      const ext = path.extname(file.originalname) || '.txt';
      const uuid = uuidv4().split('-')[0]; // Use first part of UUID for brevity
      const now = new Date();
      const timestamp =
        now
          .toISOString()
          .replace(/[-:.TZ]/g, '')
          .slice(0, 14) + now.getMilliseconds();

      const filename = `${baseFilename}_${uuid}_${timestamp}${ext}`;
      const filePath = path.join(targetDir, filename);
      fs.writeFileSync(filePath, file.buffer);
      return `/uploads/${folder}/${filename}`;
    });
  }
}
