import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity, VehicleStatus } from 'src/entities/vehicle.entity';

@Injectable()
export class FleetOperationalService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async getFleetAvailabilityRate(): Promise<{ availabilityRate: string }> {
    const totalVehicles = await this.vehicleRepository.count();
    if (totalVehicles === 0) {
      return { availabilityRate: '0%' };
    }

    const availableCount = await this.vehicleRepository.count({
      where: { status: VehicleStatus.available },
    });

    return {
      availabilityRate: ((availableCount / totalVehicles) * 100).toFixed(2) + '%',
    };
  }

  async getChargingVsInUse(): Promise<{ chargingCount: number; inUseCount: number }> {
    const chargingCount = await this.vehicleRepository.count({
      where: { status: VehicleStatus.charging },
    });

    const inUseCount = await this.vehicleRepository.count({
      where: { status: VehicleStatus.in_use },
    });

    return {
      chargingCount,
      inUseCount,
    };
  }
}
