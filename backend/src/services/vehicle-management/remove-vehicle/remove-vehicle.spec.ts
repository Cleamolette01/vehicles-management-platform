import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { RemoveVehicleService } from './remove-vehicle.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehicleEntity, VehicleStatus, VehicleType } from '../../../entities/vehicle.entity';
import { VehicleNotFoundException } from '../../../exceptions/vehicle-not-found-exception';

describe('RemoveVehicleService', () => {
  let service: RemoveVehicleService;
  let vehicleRepository: Repository<VehicleEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveVehicleService,
        {
          provide: getRepositoryToken(VehicleEntity),
          useValue: {
            findOneBy: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RemoveVehicleService>(RemoveVehicleService);
    vehicleRepository = module.get<Repository<VehicleEntity>>(getRepositoryToken(VehicleEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('delete', () => {
    it('should delete a vehicle if found', async () => {
      const mockVehicle = { id: 'd80b9830-5b89-4faa-9476-8eae01e2c6e4',         model: 'Tesla Model S',
              type: VehicleType.BEV,
              battery_capacity_kwh: 85,
              current_charge_level: 80,
              emission_gco2_km: 0,
              brand: '',
              status: VehicleStatus.available,
              last_updated: new Date(),
              avg_energy_consumption: 0 };


      jest.spyOn(vehicleRepository, 'findOneBy').mockResolvedValueOnce(mockVehicle);

      await service.delete('d80b9830-5b89-4faa-9476-8eae01e2c6e4');


      expect(vehicleRepository.remove).toHaveBeenCalledWith(mockVehicle);
    });

    it('should throw a VehicleNotFoundException if vehicle is not found', async () => {

      jest.spyOn(vehicleRepository, 'findOneBy').mockResolvedValueOnce(null);


      await expect(service.delete('1')).rejects.toThrowError(new VehicleNotFoundException('1'));
    });
  });
});
