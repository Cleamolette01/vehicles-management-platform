import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { FleetEfficiencyService } from './fleet-efficiency.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehicleEntity } from '../../../entities/vehicle.entity';

describe('FleetEfficiencyService', () => {
  let service: FleetEfficiencyService;
  let vehicleRepository: Repository<VehicleEntity>;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FleetEfficiencyService,
        {
          provide: getRepositoryToken(VehicleEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
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

    service = module.get<FleetEfficiencyService>(FleetEfficiencyService);
    vehicleRepository = module.get<Repository<VehicleEntity>>(getRepositoryToken(VehicleEntity));
    cacheManager = module.get<Cache>('CACHE_MANAGER');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cached data for getAverageEnergyConsumptionRate if available', async () => {
    const mockCachedData = [{ model: 'car', avgEnergyConsumption: 12 }];
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(mockCachedData);

    const result = await service.getAverageEnergyConsumptionRate();
    expect(result).toEqual(mockCachedData);
    expect(cacheManager.get).toHaveBeenCalledWith('avg_energy_consumption');
  });

  it('should fetch data from DB and cache it for getAverageEnergyConsumptionRate if cache is empty', async () => {
    const mockDbData = [{ model: 'car', avgEnergyConsumption: 12 }];
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null); // Simulate cache miss
    jest.spyOn(vehicleRepository, 'createQueryBuilder').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValueOnce(mockDbData),
    } as any);

    const result = await service.getAverageEnergyConsumptionRate();
    expect(result).toEqual(mockDbData);
    expect(cacheManager.set).toHaveBeenCalledWith('avg_energy_consumption', mockDbData, 600000);
  });

  it('should return cached data for getEmissionsComparison if available', async () => {
    const mockCachedData = [{ type: 'car', avgEmissions: 200 }];
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(mockCachedData);

    const result = await service.getEmissionsComparison();
    expect(result).toEqual(mockCachedData);
    expect(cacheManager.get).toHaveBeenCalledWith('emissions_comparison');
  });

  it('should fetch data from DB and cache it for getEmissionsComparison if cache is empty', async () => {
    const mockDbData = [{ type: 'car', avgEmissions: 200 }];
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null); // Simulate cache miss
    jest.spyOn(vehicleRepository, 'createQueryBuilder').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValueOnce(mockDbData),
    } as any);

    const result = await service.getEmissionsComparison();
    expect(result).toEqual(mockDbData);
    expect(cacheManager.set).toHaveBeenCalledWith('emissions_comparison', mockDbData, 600000);
  });
});
