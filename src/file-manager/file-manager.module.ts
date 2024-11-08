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

@Module({
  imports: [
    TransportTypeModule,
    TransportsModule,
    TourtypeModule,
    AboardpointModule,
    OrigincityModule,
  ],
  controllers: [FileManagerController],
  providers: [
    CatalogManagerService,
    TransportSheetLoader,
    TourTypeSheetLoader,
    AboardPointsSheetLoader,
  ],
})
export class FileManagerModule {}
