import { Test, TestingModule } from '@nestjs/testing';
import { SalerService } from './saler.service';

describe('SalerService', () => {
  let service: SalerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalerService],
    }).compile();

    service = module.get<SalerService>(SalerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
