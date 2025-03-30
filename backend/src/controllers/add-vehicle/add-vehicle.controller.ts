import { Controller, Post, Body } from '@nestjs/common';
import { AddVehicleDto } from '../../dtos/add-vehicule.dto';
import { AddVehicleService } from '../../services/vehicle-management/add-vehicule/add-vehicule.service';


@Controller('vehicles')
export class AddVehicleController {
  constructor(private readonly addVehicleService: AddVehicleService) {}

  @Post()
  async create(@Body() addVehicleDto: AddVehicleDto) {
    return this.addVehicleService.addVehicule(addVehicleDto);
  }
}
