import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from 'src/entities/vehicle.entity';

@Injectable()
export class FleetEfficiencyService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async getAverageEnergyConsumptionRate(): Promise<{ model: string; avgEnergyConsumption: number }[]> {
    return this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select('vehicle.model', 'model')
      .addSelect('AVG(vehicle.avg_energy_consumption)', 'avgEnergyConsumption')
      .groupBy('vehicle.model')
      .orderBy('avgEnergyConsumption', 'ASC')
      .getRawMany();
  }

  async getEmissionsComparison(): Promise<{ type: string; avgEmissions: number }[]> {
    return this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select('vehicle.type', 'type')
      .addSelect('AVG(vehicle.emission_gco2_km)', 'avgEmissions')
      .groupBy('vehicle.type')
      .orderBy('avgEmissions', 'ASC')
      .getRawMany();
  }

}
