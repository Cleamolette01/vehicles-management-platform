import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VersionEntity } from './entities/version.entity';


const mockVersionRepository = {
  findOne: jest.fn().mockResolvedValue(null),
  save: jest.fn().mockResolvedValue({ value: '1' }),
};

const mockCacheManager = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
};

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getRepositoryToken(VersionEntity),
          useValue: mockVersionRepository,
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "Beev"', () => {
      expect(appController.getBeev()).toBe('Beev');
    });
  });

  describe('getVersion', () => {
    it('should return a version and increment it', async () => {
      const result = await appController.getVersion();
      expect(result).toEqual({ value: '1' });
      expect(mockVersionRepository.save).toHaveBeenCalledWith({ value: '1' });
    });
  });
});
