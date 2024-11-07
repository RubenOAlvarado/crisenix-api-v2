import { Test, TestingModule } from '@nestjs/testing';
import { TransportTypeService } from './transporttype.service';

describe('TransportTypeService', () => {
  let service: TransportTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransportTypeService],
    }).compile();

    service = module.get<TransportTypeService>(TransportTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
