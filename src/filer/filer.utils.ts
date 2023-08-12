import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const excelFileFilter = (
  _req: Request,
  file: { originalname: string },
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(xlsx|xls).$/)) {
    return callback(
      new BadRequestException('Only excel files are valid'),
      false,
    );
  }

  callback(null, true);
};
