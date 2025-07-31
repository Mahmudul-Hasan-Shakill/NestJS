import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AmcService } from './amc.service';
import { CreateAmcDto, UpdateAmcDto, AmcQueryDto } from './dto/amc.dto';
import { JwtGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('AMC')
@UseGuards(JwtGuard)
@Controller('amc')
export class AmcController {
  constructor(private readonly amcService: AmcService) {}

  @Post()
  async create(@Body() createAmcDto: CreateAmcDto) {
    return await this.amcService.create(createAmcDto);
  }

  @Get()
  @ApiQuery({ name: 'productName', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'vendorName', required: false, type: String })
  @ApiQuery({ name: 'underAmc', required: false, type: Boolean })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() queryDto: AmcQueryDto) {
    return await this.amcService.findAll(queryDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.amcService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateAmcDto: UpdateAmcDto) {
    return await this.amcService.update(id, updateAmcDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.amcService.remove(id);
  }
}
