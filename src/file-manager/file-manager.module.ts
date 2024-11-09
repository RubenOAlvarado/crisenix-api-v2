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
import { DestinationModule } from '@/destination/destination.module';
import { DestinationSheetLoader } from './loaders/destinationSheet.loader';
import { CategorySheetLoader } from './loaders/categorySheet.loader';
import { IncludedServicesModule } from '@/includedServices/includedServices.module';
import { EntriesModule } from '@/entries/entries.module';
import { IncludedServicesSheetLoader } from './loaders/includedServices.loader';
import { PricesModule } from '@/prices/prices.module';
import { PricesSheetLoader } from './loaders/pricesSheet.loader';
import { ClassificationModule } from '@/classification/classification.module';
import { ClassificationsSheetLoader } from './loaders/classificationsSheet.loader';
import { RolesModule } from '@/roles/roles.module';
import { RolesSheetLoader } from './loaders/rolesSheet.loader';
import { TourModule } from '@/tour/tour.module';
import { ToursSheetLoader } from './loaders/toursSheet.loader';

@Module({
  imports: [
    TransportTypeModule,
    TransportsModule,
    TourtypeModule,
    AboardpointModule,
    OrigincityModule,
    CategoryModule,
    DestinationModule,
    IncludedServicesModule,
    EntriesModule,
    PricesModule,
    ClassificationModule,
    RolesModule,
    TourModule,
  ],
  controllers: [FileManagerController],
  providers: [
    CatalogManagerService,
    TransportSheetLoader,
    TourTypeSheetLoader,
    AboardPointsSheetLoader,
    CategorySheetLoader,
    DestinationSheetLoader,
    IncludedServicesSheetLoader,
    PricesSheetLoader,
    ClassificationsSheetLoader,
    RolesSheetLoader,
    ToursSheetLoader,
  ],
})
export class FileManagerModule {}
