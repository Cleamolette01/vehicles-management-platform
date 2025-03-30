import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { FleetCompositionService } from './fleet-composition.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehicleEntity } from '../../../entities/vehicle.entity';

describe('FleetCompositionService', () => {
  let service: FleetCompositionService;
  let vehicleRepository: Repository<VehicleEntity>;
  let cacheManager: Cache;

    beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FleetCompositionService,
        {
          provide: getRepositoryToken(VehicleEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            getRawMany: jest.fn(),
          },
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FleetCompositionService>(FleetCompositionService);
    vehicleRepository = module.get<Repository<VehicleEntity>>(getRepositoryToken(VehicleEntity));
    cacheManager = module.get<Cache>('CACHE_MANAGER');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cached data if available', async () => {
    const mockCachedData = [{ type: 'car', count: 10 }];
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(mockCachedData);

    const result = await service.getFleetComposition();
    expect(result).toEqual(mockCachedData);
    expect(cacheManager.get).toHaveBeenCalledWith('fleet_composition');
  });

  it('should fetch data from DB if cache is empty and then cache it', async () => {
    const mockDbData = [{ type: 'car', count: 10 }];
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null); // Simulate cache miss
    jest.spyOn(vehicleRepository, 'createQueryBuilder').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValueOnce(mockDbData),
    } as any);

    const result = await service.getFleetComposition();
    expect(result).toEqual(mockDbData);
    expect(cacheManager.set).toHaveBeenCalledWith('fleet_composition', mockDbData, 600000);
  });
});
