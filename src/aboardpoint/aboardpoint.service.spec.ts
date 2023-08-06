import { Test, TestingModule } from '@nestjs/testing';
import { AboardpointService } from './aboardpoint.service';

describe('AboardpointService', () => {
  let service: AboardpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AboardpointService],
    }).compile();

    service = module.get<AboardpointService>(AboardpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
