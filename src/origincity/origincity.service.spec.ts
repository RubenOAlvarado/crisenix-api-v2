import { Test, TestingModule } from '@nestjs/testing';
import { OrigincityService } from './origincity.service';

describe('OrigincityService', () => {
  let service: OrigincityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrigincityService],
    }).compile();

    service = module.get<OrigincityService>(OrigincityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
