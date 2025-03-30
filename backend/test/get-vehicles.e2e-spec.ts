import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GetVehiclesService } from '../src/services/vehicle-management/get-vehicles/get-vehicles.service';
import { AppModule } from '../src/app.module';
import { VehicleStatus, VehicleType } from '../src/entities/vehicle.entity';

describe('GetVehicleById (e2e)', () => {
  let app: INestApplication;
  let getVehiclesService: GetVehiclesService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GetVehiclesService)
      .useValue({
        findById: jest.fn().mockResolvedValue({
          id: '123',
          model: 'Tesla Model S',
          type: VehicleType.BEV,
          battery_capacity_kwh: 85,
          current_charge_level: 80,
          emission_gco2_km: 0,
          brand: 'Tesla',
          status: VehicleStatus.available,
          last_updated: new Date(),
          avg_energy_consumption: 0,
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    getVehiclesService = moduleFixture.get<GetVehiclesService>(GetVehiclesService);
  });

  afterAll(async () => {
    await app.close();
  });

  const vehicleId = '123';

  it('should return a vehicle by ID (GET /vehicles/:id)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/vehicles/${vehicleId}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: vehicleId,
        model: 'Tesla Model S',
        type: VehicleType.BEV,
        battery_capacity_kwh: 85,
        current_charge_level: 80,
        status: VehicleStatus.available,
      }),
    );
  });

  it('should return 404 if the vehicle does not exist (GET /vehicles/:id)', async () => {
    jest.spyOn(getVehiclesService, 'findById').mockRejectedValueOnce({
      statusCode: 404,
      message: 'Vehicle not found',
    });

    const response = await request(app.getHttpServer())
      .get(`/vehicles/nonexistent_id`)
      .expect(404);

    expect(response.body).toEqual(
      expect.objectContaining({
        statusCode: 404,
        message: 'Vehicle not found',
      }),
    );
  });
});
