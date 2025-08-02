import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AmcService } from './amc.service';
import { CreateAmcDto, UpdateAmcDto, AmcQueryDto } from './dto/amc.dto';
import { JwtGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('AMC')
@UseGuards(JwtGuard)
@Controller('amc')
export class AmcController {
  constructor(private readonly amcService: AmcService) {}

  @Post()
  @ApiOperation({ summary: 'Create new AMC record' })
  @ApiBody({ type: CreateAmcDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'AMC created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation or save failed.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async create(@Body() createAmcDto: CreateAmcDto) {
    return await this.amcService.create(createAmcDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve AMC records with filters and pagination' })
  @ApiQuery({ name: 'productName', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'vendorName', required: false, type: String })
  @ApiQuery({ name: 'underAmc', required: false, type: Boolean })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'AMC records retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to retrieve AMC records.',
  })
  async findAll(@Query() queryDto: AmcQueryDto) {
    return await this.amcService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve single AMC record by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'AMC record retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'AMC record not found.',
  })
  async findOne(@Param('id') id: number) {
    return await this.amcService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update AMC record by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateAmcDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'AMC record updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'AMC record not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation or update failed.',
  })
  async update(@Param('id') id: number, @Body() updateAmcDto: UpdateAmcDto) {
    return await this.amcService.update(id, updateAmcDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete AMC record by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'AMC record removed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'AMC record not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to delete AMC record.',
  })
  async remove(@Param('id') id: number) {
    return await this.amcService.remove(id);
  }
}
