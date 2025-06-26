import {
  Body,
  Controller,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { DynamicSchemaService } from './dynamic-schema.service';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { DynamicSchemaDto } from './dto/dynamic-schema.dto';

@ApiBearerAuth('access-token')
@Controller('dynamic-fields')
export class DynamicSchemaController {
  constructor(private readonly dynamicSchemaService: DynamicSchemaService) {}

  @UseGuards(JwtGuard)
  @Post('add')
  async addField(@Body() body: DynamicSchemaDto) {
    if (!body.fieldType) {
      throw new BadRequestException(
        'fieldType is required for adding a field.',
      );
    }

    return this.dynamicSchemaService.addColumn(body); // Pass the whole DTO
  }

  @UseGuards(JwtGuard)
  @Post('remove')
  async removeField(@Body() body: DynamicSchemaDto) {
    return this.dynamicSchemaService.removeColumn(body); // Pass the whole DTO
  }
}
