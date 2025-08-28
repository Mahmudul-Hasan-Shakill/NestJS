import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicFieldEntity } from './entity/dynamic-field.entity';
import { DynamicSchemaService } from './dynamic-schema.service';
import { DynamicSchemaController } from './dynamic-schema.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DynamicFieldEntity])],
  providers: [DynamicSchemaService],
  controllers: [DynamicSchemaController],
  exports: [DynamicSchemaService], // so other modules/services can call getUiSchema()
})
export class DynamicSchemaModule {}
