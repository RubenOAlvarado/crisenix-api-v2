import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { BadRequestException } from '@nestjs/common';
import { WorkSheet, utils } from 'xlsx';

export function transformSheet(sheet: WorkSheet | undefined): any {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return utils.sheet_to_json(sheet!);
}

export async function loadDocument(
  jsonObject: any,
  name: string,
  services: { [key: string]: (jsonObject: any) => Promise<void> },
): Promise<void> {
  try {
    if (services[name]) {
      const serviceFunction = services[name];
      if (typeof serviceFunction === 'function') {
        return await serviceFunction(jsonObject);
      } else {
        throw new BadRequestException('Invalid service function.');
      }
    } else {
      throw new BadRequestException('Invalid service name.');
    }
  } catch (error) {
    throw handleErrorsOnServices(`Error loading ${name} document.`, error);
  }
}

export function validateSheetNames(
  sheetNames: string[],
  validSheetNames: string[],
): void {
  if (!sheetNames.every((name) => validSheetNames.includes(name))) {
    throw new BadRequestException('Invalid sheet name.');
  }
}
