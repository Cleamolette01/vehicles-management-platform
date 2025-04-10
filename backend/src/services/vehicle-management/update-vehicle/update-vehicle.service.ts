import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../../../entities/vehicle.entity';
import { UpdateVehicleDto } from '../../../dtos/update-vehicle.dto';
import { VehicleNotFoundException } from '../../../exceptions/vehicle-not-found-exception';

@Injectable()
export class UpdateVehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepository.findOneBy({ id });
    if (!vehicle) {
      throw new VehicleNotFoundException(id)
    }

    Object.assign(vehicle, updateVehicleDto);

    return this.vehicleRepository.save(vehicle);
  }
}
