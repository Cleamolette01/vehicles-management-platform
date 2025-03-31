import { useFleetComposition, useChargingVsInUse, useFleetAvailabilityRate } from "@/api/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const DashboardOverview = () => {
  const { data: fleetComposition, isLoading: loadingFleetComposition } = useFleetComposition();
  const { data: chargingVsInUse, isLoading: loadingChargingVsInUse } = useChargingVsInUse();
  const { data: fleetAvailabilityRate, isLoading: loadingFleetAvailabilityRate } = useFleetAvailabilityRate();

  if (loadingFleetComposition || loadingChargingVsInUse || loadingFleetAvailabilityRate) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Composition</CardTitle>
            <CardDescription>Overview of vehicle types and their counts.</CardDescription>
          </CardHeader>
          <CardContent>
            {fleetComposition?.map((item) => (
              <div key={item.type} className="mb-4">
                <strong>{item.type}</strong>: {item.count} vehicles
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Charging vs In Use</CardTitle>
            <CardDescription>Charging vs. In-Use vehicle count.</CardDescription>
          </CardHeader>
          <CardContent>
            <div>Charging: {chargingVsInUse?.chargingCount}</div>
            <div>In Use: {chargingVsInUse?.inUseCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fleet Availability Rate</CardTitle>
            <CardDescription>Availability rate of the fleet.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-lg font-semibold">
              {fleetAvailabilityRate?.availabilityRate}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
