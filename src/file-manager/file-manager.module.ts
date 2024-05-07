import { Module } from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { FileManagerController } from './file-manager.controller';
import { DestinationModule } from '@/destination/destination.module';
import { TourModule } from '@/tour/tour.module';

@Module({
  imports: [DestinationModule, TourModule],
  controllers: [FileManagerController],
  providers: [FileManagerService],
})
export class FileManagerModule {}
