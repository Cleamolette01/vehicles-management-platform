import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../../../entities/vehicle.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class FleetEfficiencyService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,

    @Inject('CACHE_MANAGER')
    private cacheManager: Cache,
  ) {}

  async getAverageEnergyConsumptionRate(): Promise<{ model: string; avgEnergyConsumption: number }[]> {
    const cacheKey = 'avg_energy_consumption';

    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData as { model: string; avgEnergyConsumption: number }[];
    }

    const data = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select('vehicle.model', 'model')
      .addSelect('AVG(vehicle.avg_energy_consumption)', 'vehicles_avg_energy_consumption')
      .groupBy('vehicle.model')
      .orderBy('vehicles_avg_energy_consumption', 'ASC')
      .getRawMany();

    await this.cacheManager.set(cacheKey, data, 600000);

    return data;
  }

  async getEmissionsComparison(): Promise<{ type: string; avgEmissions: number }[]> {
    const cacheKey = 'emissions_comparison';

    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData as { type: string; avgEmissions: number }[];
    }

    const data = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select('vehicle.type', 'type')
      .addSelect('AVG(vehicle.emission_gco2_km)', 'vehicles_avg_emissions')
      .groupBy('vehicle.type')
      .orderBy('vehicles_avg_emissions', 'ASC')
      .getRawMany();

    await this.cacheManager.set(cacheKey, data, 600000);

    return data;
  }
}
