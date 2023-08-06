import { Test, TestingModule } from '@nestjs/testing';
import { PrivatetourService } from './privatetour.service';

describe('PrivatetourService', () => {
  let service: PrivatetourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivatetourService],
    }).compile();

    service = module.get<PrivatetourService>(PrivatetourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
