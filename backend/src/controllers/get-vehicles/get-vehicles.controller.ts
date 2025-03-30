import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginationAndFilteringDto } from '../../dtos/pagination-and-filtering.dto';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { GetVehiclesService } from '../../services/vehicle-management/get-vehicles/get-vehicles.service';


@Controller('vehicles')
export class GetVehiclesController {
  constructor(private readonly getVehiclesService: GetVehiclesService) {}

  @Get()
  async getVehicles(@Query() paginationDto: PaginationAndFilteringDto) {
    return this.getVehiclesService.getVehicles(paginationDto);
  }

  @Get(':id')
  async getVehicle(@Param('id') id: string): Promise<VehicleEntity> {
    return this.getVehiclesService.findById(id);
  }
}
