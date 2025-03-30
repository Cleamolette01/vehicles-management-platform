import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddVehicleDto } from '../../../dtos/add-vehicule.dto';
import { VehicleEntity } from '../../../entities/vehicle.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AddVehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async addVehicule(addVehicleDto: AddVehicleDto): Promise<VehicleEntity> {
    const vehicle = this.vehicleRepository.create(addVehicleDto);
    return await this.vehicleRepository.save(vehicle);
  }
}
