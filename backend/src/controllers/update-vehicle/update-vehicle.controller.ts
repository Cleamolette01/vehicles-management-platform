import { Body, Controller,  Param, Put } from '@nestjs/common';
import { UpdateVehicleDto } from '../../dtos/update-vehicle.dto';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { UpdateVehicleService } from '../../services/vehicle-management/update-vehicle/update-vehicle.service';


@Controller('vehicles')
export class UpdateVehicleController {
  constructor(private readonly updateVehicleService: UpdateVehicleService) {}

  @Put(':id')
  async updateVehicle(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Promise<VehicleEntity> {
    return this.updateVehicleService.update(id, updateVehicleDto);
  }
}
