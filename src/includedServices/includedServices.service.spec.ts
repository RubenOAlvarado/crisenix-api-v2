import { Test, TestingModule } from '@nestjs/testing';
import { IncludedServicesService } from './includedServices.service';

describe('IncludedServicesService', () => {
  let service: IncludedServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncludedServicesService],
    }).compile();

    service = module.get<IncludedServicesService>(IncludedServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
