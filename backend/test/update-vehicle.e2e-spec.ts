import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UpdateVehicleService } from '../src/services/vehicle-management/update-vehicle/update-vehicle.service';
import { AppModule } from '../src/app.module';
import { VehicleStatus, VehicleType } from '../src/entities/vehicle.entity';
import { UpdateVehicleDto } from '../src/dtos/update-vehicle.dto';

describe('UpdateVehicle (e2e)', () => {
  let app: INestApplication;
  let updateVehicleService: UpdateVehicleService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UpdateVehicleService)
      .useValue({
        update: jest.fn().mockImplementation((id, dto) => ({
          id,
          ...dto,
        })),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    updateVehicleService = moduleFixture.get<UpdateVehicleService>(UpdateVehicleService);
  });

  afterAll(async () => {
    await app.close();
  });

  const vehicleId = '123';
  const updateVehicleDto: UpdateVehicleDto = {
    model: 'Tesla Model X',
    type: VehicleType.BEV,
    battery_capacity_kwh: 100,
    current_charge_level: 95,
    emission_gco2_km: 0,
    brand: 'Tesla',
    status: VehicleStatus.in_use,
    avg_energy_consumption: 20,
  };

  it('should update a vehicle with valid data (PUT /vehicles/:id)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/vehicles/${vehicleId}`)
      .send(updateVehicleDto)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: vehicleId,
        model: updateVehicleDto.model,
        type: updateVehicleDto.type,
        battery_capacity_kwh: updateVehicleDto.battery_capacity_kwh,
        current_charge_level: updateVehicleDto.current_charge_level,
        status: updateVehicleDto.status,
      }),
    );
  });

  it('should return 400 for invalid update data (PUT /vehicles/:id)', async () => {
    const invalidUpdateDto = {
      model: '',
      battery_capacity_kwh: -50,
      current_charge_level: 110,
      status: 'invalid_status',
    };

    await request(app.getHttpServer())
      .put(`/vehicles/${vehicleId}`)
      .send(invalidUpdateDto)
      .expect(400);
  });

  it('should return 404 if the vehicle does not exist (PUT /vehicles/:id)', async () => {
    jest.spyOn(updateVehicleService, 'update').mockRejectedValueOnce({
      statusCode: 404,
      message: 'Vehicle not found',
    });

    const response = await request(app.getHttpServer())
      .put(`/vehicles/nonexistent_id`)
      .send(updateVehicleDto)
      .expect(404);

    expect(response.body).toEqual(
      expect.objectContaining({
        statusCode: 404,
        message: 'Vehicle not found',
      }),
    );
  });
});
