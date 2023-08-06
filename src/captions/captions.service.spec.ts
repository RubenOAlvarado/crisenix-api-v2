import { Test, TestingModule } from '@nestjs/testing';
import { CaptionsService } from './captions.service';

describe('CaptionsService', () => {
  let service: CaptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaptionsService],
    }).compile();

    service = module.get<CaptionsService>(CaptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
