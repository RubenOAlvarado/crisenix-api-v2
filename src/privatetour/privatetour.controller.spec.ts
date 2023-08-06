import { Test, TestingModule } from '@nestjs/testing';
import { PrivatetourController } from './privatetour.controller';
import { PrivatetourService } from './privatetour.service';

describe('PrivatetourController', () => {
  let controller: PrivatetourController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivatetourController],
      providers: [PrivatetourService],
    }).compile();

    controller = module.get<PrivatetourController>(PrivatetourController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
