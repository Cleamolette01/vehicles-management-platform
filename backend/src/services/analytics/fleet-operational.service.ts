import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity, VehicleStatus } from 'src/entities/vehicle.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class FleetOperationalService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,

    @Inject('CACHE_MANAGER')
    private cacheManager: Cache,
  ) {}

  async getFleetAvailabilityRate(): Promise<{ availabilityRate: string }> {
    const cacheKey = 'fleet_availability_rate';

    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData as { availabilityRate: string };
    }

    const totalVehicles = await this.vehicleRepository.count();
    if (totalVehicles === 0) {
      return { availabilityRate: '0%' };
    }

    const availableCount = await this.vehicleRepository.count({
      where: { status: VehicleStatus.available },
    });

    const result = {
      availabilityRate: ((availableCount / totalVehicles) * 100).toFixed(2) + '%',
    };

    await this.cacheManager.set(cacheKey, result, 600000);

    return result;
  }

  async getChargingVsInUse(): Promise<{ chargingCount: number; inUseCount: number }> {
    const cacheKey = 'charging_vs_in_use';

    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData as { chargingCount: number; inUseCount: number };
    }

    const chargingCount = await this.vehicleRepository.count({
      where: { status: VehicleStatus.charging },
    });

    const inUseCount = await this.vehicleRepository.count({
      where: { status: VehicleStatus.in_use },
    });

    const result = { chargingCount, inUseCount };

    await this.cacheManager.set(cacheKey, result, 600000);

    return result;
  }
}
