import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { FleetOperationalService } from './fleet-operational.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehicleEntity } from '../../../entities/vehicle.entity';

describe('FleetOperationalService', () => {
  let service: FleetOperationalService;
  let vehicleRepository: Repository<VehicleEntity>;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FleetOperationalService,
        {
          provide: getRepositoryToken(VehicleEntity),
          useValue: {
            count: jest.fn(),
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

    service = module.get<FleetOperationalService>(FleetOperationalService);
    vehicleRepository = module.get<Repository<VehicleEntity>>(getRepositoryToken(VehicleEntity));
    cacheManager = module.get<Cache>('CACHE_MANAGER');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cached data for getFleetAvailabilityRate if available', async () => {
    const mockCachedData = { availabilityRate: '75%' };
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(mockCachedData);

    const result = await service.getFleetAvailabilityRate();
    expect(result).toEqual(mockCachedData);
    expect(cacheManager.get).toHaveBeenCalledWith('fleet_availability_rate');
  });

  it('should fetch data from DB and cache it for getFleetAvailabilityRate if cache is empty', async () => {
    const totalVehicles = 100;
    const availableCount = 75;
    const mockDbData = { availabilityRate: '75.00%' };

    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null); // Simulate cache miss
    jest.spyOn(vehicleRepository, 'count').mockResolvedValueOnce(totalVehicles);
    jest.spyOn(vehicleRepository, 'count').mockResolvedValueOnce(availableCount);

    const result = await service.getFleetAvailabilityRate();
    expect(result).toEqual(mockDbData);
    expect(cacheManager.set).toHaveBeenCalledWith('fleet_availability_rate', mockDbData, 600000);
  });


  it('should return cached data for getChargingVsInUse if available', async () => {
    const mockCachedData = { chargingCount: 10, inUseCount: 50 };
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(mockCachedData);

    const result = await service.getChargingVsInUse();
    expect(result).toEqual(mockCachedData);
    expect(cacheManager.get).toHaveBeenCalledWith('charging_vs_in_use');
  });

  it('should fetch data from DB and cache it for getChargingVsInUse if cache is empty', async () => {
    const chargingCount = 10;
    const inUseCount = 50;
    const mockDbData = { chargingCount, inUseCount };

    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null); // Simulate cache miss
    jest.spyOn(vehicleRepository, 'count').mockResolvedValueOnce(chargingCount);
    jest.spyOn(vehicleRepository, 'count').mockResolvedValueOnce(inUseCount);

    const result = await service.getChargingVsInUse();
    expect(result).toEqual(mockDbData);
    expect(cacheManager.set).toHaveBeenCalledWith('charging_vs_in_use', mockDbData, 600000);
  });
});
