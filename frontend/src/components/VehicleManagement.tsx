import { useState, useEffect } from "react";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Vehicle {
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

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("brand");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchVehicles();
  }, [statusFilter, typeFilter, sortKey, sortOrder, page]);

  const fetchVehicles = async () => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: "10",
      status: statusFilter,
      type: typeFilter,
      sort: sortKey,
      sortOrder: sortOrder,
    });

    const response = await fetch(`/api/vehicles?${queryParams}`);
    const data = await response.json();
    setVehicles(data.data);
    setTotalPages(data.totalPages);
  };

  const handleSort = (column: keyof Vehicle) => {
    if (sortKey === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(column);
      setSortOrder("asc");
    }
  };

  const sortedVehicles = [...vehicles].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Vehicle Management</h1>

      <Table>
        <thead>
          <TableRow>
            <TableHead onClick={() => handleSort("id")}>
              ID {sortKey === "id" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("brand")}>
              Brand {sortKey === "brand" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("model")}>
              Model {sortKey === "model" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("battery_capacity_kwh")}>
              Battery (kWh) {sortKey === "battery_capacity_kwh" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("current_charge_level")}>
              Charge Level (%) {sortKey === "current_charge_level" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("status")}>
              Status {sortKey === "status" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("type")}>
              Type {sortKey === "type" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("avg_energy_consumption")}>
              Avg Energy Consumption (kWh/km) {sortKey === "avg_energy_consumption" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("emission_gco2_km")}>
              CO2 Emission (gCO2/km) {sortKey === "emission_gco2_km" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("last_updated")}>
              Last Updated {sortKey === "last_updated" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
          </TableRow>
        </thead>
        <tbody>
          {sortedVehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>{vehicle.id}</TableCell>
              <TableCell>{vehicle.brand}</TableCell>
              <TableCell>{vehicle.model}</TableCell>
              <TableCell>{vehicle.battery_capacity_kwh}</TableCell>
              <TableCell>{vehicle.current_charge_level}</TableCell>
              <TableCell>{vehicle.status}</TableCell>
              <TableCell>{vehicle.type}</TableCell>
              <TableCell>{vehicle.avg_energy_consumption}</TableCell>
              <TableCell>{vehicle.emission_gco2_km}</TableCell>
              <TableCell>{vehicle.last_updated}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <div className="flex justify-between">
        <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default VehicleManagement;
