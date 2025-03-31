import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const ANALYTICS_API_URL = 'http://localhost:3000/analytics';
const VEHICLE_API_URL = 'http://localhost:3000/vehicles';




type FleetComposition = {
  type: string;
  count: number;
};

const fetchFleetComposition = async (): Promise<FleetComposition[]> => {
  const response = await axios.get(`${ANALYTICS_API_URL}/fleet-composition`);
  return response.data;
};


export function useFleetComposition() {
  return useQuery<FleetComposition[], Error>({
    queryKey: ['fleetComposition'],
    queryFn: fetchFleetComposition,
  });
}

type ChargingVsInUse = {
  chargingCount: number;
  inUseCount: number;
}

const fetchChargingVsInUse = async (): Promise<ChargingVsInUse> => {
  const response = await axios.get(`${ANALYTICS_API_URL}/charging-vs-in-use`);
  return response.data;
};

export function useChargingVsInUse() {
  return useQuery<ChargingVsInUse, Error>({
    queryKey: ['chargingVsInUse'],
    queryFn: fetchChargingVsInUse,
  });
}

type FleetAvailabilityRate = {
  availabilityRate: string;
}

const fetchFleetAvailabilityRate = async (): Promise<FleetAvailabilityRate> => {
  const response = await axios.get(`${ANALYTICS_API_URL}/fleet-availability-rate`);
  return response.data;
};

export function useFleetAvailabilityRate() {
  return useQuery<FleetAvailabilityRate, Error>({
    queryKey: ['fleetAvailabilityRate'],
    queryFn: fetchFleetAvailabilityRate,
  });
}

type EnergyConsumption = {
  model: string;
  vehicles_avg_energy_consumption: number;
}

const fetchAverageEnergyConsumptionRate = async (): Promise<EnergyConsumption[]> => {
  const response = await axios.get(`${ANALYTICS_API_URL}/average-energy-consumption-rate`);
  return response.data;
};

export function useAverageEnergyConsumptionRate() {
  return useQuery<EnergyConsumption[], Error>({
    queryKey: ['averageEnergyConsumptionRate'],
    queryFn: fetchAverageEnergyConsumptionRate,
  });
}

type EmissionsComparison = {
  type: string;
  vehicles_avg_emissions: number;
}

const fetchEmissionsComparison = async (): Promise<EmissionsComparison[]> => {
  const response = await axios.get(`${ANALYTICS_API_URL}/emissions-comparison`);
  return response.data;
};

export function useEmissionsComparison() {
  return useQuery<EmissionsComparison[], Error>({
    queryKey: ['emissionsComparison'],
    queryFn: fetchEmissionsComparison,
  });
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  battery_capacity_kwh: number;
  current_charge_level: number;
  status: string;
  last_updated: string;
  avg_energy_consumption: number;
  type: string;
  emission_gco2_km: number;
}


export const updateVehicle = async (vehicleId: string, vehicleData: Partial<Vehicle>) => {
  try {
    const response = await axios.put(`${VEHICLE_API_URL}/${vehicleId}`, vehicleData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update vehicle');
  }
};

export const addVehicle = async (vehicleData: Partial<Vehicle>) => {
  try {
    const response = await axios.post(`${VEHICLE_API_URL}`, vehicleData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to add vehicle');
  }
};

