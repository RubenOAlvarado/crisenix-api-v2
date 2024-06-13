import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { excelFileFilter } from '@/shared/utilities/fileManagement.utils';
import { Public } from '@/auth/public.decorator';
import { CatalogManagerService } from './catalog-manager.service';

@ApiExcludeController()
@Controller('file-manager')
export class FileManagerController {
  constructor(
    private readonly fileManagerService: FileManagerService,
    private readonly catalogFileManager: CatalogManagerService,
  ) {}

  @ApiExcludeEndpoint()
  @Public()
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      fileFilter: excelFileFilter,
    }),
  )
  async load(@UploadedFile() file: Express.Multer.File) {
    await this.fileManagerService.loadToursAndDestinations(file.path);
  }

  @ApiExcludeEndpoint()
  @Public()
  @Post('catalogs')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      fileFilter: excelFileFilter,
    }),
  )
  async loadCatalogs(@UploadedFile() file: Express.Multer.File) {
    await this.catalogFileManager.loadCatalogs(file.path);
  }
}
