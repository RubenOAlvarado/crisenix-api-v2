import { Test, TestingModule } from '@nestjs/testing';
import { IncludedController } from './included.controller';
import { IncludedService } from './included.service';

describe('IncludedController', () => {
  let controller: IncludedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncludedController],
      providers: [IncludedService],
    }).compile();

    controller = module.get<IncludedController>(IncludedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
