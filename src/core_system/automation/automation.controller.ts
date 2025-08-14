// automation.controller.ts
import {
  BadRequestException,
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
import { ConfigService } from '@nestjs/config';

// RBAC Imports
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequireGuiPermissions } from 'src/common/decorators/require-gui-permissions.decorator';
import { PermissionActions } from '../../common/enums/permissions.enum';

@ApiBearerAuth('access-token')
@ApiTags('Automation')
@UseGuards(JwtGuard, PermissionsGuard)
@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post()
  @RequireGuiPermissions([PermissionActions.CREATE])
  async create(@Body() dto: CreateAutomationDto) {
    return this.automationService.create(dto);
  }

  @Get()
  @RequireGuiPermissions([PermissionActions.READ])
  async findAll() {
    return this.automationService.findAll();
  }

  @Get(':id')
  @RequireGuiPermissions([PermissionActions.READ])
  async findOne(@Param('id') id: number) {
    return this.automationService.findOne(id);
  }

  @Patch(':id')
  @RequireGuiPermissions([PermissionActions.UPDATE])
  async update(@Param('id') id: number, @Body() dto: UpdateAutomationDto) {
    return this.automationService.update(id, dto);
  }

  @Delete(':id')
  @RequireGuiPermissions([PermissionActions.DELETE])
  async remove(@Param('id') id: number) {
    return this.automationService.remove(id);
  }

  @Post('upload-parse')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 100, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  @RequireGuiPermissions([PermissionActions.CREATE])
  async uploadParse(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    const validDtos: CreateAutomationDto[] = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(file.path, 'utf-8');
        const parsed = parseServerTextFile(content);

        if (!parsed?.hostname || !parsed?.ipAddress) continue;

        const isDuplicate = await this.automationService.exists(
          parsed.hostname,
          parsed.ipAddress,
        );

        if (!isDuplicate) {
          parsed.makeBy = body.makeBy || 'unknown';
          validDtos.push(parsed);
        }
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

    if (files.length > 100) {
      throw new BadRequestException(
        'Too many files uploaded. Maximum allowed is 100.',
      );
    }

    const results = await this.automationService.bulkCreate(validDtos);

    return {
      isSuccessful: true,
      message: `${results.length} automation records created`,
      data: results,
    };
  }
}
