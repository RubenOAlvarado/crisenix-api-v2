import { Test, TestingModule } from '@nestjs/testing';
import { TourtypeController } from './tourtype.controller';
import { TourtypeService } from './tourtype.service';

describe('TourtypeController', () => {
  let controller: TourtypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TourtypeController],
      providers: [TourtypeService],
    }).compile();

    controller = module.get<TourtypeController>(TourtypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
