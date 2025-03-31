import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleNotFoundException } from '../../../exceptions/vehicle-not-found-exception';
import { PaginationAndFilteringDto } from '../../../dtos/pagination-and-filtering.dto';
import { VehicleEntity } from '../../../entities/vehicle.entity';

@Injectable()
export class GetVehiclesService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async getVehicles(paginationDto: PaginationAndFilteringDto) {
    const {
      page,
      pageSize,
      status,
      minBatteryCapacity,
      maxBatteryCapacity,
      minChargeLevel,
      maxChargeLevel,
      sort,
      sortOrder,
    } = paginationDto;

    const queryBuilder = this.vehicleRepository.createQueryBuilder('vehicle');

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

    // Sorting
    if (sort) {
      const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
      queryBuilder.orderBy(`vehicle.${sort}`, order);
    }

    // Pagination
    if (page && pageSize) {
      queryBuilder.skip((page - 1) * pageSize);
      queryBuilder.take(pageSize);
    }

    const [vehicles, total] = await queryBuilder.getManyAndCount();

    const result = {
      data: vehicles,
      total,
      page: page || 1,
      pageSize: pageSize || total,
      totalPages: Math.ceil(total / (pageSize || total)),
    };

    return result;
  }

  async findById(id: string): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepository.findOneBy({ id });
    if (!vehicle) {
      throw new VehicleNotFoundException(id);
    }
    return vehicle;
  }
}
