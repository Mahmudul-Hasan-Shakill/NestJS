import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClusterDto, UpdateClusterDto } from './dto/cluster.dto';
import { ClusterEntity } from './entity/cluster.entity';

@Injectable()
export class ClusterService {
  constructor(
    @InjectRepository(ClusterEntity)
    private readonly clusterRepository: Repository<ClusterEntity>,
  ) {}

  async create(createClusterDto: CreateClusterDto) {
    const { vmIpList, ...rest } = createClusterDto;

    const clusters = vmIpList.map((ip) =>
      this.clusterRepository.create({
        ...rest,
        vmIp: ip,
      }),
    );

    const savedClusters = await this.clusterRepository.save(clusters);

    return {
      isSuccessful: true,
      message: 'Cluster(s) created successfully',
      data: savedClusters,
    };
  }

  async findAll() {
    const clusters = await this.clusterRepository.find();
    return {
      isSuccessful: true,
      message: 'Clusters retrieved successfully',
      data: clusters,
    };
  }

  async findOne(id: number) {
    const cluster = await this.clusterRepository.findOne({ where: { id } });
    if (!cluster) {
      throw new NotFoundException(`Cluster with ID ${id} not found`);
    }
    return {
      isSuccessful: true,
      message: 'Cluster retrieved successfully',
      data: cluster,
    };
  }

  async update(id: number, updateClusterDto: UpdateClusterDto) {
    await this.findOne(id); // Ensure existence
    await this.clusterRepository.update(id, updateClusterDto);
    const updatedCluster = await this.clusterRepository.findOne({
      where: { id },
    });

    return {
      isSuccessful: true,
      message: 'Cluster updated successfully',
      data: updatedCluster!,
    };
  }

  async remove(id: number) {
    const cluster = await this.findOne(id);
    await this.clusterRepository.remove(cluster.data);
    return {
      isSuccessful: true,
      message: 'Cluster removed successfully',
      data: null,
    };
  }
}
