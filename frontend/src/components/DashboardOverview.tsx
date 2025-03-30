import { useAverageEnergyConsumptionRate, useChargingVsInUse, useEmissionsComparison, useFleetAvailabilityRate, useFleetComposition } from "@/api/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export const DashboardOverview = () => {
  const { data: fleetComposition, isLoading: loadingFleetComposition } = useFleetComposition();
  const { data: chargingVsInUse, isLoading: loadingChargingVsInUse } = useChargingVsInUse();
  const { data: fleetAvailabilityRate, isLoading: loadingFleetAvailabilityRate } = useFleetAvailabilityRate();
  const { data: energyConsumption, isLoading: loadingEnergyConsumption } = useAverageEnergyConsumptionRate();
  const { data: emissionsComparison, isLoading: loadingEmissionsComparison } = useEmissionsComparison();

  if (loadingFleetComposition || loadingChargingVsInUse || loadingFleetAvailabilityRate || loadingEnergyConsumption || loadingEmissionsComparison) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Fleet Composition Card */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Composition</CardTitle>
            <CardDescription>Overview of vehicle types and their counts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              {fleetComposition?.map((item) => (
                <div key={item.type} className="mb-4">
                  <strong>{item.type}</strong>: {item.count} vehicles
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charging vs In Use Card */}
        <Card>
          <CardHeader>
            <CardTitle>Charging vs In Use</CardTitle>
            <CardDescription>Charging vs. In-Use vehicle count.</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <div>Charging: {chargingVsInUse?.chargingCount}</div>
              <div>In Use: {chargingVsInUse?.inUseCount}</div>
            </div>
          </CardContent>
        </Card>

        {/* Fleet Availability Rate Card */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Availability Rate</CardTitle>
            <CardDescription>Availability rate of the fleet.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-lg font-semibold">
              {fleetAvailabilityRate?.availabilityRate} %
            </div>
          </CardContent>
        </Card>

        {/* Average Energy Consumption Card */}
        <Card>
          <CardHeader>
            <CardTitle>Average Energy Consumption</CardTitle>
            <CardDescription>Energy consumption of vehicles.</CardDescription>
          </CardHeader>
          <CardContent>
            {energyConsumption?.map((item) => (
              <div key={item.model} className="mb-4">
                <div className="font-semibold">{item.model}</div>
                <div>{item.vehicles_avg_energy_consumption} kWh</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Emissions Comparison Card */}
        <Card>
          <CardHeader>
            <CardTitle>Emissions Comparison</CardTitle>
            <CardDescription>Emissions comparison by vehicle type.</CardDescription>
          </CardHeader>
          <CardContent>
            {emissionsComparison?.map((item) => (
              <div key={item.type} className="mb-4">
                <div className="font-semibold">{item.type}</div>
                <div>{item.vehicles_avg_emissions} gCO2/km</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
