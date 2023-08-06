import { Test, TestingModule } from '@nestjs/testing';
import { FilerService } from './filer.service';

describe('FilerService', () => {
  let service: FilerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilerService],
    }).compile();

    service = module.get<FilerService>(FilerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
