import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncludedServicesController } from './includedServices.controller';
import {
  IncludedServices,
  IncludedServicesSchema,
} from '@/shared/models/schemas/included.schema';
import { IncludedServicesService } from './includedServices.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IncludedServices.name, schema: IncludedServicesSchema },
    ]),
  ],
  controllers: [IncludedServicesController],
  providers: [IncludedServicesService],
  exports: [IncludedServicesService],
})
export class IncludedServicesModule {}
