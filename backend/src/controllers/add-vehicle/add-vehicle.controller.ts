import { Controller, Post, Body } from '@nestjs/common';
import { AddVehicleDto } from 'src/dtos/add-vehicule.dto';
import { AddVehicleService } from 'src/services/vehicle-management/add-vehicule.service';


@Controller('vehicles')
export class AddVehicleController {
  constructor(private readonly addVehicleService: AddVehicleService) {}

  @Post()
  async create(@Body() addVehicleDto: AddVehicleDto) {
    return this.addVehicleService.addVehicule(addVehicleDto);
  }
}
