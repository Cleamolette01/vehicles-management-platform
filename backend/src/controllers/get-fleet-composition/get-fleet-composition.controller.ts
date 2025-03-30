import { Controller, Get } from '@nestjs/common';
import { FleetCompositionService } from '../../services/analytics/fleet-composition/fleet-composition.service';

@Controller('analytics')
export class FleetCompositionController {
  constructor(private readonly fleetCompositionService: FleetCompositionService) {}

  @Get('fleet-composition')
  async getFleetComposition() {
    return this.fleetCompositionService.getFleetComposition();
  }

}
