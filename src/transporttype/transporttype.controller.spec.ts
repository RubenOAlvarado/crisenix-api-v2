import { Test, TestingModule } from '@nestjs/testing';
import { TransportTypeController } from './transporttype.controller';
import { TransportTypeService } from './transporttype.service';

describe('TransportTypeController', () => {
  let controller: TransportTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportTypeController],
      providers: [TransportTypeService],
    }).compile();

    controller = module.get<TransportTypeController>(TransportTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
