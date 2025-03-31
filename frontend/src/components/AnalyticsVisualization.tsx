import { useAverageEnergyConsumptionRate, useEmissionsComparison } from "@/api/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Bar, BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";
import { useRef, useState, useEffect } from "react";
import { ChartContainer } from "@/components/ui/chart";

const AnalyticsVisualization = () => {
  const { data: energyConsumption, isLoading: loadingEnergyConsumption } = useAverageEnergyConsumptionRate();
  const { data: emissionsComparison, isLoading: loadingEmissionsComparison } = useEmissionsComparison();

  const chartRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (chartRef.current) {
      const { offsetWidth, offsetHeight } = chartRef.current;
      setChartDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  if (loadingEnergyConsumption || loadingEmissionsComparison) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  const energyConsumptionData = energyConsumption?.map(item => ({
    model: item.model,
    consumption: item.vehicles_avg_energy_consumption,
  })) || [];

  const emissionsData = emissionsComparison?.map(item => ({
    type: item.type,
    emissions: item.vehicles_avg_emissions,
  })) || [];

  console.log('Energy Consumption Data:', energyConsumptionData);
  console.log('Emissions Data:', emissionsData);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-5xl font-bold">Analytics Visualization</h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-12">

        <Card className="w-full lg:w-[1200px] h-[700px] overflow-hidden" ref={chartRef}>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Average Energy Consumption</CardTitle>
            <CardDescription className="text-xl">Energy consumption of vehicles in kWh/100km</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                light: { color: "#007bff" },
                dark: { color: "#00f" },
              }}
            >
              <BarChart
                data={energyConsumptionData}
                width={chartDimensions.width}
                height={chartDimensions.height}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="consumption" fill="var(--color-primary)">
                  <LabelList dataKey="consumption" position="top" />
                </Bar>
                <Legend
                  layout="vertical"
                  verticalAlign="top"
                  formatter={(value, entry) => {
                    if (entry.payload && 'model' in entry.payload && 'consumption' in entry.payload) {
                      const { model, consumption } = entry.payload as { model: string; consumption: number };
                      return `${model}: ${consumption} kWh`;
                    }
                    return '';
                  }}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="w-full lg:w-[1200px] h-[700px] overflow-hidden" ref={chartRef}>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Emissions Comparison</CardTitle>
            <CardDescription className="text-xl">Emissions comparison by vehicle type in Grams of CO2 per kilometer</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                light: { color: "#007bff" },
                dark: { color: "#00f" },
              }}
            >
              <BarChart
                data={emissionsData}
                width={chartDimensions.width}
                height={chartDimensions.height}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="emissions" fill="var(--color-primary)">
                  <LabelList dataKey="emissions" position="top" />
                </Bar>
                <Legend
                  layout="vertical"
                  verticalAlign="top"
                  formatter={(value, entry) => {
                    if (entry.payload && 'type' in entry.payload && 'emissions' in entry.payload) {
                      const { type, emissions } = entry.payload as { type: string; emissions: number };
                      return `${type}: ${emissions} gCO2/km`;
                    }
                    return '';
                  }}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsVisualization;
