import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from 'src/entities/vehicle.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class FleetCompositionService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,

    @Inject('CACHE_MANAGER')
    private cacheManager: Cache,
  ) {}

  async getFleetComposition(): Promise<{ type: string; count: number }[]> {
    const cacheKey = 'fleet_composition';

    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData as { type: string; count: number }[];
    }

    const data = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select('vehicle.type', 'type')
      .addSelect('COUNT(vehicle.id)', 'count')
      .groupBy('vehicle.type')
      .getRawMany();

    await this.cacheManager.set(cacheKey, data, 600000);

    return data;
  }
}
