import { Test, TestingModule } from '@nestjs/testing';
import { FilerController } from './filer.controller';
import { FilerService } from './filer.service';

describe('FilerController', () => {
  let controller: FilerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilerController],
      providers: [FilerService],
    }).compile();

    controller = module.get<FilerController>(FilerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
