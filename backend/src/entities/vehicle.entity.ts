import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum VehicleStatus {
    available = 'available',
    charging = 'charging',
    in_use = 'in_use',
  }

  export enum VehicleType {
    BEV = 'BEV',
    ICE = 'ICE',
  }


@Entity()
export class VehicleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column('int')
  battery_capacity_kwh: number;

  @Column('float')
  current_charge_level: number;

  @Column({
    type: 'enum',
    enum: VehicleStatus,
  })
  status: VehicleStatus;

  @Column('timestamp')
  last_updated: Date;

  @Column('float')
  avg_energy_consumption: number;

  @Column({
    type: 'enum',
    enum: VehicleType,
  })
  type: VehicleType;

  @Column('float')
  emission_gco2_km: number;
}
