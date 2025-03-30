import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RemoveVehicleService } from '../src/services/vehicle-management/remove-vehicle/remove-vehicle.service';
import { AppModule } from '../src/app.module';

describe('RemoveVehicle (e2e)', () => {
  let app: INestApplication;
  let removeVehicleService: RemoveVehicleService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RemoveVehicleService)
      .useValue({
        delete: jest.fn().mockResolvedValue(undefined),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    removeVehicleService = moduleFixture.get<RemoveVehicleService>(RemoveVehicleService);
  });

  afterAll(async () => {
    await app.close();
  });

  const vehicleId = '123';

  it('should delete a vehicle successfully (DELETE /vehicles/:id)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/vehicles/${vehicleId}`)

    expect(response.body).toEqual({});
    expect(removeVehicleService.delete).toHaveBeenCalledWith(vehicleId);
  });

  it('should return 404 if the vehicle does not exist (DELETE /vehicles/:id)', async () => {
    jest.spyOn(removeVehicleService, 'delete').mockRejectedValueOnce({
      statusCode: 404,
      message: 'Vehicle not found',
    });

    const response = await request(app.getHttpServer())
      .delete(`/vehicles/nonexistent_id`)
      .expect(404);

    expect(response.body).toEqual(
      expect.objectContaining({
        statusCode: 404,
        message: 'Vehicle not found',
      }),
    );
  });
});
