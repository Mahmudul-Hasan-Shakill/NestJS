import { Module } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { ClusterController } from './cluster.controller';
import { ClusterEntity } from './entity/cluster.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ClusterEntity])],
  controllers: [ClusterController],
  providers: [ClusterService],
})
export class ClusterModule {}
