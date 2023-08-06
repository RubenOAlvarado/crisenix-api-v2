import { Test, TestingModule } from '@nestjs/testing';
import { TranslationtypeController } from './translationtype.controller';
import { TranslationtypeService } from './translationtype.service';

describe('TranslationtypeController', () => {
  let controller: TranslationtypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslationtypeController],
      providers: [TranslationtypeService],
    }).compile();

    controller = module.get<TranslationtypeController>(
      TranslationtypeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
