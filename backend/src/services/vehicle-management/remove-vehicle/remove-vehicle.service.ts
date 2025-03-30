import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../../../entities/vehicle.entity';
import { VehicleNotFoundException } from '../../../exceptions/vehicle-not-found-exception';

@Injectable()
export class RemoveVehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async delete(id: string): Promise<void> {
  const vehicle = await this.vehicleRepository.findOneBy({ id });
    if (!vehicle) {
        throw new VehicleNotFoundException(id)
      }
    await this.vehicleRepository.remove(vehicle);
  }
}
