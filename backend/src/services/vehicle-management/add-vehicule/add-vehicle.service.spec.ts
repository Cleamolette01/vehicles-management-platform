import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehicleEntity, VehicleStatus, VehicleType } from '../../../entities/vehicle.entity';
import { AddVehicleDto } from '../../../dtos/add-vehicule.dto';
import { AddVehicleService } from './add-vehicule.service';

describe('AddVehicleService', () => {
  let service: AddVehicleService;
  let vehicleRepository: Repository<VehicleEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddVehicleService,
        {
          provide: getRepositoryToken(VehicleEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AddVehicleService>(AddVehicleService);
    vehicleRepository = module.get<Repository<VehicleEntity>>(getRepositoryToken(VehicleEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call create and save methods of vehicleRepository when addVehicule is called', async () => {
    const addVehicleDto: AddVehicleDto = {
        model: 'Tesla Model S',
        type: VehicleType.BEV,
        battery_capacity_kwh: 85,
        current_charge_level: 80,
        emission_gco2_km: 0,
        brand: '',
        status: VehicleStatus.available,
        last_updated: new Date(),
        avg_energy_consumption: 0
    };

    const mockVehicle = { id: '1', ...addVehicleDto };

    jest.spyOn(vehicleRepository, 'create').mockReturnValue(mockVehicle as VehicleEntity);
    jest.spyOn(vehicleRepository, 'save').mockResolvedValue(mockVehicle as VehicleEntity);

    const result = await service.addVehicule(addVehicleDto);
    expect(vehicleRepository.create).toHaveBeenCalledWith(addVehicleDto);
    expect(vehicleRepository.save).toHaveBeenCalledWith(mockVehicle);
    expect(result).toEqual(mockVehicle);
  });
});
