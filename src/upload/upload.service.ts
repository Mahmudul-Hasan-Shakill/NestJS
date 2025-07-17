import { Injectable } from '@nestjs/common';
import { File } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async saveFiles(
    files: File[],
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

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, '')
      .slice(0, 12); // e.g., 20250717_1613

    return files.map((file, index) => {
      const ext = path.extname(file.originalname) || '.txt';
      const filename = `${baseFilename}_${timestamp}${index ? `_${index}` : ''}${ext}`;
      const filePath = path.join(targetDir, filename);
      fs.writeFileSync(filePath, file.buffer);
      return `uploads/${folder}/${filename}`;
    });
  }
}
