import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryActivitiesService } from './itineraryActivities.service';

describe('ItinerariesService', () => {
  let service: ItineraryActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItineraryActivitiesService],
    }).compile();

    service = module.get<ItineraryActivitiesService>(
      ItineraryActivitiesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
