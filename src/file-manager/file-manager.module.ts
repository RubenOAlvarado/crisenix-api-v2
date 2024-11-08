import { Module } from '@nestjs/common';
import { FileManagerController } from './file-manager.controller';
import { CatalogManagerService } from './catalog-manager.service';
import { TransportTypeModule } from '../transporttype/transporttype.module';
import { TransportsModule } from '@/transports/transports.module';
import { TransportSheetLoader } from './loaders/transportSheet.loader';
import { TourTypeSheetLoader } from './loaders/tourTypeSheet.loader';
import { AboardPointsSheetLoader } from './loaders/aboardPointsSheet.loader';
import { TourtypeModule } from '@/tourtype/tourtype.module';
import { AboardpointModule } from '@/aboardpoint/aboardpoint.module';
import { OrigincityModule } from '@/origincity/origincity.module';
import { CategoryModule } from '@/category/category.module';
import { CategorySheetLoader } from './loaders/CategorySheet.loader';
import { DestinationModule } from '@/destination/destination.module';
import { DestinationSheetLoader } from './loaders/destinationSheet.loader';

@Module({
  imports: [
    TransportTypeModule,
    TransportsModule,
    TourtypeModule,
    AboardpointModule,
    OrigincityModule,
    CategoryModule,
    DestinationModule,
  ],
  controllers: [FileManagerController],
  providers: [
    CatalogManagerService,
    TransportSheetLoader,
    TourTypeSheetLoader,
    AboardPointsSheetLoader,
    CategorySheetLoader,
    DestinationSheetLoader,
  ],
})
export class FileManagerModule {}
