import { Test, TestingModule } from '@nestjs/testing';
import { EventlogController } from './eventlog.controller';
import { EventlogService } from './eventlog.service';

describe('EventlogController', () => {
  let controller: EventlogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventlogController],
      providers: [EventlogService],
    }).compile();

    controller = module.get<EventlogController>(EventlogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
