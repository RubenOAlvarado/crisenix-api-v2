import { Module } from '@nestjs/common';
import { FileManagerController } from './file-manager.controller';
import { CatalogManagerService } from './catalog-manager.service';
import { TransportTypeModule } from '../transporttype/transporttype.module';
import { TransportsModule } from '@/transports/transports.module';
import { TransportSheetLoader } from './loaders/transportSheet.loader';

@Module({
  imports: [TransportTypeModule, TransportsModule],
  controllers: [FileManagerController],
  providers: [CatalogManagerService, TransportSheetLoader],
})
export class FileManagerModule {}
