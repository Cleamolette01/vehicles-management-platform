import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity, VehicleStatus, VehicleType } from '../entities/vehicle.entity';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';


@Injectable()
export class SeedDatabaseService implements OnModuleInit {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
  ) {}

  private async seedDatabase(): Promise<void> {
    const count = await this.vehicleRepository.count();
    if (count > 0) {
      console.log('✅ Database already seeded, skipping...');
      return;
    }

    const vehicles: VehicleEntity[] = [];
    const filePath = path.resolve(__dirname, '../../../data/cars.csv');
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let isFirstLine = true;
    for await (const line of rl) {
      if (isFirstLine) {
        isFirstLine = false;
        continue;
      }

      const [id, brand, model, battery_capacity_kwh, current_charge_level, status, last_updated, avg_energy_consumption, type, emission_gco2_km] = line.split(',');

      const vehicle = new VehicleEntity();
      vehicle.id = id;
      vehicle.brand = brand;
      vehicle.model = model;
      vehicle.battery_capacity_kwh = parseFloat(battery_capacity_kwh);
      vehicle.current_charge_level = parseInt(current_charge_level, 10);
      vehicle.status = VehicleStatus[status]
      vehicle.last_updated = new Date(last_updated);
      vehicle.avg_energy_consumption = parseFloat(avg_energy_consumption);
      vehicle.type = VehicleType[type];
      vehicle.emission_gco2_km = parseInt(emission_gco2_km, 10);

      vehicles.push(vehicle);
    }

    await this.vehicleRepository.upsert(vehicles, ['id']);
    console.log('✅ Database seeded successfully!');
  }

  async onModuleInit() {
    await this.seedDatabase();
  }
}
