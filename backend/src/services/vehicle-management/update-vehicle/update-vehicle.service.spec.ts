import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UpdateVehicleService } from './update-vehicle.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehicleEntity, VehicleStatus, VehicleType } from '../../../entities/vehicle.entity';
import { VehicleNotFoundException } from '../../../exceptions/vehicle-not-found-exception';
import { UpdateVehicleDto } from '../../../dtos/update-vehicle.dto';

describe('UpdateVehicleService', () => {
  let service: UpdateVehicleService;
  let vehicleRepository: Repository<VehicleEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateVehicleService,
        {
          provide: getRepositoryToken(VehicleEntity),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UpdateVehicleService>(UpdateVehicleService);
    vehicleRepository = module.get<Repository<VehicleEntity>>(getRepositoryToken(VehicleEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should update a vehicle if found', async () => {
      const mockVehicle = { id: 'd80b9830-5b89-4faa-9476-8eae01e2c6e4',         model: 'Tesla Model S',
              type: VehicleType.BEV,
              battery_capacity_kwh: 85,
              current_charge_level: 80,
              emission_gco2_km: 0,
              brand: '',
              status: VehicleStatus.available,
              last_updated: new Date(),
              avg_energy_consumption: 0 };
      const updateVehicleDto: UpdateVehicleDto = { model: 'Tesla Model X', battery_capacity_kwh: 90 };

      jest.spyOn(vehicleRepository, 'findOneBy').mockResolvedValueOnce(mockVehicle);


      jest.spyOn(vehicleRepository, 'save').mockResolvedValueOnce({ ...mockVehicle, ...updateVehicleDto });

      const result = await service.update('1', updateVehicleDto);


      expect(result).toEqual({ ...mockVehicle, ...updateVehicleDto });
      expect(vehicleRepository.save).toHaveBeenCalledWith({ ...mockVehicle, ...updateVehicleDto });
    });

    it('should throw a VehicleNotFoundException if vehicle is not found', async () => {
      jest.spyOn(vehicleRepository, 'findOneBy').mockResolvedValueOnce(null);

      const updateVehicleDto: UpdateVehicleDto = { model: 'Tesla Model X', battery_capacity_kwh: 90 };

      await expect(service.update('1', updateVehicleDto)).rejects.toThrowError(new VehicleNotFoundException('1'));
    });
  });
});
