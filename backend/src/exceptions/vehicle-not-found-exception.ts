import { NotFoundException } from '@nestjs/common';

export class VehicleNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Vehicle with id ${id} not found.`);
  }
}
