import { Test, TestingModule } from '@nestjs/testing';
import { TourtypeService } from './tourtype.service';

describe('TourtypeService', () => {
  let service: TourtypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TourtypeService],
    }).compile();

    service = module.get<TourtypeService>(TourtypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
