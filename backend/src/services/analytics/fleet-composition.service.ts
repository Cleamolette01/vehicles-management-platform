import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from 'src/entities/vehicle.entity';

@Injectable()
export class FleetCompositionService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async getFleetComposition(): Promise<{ type: string; count: number }[]> {
    return this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select('vehicle.type', 'type')
      .addSelect('COUNT(vehicle.id)', 'count')
      .groupBy('vehicle.type')
      .getRawMany();
  }


}
