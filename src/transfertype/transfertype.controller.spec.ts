import { Test, TestingModule } from '@nestjs/testing';
import { TransfertypeController } from './transfertype.controller';
import { TransfertypeService } from './transfertype.service';

describe('TransfertypeController', () => {
  let controller: TransfertypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfertypeController],
      providers: [TransfertypeService],
    }).compile();

    controller = module.get<TransfertypeController>(TransfertypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
