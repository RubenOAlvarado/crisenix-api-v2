import { Module } from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { FileManagerController } from './file-manager.controller';
import { DestinationModule } from '@/destination/destination.module';
import { TourModule } from '@/tour/tour.module';
import { TransportsModule } from '@/transports/transports.module';
import { CatalogManagerService } from './catalog-manager.service';
import { TourtypeModule } from '@/tourtype/tourtype.module';
import { OrigincityModule } from '@/origincity/origincity.module';
import { AboardpointModule } from '@/aboardpoint/aboardpoint.module';
import { CategoryModule } from '@/category/category.module';
import { TransfertypeModule } from '@/transfertype/transfertype.module';

@Module({
  imports: [
    DestinationModule,
    TourModule,
    TransportsModule,
    TourtypeModule,
    OrigincityModule,
    AboardpointModule,
    CategoryModule,
    TransfertypeModule,
  ],
  controllers: [FileManagerController],
  providers: [FileManagerService, CatalogManagerService],
})
export class FileManagerModule {}
