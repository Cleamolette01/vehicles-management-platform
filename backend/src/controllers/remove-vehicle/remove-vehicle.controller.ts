import { Controller, Body, Delete, Param } from '@nestjs/common';
import { RemoveVehicleService } from 'src/services/vehicle-management/remove-vehicle/remove-vehicle.service';


@Controller('vehicles')
export class RemoveVehicleController {
  constructor(private readonly removeVehicleService: RemoveVehicleService) {}

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.removeVehicleService.delete(id);
  }
}
