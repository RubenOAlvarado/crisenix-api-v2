import { Test, TestingModule } from '@nestjs/testing';
import { IncludedService } from './included.service';

describe('IncludedService', () => {
  let service: IncludedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncludedService],
    }).compile();

    service = module.get<IncludedService>(IncludedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
