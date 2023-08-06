import { Test, TestingModule } from '@nestjs/testing';
import { SalerController } from './saler.controller';
import { SalerService } from './saler.service';

describe('SalerController', () => {
  let controller: SalerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalerController],
      providers: [SalerService],
    }).compile();

    controller = module.get<SalerController>(SalerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
