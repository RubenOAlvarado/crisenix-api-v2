import { Module } from '@nestjs/common';
import { ClasificationService } from './clasification.service';
import { ClasificationController } from './clasification.controller';
import {
  ClasificationSchema,
  Clasifications,
} from '@/shared/models/schemas/clasification.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Clasifications.name, schema: ClasificationSchema },
    ]),
  ],
  controllers: [ClasificationController],
  providers: [ClasificationService],
})
export class ClasificationModule {}
