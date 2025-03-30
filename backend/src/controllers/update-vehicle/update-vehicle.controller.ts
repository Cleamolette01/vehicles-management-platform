import { Body, Controller,  Param, Put } from '@nestjs/common';
import { UpdateVehicleDto } from 'src/dtos/update-vehicle.dto';
import { VehicleEntity } from 'src/entities/vehicle.entity';
import { UpdateVehicleService } from 'src/services/update-vehicle.service';


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
