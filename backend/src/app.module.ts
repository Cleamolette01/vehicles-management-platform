import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VersionEntity } from './entities/version.entity';
import { Keyv, createKeyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { CacheModule } from '@nestjs/cache-manager';
import { SeedDatabaseService } from './services/seed-database.service';
import { VehicleEntity } from './entities/vehicle.entity';
import { GetVehiclesController } from './controllers/get-vehicles/get-vehicles.controller';
import { GetVehiclesService } from './services/get-vehicles.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([VersionEntity, VehicleEntity]),
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            new Keyv({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
              store: new CacheableMemory({ lruSize: 5000 }),
            }),
            createKeyv('redis://localhost:6379'),
          ],
        };
      },
    }),
  ],
  controllers: [AppController, GetVehiclesController],
  providers: [AppService, SeedDatabaseService, GetVehiclesService],
})
export class AppModule {}
