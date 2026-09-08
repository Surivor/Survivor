import { Test, TestingModule } from '@nestjs/testing';
import { SirhService } from './sirh.service';

describe('SirhService', () => {
  let service: SirhService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SirhService],
    }).compile();

    service = module.get<SirhService>(SirhService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
