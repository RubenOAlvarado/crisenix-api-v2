import { Test, TestingModule } from '@nestjs/testing';
import { AboardpointController } from './aboardpoint.controller';
import { AboardpointService } from './aboardpoint.service';

describe('AboardpointController', () => {
  let controller: AboardpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboardpointController],
      providers: [AboardpointService],
    }).compile();

    controller = module.get<AboardpointController>(AboardpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
