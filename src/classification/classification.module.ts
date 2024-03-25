import { Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { ClassificationController } from './classification.controller';
import {
  ClassificationSchema,
  Classifications,
} from '@/shared/models/schemas/classification.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FilerModule } from '@/filer/filer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Classifications.name, schema: ClassificationSchema },
    ]),
    FilerModule,
  ],
  controllers: [ClassificationController],
  providers: [ClassificationService],
})
export class ClassificationModule {}
