import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryActivitiesController } from './itineraryActivities.controller';
import { ItineraryActivitiesService } from './itineraryActivities.service';

describe('ItineraryActivitiesController', () => {
  let controller: ItineraryActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItineraryActivitiesController],
      providers: [ItineraryActivitiesService],
    }).compile();

    controller = module.get<ItineraryActivitiesController>(
      ItineraryActivitiesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
