import { Module } from '@nestjs/common';
import { DestinationModule } from '@/destination/destination.module';
import { TourModule } from '@/tour/tour.module';
import { TransportsModule } from '@/transports/transports.module';
import { TourtypeModule } from '@/tourtype/tourtype.module';
import { OrigincityModule } from '@/origincity/origincity.module';
import { AboardpointModule } from '@/aboardpoint/aboardpoint.module';
import { CategoryModule } from '@/category/category.module';
import { TransfertypeModule } from '@/transfertype/transfertype.module';
import { PricesModule } from '@/prices/prices.module';
import { FileManagerController } from './file-manager.controller';
import { CatalogManagerService } from './catalog-manager.service';

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
    PricesModule,
  ],
  controllers: [FileManagerController],
  providers: [CatalogManagerService],
})
export class FileManagerModule {}
