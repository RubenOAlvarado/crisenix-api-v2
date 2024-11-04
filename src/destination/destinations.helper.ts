import { BadRequestException } from '@nestjs/common';

export function filterOutPhotos(
  existingPhotos: string[] | undefined,
  photosToDelete: string[],
): string[] {
  if (!existingPhotos || existingPhotos.length === 0)
    throw new BadRequestException('Destination does not have any photos in DB');
  return existingPhotos?.filter((photo) => !photosToDelete.includes(photo));
}
