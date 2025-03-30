import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AddVehicleService } from '../src/services/vehicle-management/add-vehicule/add-vehicule.service';
import { AppModule } from '../src/app.module';
import { VehicleStatus, VehicleType } from '../src/entities/vehicle.entity';
import { AddVehicleDto } from '../src/dtos/add-vehicule.dto';

  describe('AddVehicle (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(AddVehicleService)
        .useValue({
          addVehicule: jest.fn().mockResolvedValue({ id: '123', ...mockVehicleData }),
        })
        .compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(new ValidationPipe({ transform: true }));
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    const mockVehicleData: AddVehicleDto = {
      model: 'Tesla Model S',
      type: VehicleType.BEV,
      battery_capacity_kwh: 85,
      current_charge_level: 80,
      emission_gco2_km: 0,
      brand: 'Tesla',
      status: VehicleStatus.available,
      last_updated: new Date(),
      avg_energy_consumption: 0
    };

    it('should create a new vehicle with valid data (POST /vehicles)', async () => {

      const response = await request(app.getHttpServer())
        .post('/vehicles')
        .send(mockVehicleData)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          model: mockVehicleData.model,
          type: mockVehicleData.type,
          battery_capacity_kwh: mockVehicleData.battery_capacity_kwh,
          current_charge_level: mockVehicleData.current_charge_level,
          status: mockVehicleData.status,
        }),
      );
    });

    it('should return 400 for invalid data (POST /vehicles)', async () => {
      const invalidVehicleData = {
        model: '',
        type: 'electric',
        battery_capacity_kwh: -10,
        current_charge_level: -10,
        status: 'available',
      };

      await request(app.getHttpServer())
        .post('/vehicles')
        .send(invalidVehicleData)
        .expect(400);

    });
  });


