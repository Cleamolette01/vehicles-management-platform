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
      <h1 className="text-4xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {/* Carte Fleet Composition */}
        <Card className="w-full lg:w-[600px] xl:w-[700px] h-[500px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Fleet Composition</CardTitle>
            <CardDescription className="text-xl">Overview of vehicle types and their counts.</CardDescription>
          </CardHeader>
          <CardContent>
            {fleetComposition?.map((item) => (
              <div key={item.type} className="mb-4 text-2xl">
                <strong className="text-3xl">{item.type}</strong>: <span className="text-4xl font-bold">{item.count}</span> vehicles
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Carte Charging vs In Use */}
        <Card className="w-full lg:w-[600px] xl:w-[700px] h-[500px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Charging vs In Use</CardTitle>
            <CardDescription className="text-xl">Charging vs. In-Use vehicle count.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-4">
              <strong className="text-3xl">Charging:</strong> <span className="text-4xl font-bold">{chargingVsInUse?.chargingCount}</span>
            </div>
            <div className="text-2xl">
              <strong className="text-3xl">In Use:</strong> <span className="text-4xl font-bold">{chargingVsInUse?.inUseCount}</span>
            </div>
          </CardContent>
        </Card>

        {/* Carte Fleet Availability Rate */}
        <Card className="w-full lg:w-[600px] xl:w-[700px] h-[500px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Fleet Availability Rate</CardTitle>
            <CardDescription className="text-xl">Availability rate of the fleet.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-4xl font-semibold">
              {fleetAvailabilityRate?.availabilityRate}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
