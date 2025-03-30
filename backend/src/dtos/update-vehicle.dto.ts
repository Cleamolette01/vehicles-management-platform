import { IsString, IsInt, IsEnum, IsNumber, IsOptional, IsDate, Min, Max } from 'class-validator';
import { VehicleStatus, VehicleType } from 'src/entities/vehicle.entity';

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  battery_capacity_kwh?: number;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  current_charge_level?: number;

  @IsEnum(VehicleStatus)
  @IsOptional()
  status?: VehicleStatus;

  @IsDate()
  @IsOptional()
  last_updated?: Date;

  @IsNumber()
  @IsOptional()
  avg_energy_consumption?: number;

  @IsEnum(VehicleType)
  @IsOptional()
  type?: VehicleType;

  @IsInt()
  @IsOptional()
  emission_gco2_km?: number;
}
