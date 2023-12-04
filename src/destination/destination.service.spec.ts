import { Test, TestingModule } from '@nestjs/testing';
import { DestinationService } from './destination.service';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('DestinationService', () => {
  let service: DestinationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DestinationService],
    }).compile();

    service = module.get<DestinationService>(DestinationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deletePhotos', () => {
    it('should delete the specified photo from the destination', async () => {
      // Arrange
      const photoToDelete = 'photo1';
      const destination = 'destination1';
      const destinationToUpdate = {
        _id: destination,
        status: 'ACTIVE',
        photos: ['photo1', 'photo2', 'photo3'],
      };
      const findByIdSpy = jest
        .spyOn(service['destinationModel'], 'findById')
        .mockResolvedValue(destinationToUpdate);
      const findByIdAndUpdateSpy = jest
        .spyOn(service['destinationModel'], 'findByIdAndUpdate')
        .mockResolvedValue(destinationToUpdate);

      // Act
      await service.deletePhotos({ photo: photoToDelete, destination });

      // Assert
      expect(findByIdSpy).toHaveBeenCalledWith(destination);
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(destination, {
        photos: ['photo2', 'photo3'],
      });
    });

    it('should throw NotFoundException if destination is not found', async () => {
      // Arrange
      const photoToDelete = 'photo1';
      const destination = 'destination1';
      const findByIdSpy = jest
        .spyOn(service['destinationModel'], 'findById')
        .mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.deletePhotos({ photo: photoToDelete, destination }),
      ).rejects.toThrowError(NotFoundException);
      expect(findByIdSpy).toHaveBeenCalledWith(destination);
    });

    it('should throw BadRequestException if destination is not in Active status', async () => {
      // Arrange
      const photoToDelete = 'photo1';
      const destination = 'destination1';
      const destinationToUpdate = {
        _id: destination,
        status: 'INACTIVE',
        photos: ['photo1', 'photo2', 'photo3'],
      };
      const findByIdSpy = jest
        .spyOn(service['destinationModel'], 'findById')
        .mockResolvedValue(destinationToUpdate);

      // Act & Assert
      await expect(
        service.deletePhotos({ photo: photoToDelete, destination }),
      ).rejects.toThrowError(BadRequestException);
      expect(findByIdSpy).toHaveBeenCalledWith(destination);
    });

    it('should throw BadRequestException if photo does not belong to the destination', async () => {
      // Arrange
      const photoToDelete = 'photo4';
      const destination = 'destination1';
      const destinationToUpdate = {
        _id: destination,
        status: 'ACTIVE',
        photos: ['photo1', 'photo2', 'photo3'],
      };
      const findByIdSpy = jest
        .spyOn(service['destinationModel'], 'findById')
        .mockResolvedValue(destinationToUpdate);

      // Act & Assert
      await expect(
        service.deletePhotos({ photo: photoToDelete, destination }),
      ).rejects.toThrowError(BadRequestException);
      expect(findByIdSpy).toHaveBeenCalledWith(destination);
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      // Arrange
      const photoToDelete = 'photo1';
      const destination = 'destination1';
      const findByIdSpy = jest
        .spyOn(service['destinationModel'], 'findById')
        .mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(
        service.deletePhotos({ photo: photoToDelete, destination }),
      ).rejects.toThrowError(InternalServerErrorException);
      expect(findByIdSpy).toHaveBeenCalledWith(destination);
    });
  });
});
