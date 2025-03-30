import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { GetVehiclesService } from './get-vehicles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehicleEntity, VehicleStatus, VehicleType } from '../../../entities/vehicle.entity';
import { VehicleNotFoundException } from '../../../exceptions/vehicle-not-found-exception';
import { PaginationAndFilteringDto } from '../../../dtos/pagination-and-filtering.dto';

describe('GetVehiclesService', () => {
  let service: GetVehiclesService;
  let vehicleRepository: Repository<VehicleEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVehiclesService,
        {
          provide: getRepositoryToken(VehicleEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetVehiclesService>(GetVehiclesService);
    vehicleRepository = module.get<Repository<VehicleEntity>>(getRepositoryToken(VehicleEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getVehicles', () => {
    it('should return paginated vehicles with filters applied', async () => {
      const paginationDto: PaginationAndFilteringDto = {
        page: 1,
        pageSize: 10,
        status: VehicleStatus.available,
        minBatteryCapacity: 50,
        maxBatteryCapacity: 100,
        minChargeLevel: 20,
        maxChargeLevel: 80,
      };

      const mockVehicles = [
        { id: '1', model: 'Tesla Model S', status: 'available' },
        { id: '2', model: 'Tesla Model 3', status: 'available' },
      ];

      const mockTotal = 2;

      // Mock the repository methods
      jest.spyOn(vehicleRepository, 'createQueryBuilder').mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockVehicles, mockTotal]),
      } as any);

      const result = await service.getVehicles(paginationDto);
      expect(result).toEqual({
        data: mockVehicles,
        total: mockTotal,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      });

      expect(vehicleRepository.createQueryBuilder).toHaveBeenCalledWith('vehicle');
      expect(vehicleRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('vehicle.status = :status', { status: 'available' });
      expect(vehicleRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('vehicle.battery_capacity_kwh >= :minBatteryCapacity', { minBatteryCapacity: 50 });
      expect(vehicleRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('vehicle.battery_capacity_kwh <= :maxBatteryCapacity', { maxBatteryCapacity: 100 });
      expect(vehicleRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('vehicle.current_charge_level >= :minChargeLevel', { minChargeLevel: 20 });
      expect(vehicleRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('vehicle.current_charge_level <= :maxChargeLevel', { maxChargeLevel: 80 });
    });
  });

  describe('findById', () => {
    it('should return a vehicle if found', async () => {
      const mockVehicle = { id: 'e849df07-1e46-43af-83d5-7616e2e987c2',  model: 'Tesla Model S',
              type: VehicleType.BEV,
              battery_capacity_kwh: 85,
              current_charge_level: 80,
              emission_gco2_km: 0,
              brand: '',
              status: VehicleStatus.available,
              last_updated: new Date(),
              avg_energy_consumption: 0 };

      jest.spyOn(vehicleRepository, 'findOneBy').mockResolvedValueOnce(mockVehicle);

      const result = await service.findById('1');
      expect(result).toEqual(mockVehicle);
      expect(vehicleRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw a VehicleNotFoundException if vehicle is not found', async () => {
      jest.spyOn(vehicleRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(service.findById('1')).rejects.toThrowError(new VehicleNotFoundException('1'));
    });
  });
});
