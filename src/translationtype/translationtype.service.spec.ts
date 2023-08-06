import { Test, TestingModule } from '@nestjs/testing';
import { TranslationtypeService } from './translationtype.service';

describe('TranslationtypeService', () => {
  let service: TranslationtypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TranslationtypeService],
    }).compile();

    service = module.get<TranslationtypeService>(TranslationtypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
