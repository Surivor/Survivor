import { Test, TestingModule } from '@nestjs/testing';
import { SirhController } from './sirh.controller';

describe('SirhController', () => {
  let controller: SirhController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SirhController],
    }).compile();

    controller = module.get<SirhController>(SirhController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
