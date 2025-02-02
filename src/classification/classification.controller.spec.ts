import { Test, TestingModule } from '@nestjs/testing';
import { ClasificationController } from './classification.controller';
import { ClasificationService } from './classification.service';

describe('ClasificationController', () => {
  let controller: ClasificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClasificationController],
      providers: [ClasificationService],
    }).compile();

    controller = module.get<ClasificationController>(ClasificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
