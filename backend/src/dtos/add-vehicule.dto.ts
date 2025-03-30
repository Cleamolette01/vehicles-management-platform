import { IsString, IsInt, IsEnum, IsNumber, IsOptional, IsDate, Min, Max } from 'class-validator';
import { VehicleStatus, VehicleType } from '../entities/vehicle.entity';
import { Transform } from 'class-transformer';

export class AddVehicleDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(0)
  battery_capacity_kwh: number;

  @IsInt()
  @Min(0)
  @Max(100)
  current_charge_level: number;

  @IsEnum(VehicleStatus)
  status: VehicleStatus;

  @Transform(({ value }) => (typeof value === 'string' ? new Date(value) : value))
  @IsDate()
  last_updated: Date;

  @IsNumber()
  avg_energy_consumption: number;

  @IsEnum(VehicleType)
  type: VehicleType;

  @IsInt()
  emission_gco2_km: number;
}
