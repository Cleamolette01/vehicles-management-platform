import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../entities/vehicle.entity';
import { PaginationAndFilteringDto } from '../dtos/pagination-and-filtering.dto';


@Injectable()
export class GetVehiclesService  {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async getVehicles(paginationDto: PaginationAndFilteringDto) {
    const { page, pageSize, status, minBatteryCapacity, maxBatteryCapacity, minChargeLevel, maxChargeLevel } = paginationDto;

    const queryBuilder = this.vehicleRepository.createQueryBuilder('vehicle');

    // Apply filters
    if (status) {
      queryBuilder.andWhere('vehicle.status = :status', { status });
    }
    if (minBatteryCapacity) {
      queryBuilder.andWhere('vehicle.battery_capacity_kwh >= :minBatteryCapacity', { minBatteryCapacity });
    }
    if (maxBatteryCapacity) {
      queryBuilder.andWhere('vehicle.battery_capacity_kwh <= :maxBatteryCapacity', { maxBatteryCapacity });
    }
    if (minChargeLevel) {
      queryBuilder.andWhere('vehicle.current_charge_level >= :minChargeLevel', { minChargeLevel });
    }
    if (maxChargeLevel) {
      queryBuilder.andWhere('vehicle.current_charge_level <= :maxChargeLevel', { maxChargeLevel });
    }

    // Apply pagination
    queryBuilder.skip((page - 1) * pageSize);
    queryBuilder.take(pageSize);

    const [vehicles, total] = await queryBuilder.getManyAndCount();

    return {
      data: vehicles,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

}
