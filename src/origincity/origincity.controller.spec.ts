import { Test, TestingModule } from '@nestjs/testing';
import { OrigincityController } from './origincity.controller';
import { OrigincityService } from './origincity.service';

describe('OrigincityController', () => {
  let controller: OrigincityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrigincityController],
      providers: [OrigincityService],
    }).compile();

    controller = module.get<OrigincityController>(OrigincityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
