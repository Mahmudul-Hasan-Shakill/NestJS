// automation.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AutomationService } from './automation.service';
import { CreateAutomationDto, UpdateAutomationDto } from './dto/automation.dto';
import { JwtGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { parseServerTextFile } from './parser/text-parser.util';

@ApiBearerAuth('access-token')
@ApiTags('Automation')
@UseGuards(JwtGuard)
@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post()
  async create(@Body() dto: CreateAutomationDto) {
    return this.automationService.create(dto);
  }

  @Get()
  async findAll() {
    return this.automationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.automationService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateAutomationDto) {
    return this.automationService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.automationService.remove(id);
  }

  // Upload + Parse + Deduplicate + Bulk Insert
  @Post('upload-parse')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  async uploadParse(@UploadedFiles() files: Express.Multer.File[]) {
    const validDtos: CreateAutomationDto[] = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(file.path, 'utf-8');
        const parsed = parseServerTextFile(content);

        // Reject files with missing required fields
        if (!parsed?.hostname || !parsed?.ipAddress) continue;

        const isDuplicate = await this.automationService.exists(
          parsed.hostname,
          parsed.ipAddress,
        );

        if (!isDuplicate) validDtos.push(parsed);
      } catch (error) {
        console.warn(`File parse error: ${file.originalname}`, error);
      }
    }

    if (validDtos.length === 0) {
      return {
        isSuccessful: false,
        message: 'No valid or non-duplicate automation records found',
        data: [],
      };
    }

    const results = await this.automationService.bulkCreate(validDtos);

    return {
      isSuccessful: true,
      message: `${results.length} automation records created`,
      data: results,
    };
  }
}
