import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class PaginationAndFilteringDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  minBatteryCapacity?: number;

  @IsOptional()
  @IsInt()
  @Max(100)
  maxBatteryCapacity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minChargeLevel?: number;

  @IsOptional()
  @IsInt()
  @Max(100)
  maxChargeLevel?: number;

  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  pageSize?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
