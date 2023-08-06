import { Test, TestingModule } from '@nestjs/testing';
import { SalertypeService } from './salertype.service';

describe('SalertypeService', () => {
  let service: SalertypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalertypeService],
    }).compile();

    service = module.get<SalertypeService>(SalertypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
