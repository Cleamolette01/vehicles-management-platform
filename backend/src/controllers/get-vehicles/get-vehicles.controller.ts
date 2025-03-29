import { Controller, Get, Query } from '@nestjs/common';
import { PaginationAndFilteringDto } from '../../dtos/pagination-and-filtering.dto';
import { GetVehiclesService } from 'src/services/get-vehicles.service';


@Controller('vehicles')
export class GetVehiclesController {
  constructor(private readonly getVehiclesService: GetVehiclesService) {}

  @Get()
  async getVehicles(@Query() paginationDto: PaginationAndFilteringDto) {
    return this.getVehiclesService.getVehicles(paginationDto);
  }
}
