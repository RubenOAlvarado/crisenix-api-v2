import { Test, TestingModule } from '@nestjs/testing';
import { CaptionsController } from './captions.controller';
import { CaptionsService } from './captions.service';

describe('CaptionsController', () => {
  let controller: CaptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaptionsController],
      providers: [CaptionsService],
    }).compile();

    controller = module.get<CaptionsController>(CaptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
