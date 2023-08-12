import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as XLSX from 'xlsx';
const {
  readFile,
  utils: { sheet_to_json },
} = XLSX;

@Injectable()
export class FilerService {
  private readonly logger = new Logger(FilerService.name);

  excelToJson<T>(filePath: string): T[] {
    try {
      this.logger.log(`readExcelFile`);
      const workbook: XLSX.WorkBook = readFile(filePath);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    } catch (error) {
      this.logger.error(`Error converting excel to json: ${error}`);
      throw new InternalServerErrorException('Error converting excel to json');
    }
  }
}
