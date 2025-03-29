import { IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';
import { VehicleStatus } from '../entities/vehicle.entity';


export class PaginationAndFilteringDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 10;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status: VehicleStatus;

  @IsOptional()
  @IsInt()
  minBatteryCapacity: number;

  @IsOptional()
  @IsInt()
  maxBatteryCapacity: number;

  @IsOptional()
  @IsInt()
  minChargeLevel: number;

  @IsOptional()
  @IsInt()
  maxChargeLevel: number;
}
