import { Test, TestingModule } from '@nestjs/testing';
import { EventlogService } from './eventlog.service';

describe('EventlogService', () => {
  let service: EventlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventlogService],
    }).compile();

    service = module.get<EventlogService>(EventlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
