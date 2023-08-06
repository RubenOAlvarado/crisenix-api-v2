import { Test, TestingModule } from '@nestjs/testing';
import { SalertypeController } from './salertype.controller';
import { SalertypeService } from './salertype.service';

describe('SalertypeController', () => {
  let controller: SalertypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalertypeController],
      providers: [SalertypeService],
    }).compile();

    controller = module.get<SalertypeController>(SalertypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
