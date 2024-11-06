import { Test, TestingModule } from '@nestjs/testing';
import { IncludedServicesController } from './includedServices.controller';
import { IncludedServicesService } from './includedServices.service';

describe('IncludedServicesController', () => {
  let controller: IncludedServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncludedServicesController],
      providers: [IncludedServicesService],
    }).compile();

    controller = module.get<IncludedServicesController>(
      IncludedServicesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
