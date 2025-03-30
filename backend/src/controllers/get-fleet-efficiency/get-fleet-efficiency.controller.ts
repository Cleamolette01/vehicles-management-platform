import { Controller, Get } from '@nestjs/common';
import { FleetEfficiencyService } from 'src/services/analytics/fleet-efficiency.service';

@Controller('analytics')
export class FleetEfficiencyController {
  constructor(private readonly fleetEfficiencyService: FleetEfficiencyService) {}

  @Get('average-energy-consumption-rate')
  async getAverageEnergyConsumptionRate() {
    return this.fleetEfficiencyService.getAverageEnergyConsumptionRate();
  }

  @Get('emissions-comparison')
  async getEmissionsComparison() {
    return this.fleetEfficiencyService.getEmissionsComparison();
}

}
