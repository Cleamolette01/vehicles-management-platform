import { Controller, Get } from '@nestjs/common';
import { FleetOperationalService } from 'src/services/analytics/fleet-operational/fleet-operational.service';

@Controller('analytics')
export class FleetOperationalController {
  constructor(private readonly fleetOperationalService: FleetOperationalService) {}

  @Get('fleet-availability-rate')
  async getFleetAvailabilityRate() {
    return this.fleetOperationalService.getFleetAvailabilityRate();
  }

  @Get('charging-vs-in-use')
  async getChargingVsInUse() {
    return this.fleetOperationalService.getChargingVsInUse();
  }
}
