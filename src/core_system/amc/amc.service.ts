import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmcEntity } from './entity/amc.entity';
import { CreateAmcDto, UpdateAmcDto, AmcQueryDto } from './dto/amc.dto';
import { DocumentService } from 'src/document/document.service';

@Injectable()
export class AmcService {
  constructor(
    @InjectRepository(AmcEntity)
    private readonly amcRepository: Repository<AmcEntity>,
    private readonly documentService: DocumentService,
  ) {}

  async create(createAmcDto: CreateAmcDto) {
    const { documents, ...amcData } = createAmcDto;
    try {
      const amc = this.amcRepository.create(amcData);
      const savedAmc = await this.amcRepository.save(amc);

      if (documents?.length) {
        for (const doc of documents) {
          await this.documentService.create({
            ...doc,
            relatedType: 'amc',
            relatedId: savedAmc.id,
          });
        }
      }

      const documentDtos = await this.documentService.findAllByEntity(
        'amc',
        savedAmc.id,
      );

      return {
        isSuccessful: true,
        message: 'AMC record created successfully',
        data: {
          ...savedAmc,
          documents: documentDtos,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to create AMC record. ' + error.message,
      );
    }
  }

  async findAll(queryDto: AmcQueryDto) {
    const { page = 1, limit = 10, ...filters } = queryDto;
    const skip = (page - 1) * limit;

    try {
      const query = this.amcRepository.createQueryBuilder('amc');
      if (filters.productName) {
        query.andWhere('LOWER(amc.productName) LIKE LOWER(:productName)', {
          productName: `%${filters.productName}%`,
        });
      }
      if (filters.status) {
        query.andWhere('LOWER(amc.status) = LOWER(:status)', {
          status: filters.status,
        });
      }
      if (filters.vendorName) {
        query.andWhere('LOWER(amc.vendorName) LIKE LOWER(:vendorName)', {
          vendorName: `%${filters.vendorName}%`,
        });
      }
      if (typeof filters.underAmc === 'boolean') {
        query.andWhere('amc.underAmc = :underAmc', {
          underAmc: filters.underAmc,
        });
      }
      if (filters.location) {
        query.andWhere('LOWER(amc.location) LIKE LOWER(:location)', {
          location: `%${filters.location}%`,
        });
      }

      const [amcRecords, total] = await query
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      const processedAmcRecords = await Promise.all(
        amcRecords.map(async (amc) => {
          const documents = await this.documentService.findAllByEntity(
            'amc',
            amc.id,
          );
          return { ...amc, documents };
        }),
      );

      return {
        isSuccessful: true,
        message: 'AMC records retrieved successfully',
        data: processedAmcRecords,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve AMC records. ' + error.message,
      );
    }
  }

  async findOne(id: number) {
    const amc = await this.amcRepository.findOne({ where: { id } });
    if (!amc) {
      throw new NotFoundException(`AMC record with ID ${id} not found`);
    }

    const documents = await this.documentService.findAllByEntity('amc', id);

    return {
      isSuccessful: true,
      message: 'AMC record retrieved successfully',
      data: {
        ...amc,
        documents,
      },
    };
  }

  async update(id: number, updateAmcDto: UpdateAmcDto) {
    const { documents, documentIdsToRemove, ...amcData } = updateAmcDto;

    const amc = await this.amcRepository.findOne({ where: { id } });
    if (!amc) {
      throw new NotFoundException(`AMC record with ID ${id} not found`);
    }

    await this.amcRepository.update(id, amcData);

    if (documentIdsToRemove?.length) {
      for (const docId of documentIdsToRemove) {
        await this.documentService.remove(docId);
      }
    }

    if (documents?.length) {
      for (const doc of documents) {
        if (!doc.id) {
          if (!doc.fileName || !doc.storedFilePath) {
            throw new InternalServerErrorException(
              'Missing required fields for document creation.',
            );
          }

          await this.documentService.create({
            fileName: doc.fileName,
            storedFilePath: doc.storedFilePath,
            mimeType: doc.mimeType,
            size: doc.size,
            uploadedBy: doc.uploadedBy,
            description: doc.description,
            relatedType: 'amc',
            relatedId: id,
          });
        }
      }
    }

    const updatedAmc = await this.amcRepository.findOne({ where: { id } });
    const updatedDocuments = await this.documentService.findAllByEntity(
      'amc',
      id,
    );

    return {
      isSuccessful: true,
      message: 'AMC record updated successfully',
      data: {
        ...updatedAmc,
        documents: updatedDocuments,
      },
    };
  }

  async remove(id: number) {
    const amc = await this.amcRepository.findOne({ where: { id } });
    if (!amc) {
      throw new NotFoundException(`AMC record with ID ${id} not found`);
    }

    try {
      const documents = await this.documentService.findAllByEntity('amc', id);
      for (const doc of documents) {
        await this.documentService.remove(doc.id);
      }
      await this.amcRepository.remove(amc);

      return {
        isSuccessful: true,
        message:
          'AMC record removed successfully, along with associated documents',
        data: null,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete AMC record. ' + error.message,
      );
    }
  }
}
