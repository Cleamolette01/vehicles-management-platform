import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type FleetComposition = {
  type: string;
  count: number;
};

const fetchFleetComposition = async (): Promise<FleetComposition[]> => {
  const response = await axios.get('http://localhost:3000/analytics/fleet-composition');
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
  const response = await axios.get('http://localhost:3000/analytics/charging-vs-in-use');
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
  const response = await axios.get('http://localhost:3000/analytics/fleet-availability-rate');
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
  const response = await axios.get('http://localhost:3000/analytics/average-energy-consumption-rate');
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
  const response = await axios.get('http://localhost:3000/analytics/emissions-comparison');
  return response.data;
};

export function useEmissionsComparison() {
  return useQuery<EmissionsComparison[], Error>({
    queryKey: ['emissionsComparison'],
    queryFn: fetchEmissionsComparison,
  });
}

