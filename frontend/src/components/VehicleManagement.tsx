import { useState, useEffect } from "react";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { addVehicle, updateVehicle, Vehicle } from "@/api/api";


const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [statusFilter, setStatusFilter] = useState(""); //TODO: Implement status filter
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof Vehicle>("brand");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Partial<Vehicle>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, [statusFilter, typeFilter, sortKey, sortOrder, page]);

  const fetchVehicles = async () => {
    setIsLoading(true);
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: "10",
      status: statusFilter,
      type: typeFilter,
      sort: sortKey,
      sortOrder: sortOrder,
    });

    try {
      const response = await fetch(`/api/vehicles?${queryParams}`);
      const data = await response.json();
      setVehicles(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Failed to fetch vehicles.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column: keyof Vehicle) => {
    if (sortKey === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(column);
      setSortOrder("asc");
    }
  };

  const handleAddOrUpdateVehicle = async () => {
    if (
      !selectedVehicle.brand ||
      !selectedVehicle.model ||
      !selectedVehicle.battery_capacity_kwh ||
      !selectedVehicle.current_charge_level ||
      !selectedVehicle.status ||
      !selectedVehicle.type ||
      !selectedVehicle.avg_energy_consumption ||
      !selectedVehicle.emission_gco2_km ||
      !selectedVehicle.last_updated
    ) {
      toast.error("Error. Please fill all the fields.");
      return;
    }

    try {
      if (isEditMode) {
        await updateVehicle(selectedVehicle.id!, selectedVehicle);
      } else {
        await addVehicle(selectedVehicle);
      }

      setIsModalOpen(false);
      fetchVehicles();
      toast.success(isEditMode ? "Vehicle updated successfully" : "Vehicle added successfully");
    } catch (error) {
      toast.error("Error. Failed to update the vehicle");
    }

  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setIsEditMode(true);
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    typeFilter === "" || vehicle.type === typeFilter
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Vehicle Management</h1>
      <Button onClick={() => { setIsEditMode(false); setSelectedVehicle({}); setIsModalOpen(true); }}>
        + Add New Vehicle
      </Button>

      {isLoading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
          <div className="text-2xl font-semibold">Loading vehicles...</div>
        </div>
      ) : (
          <><div> <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}>
          <SelectTrigger>
            {typeFilter ? typeFilter : "Filter on vehicle type"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="BEV">BEV</SelectItem>
            <SelectItem value="ICE">ICE</SelectItem>
          </SelectContent>
        </Select>

        </div><Table>
              <thead>
                <TableRow>
                  {[
                    { key: "id", label: "ID" },
                    { key: "brand", label: "Brand" },
                    { key: "model", label: "Model" },
                    { key: "battery_capacity_kwh", label: "Battery Capacity (kWh)" },
                    { key: "current_charge_level", label: "Charge Level (%)" },
                    { key: "status", label: "Status" },
                    { key: "type", label: "Type" },
                    { key: "avg_energy_consumption", label: "Avg Energy Consumption (kWh/km)" },
                    { key: "emission_gco2_km", label: "CO2 Emission (gCO2/km)" },
                    { key: "last_updated", label: "Last Updated" },
                  ].map(({ key, label }) => (
                    <TableHead
                      key={key}
                      onClick={() => handleSort(key as keyof Vehicle)}
                      className="cursor-pointer"
                    >
                      {label}
                      {sortKey === key && (
                        sortOrder === "asc" ? (
                          <FaArrowUp className="w-4 h-4 inline ml-2" />
                        ) : (
                          <FaArrowDown className="w-4 h-4 inline ml-2" />
                        )
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} onClick={() => handleEditVehicle(vehicle)}>
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
            </Table></>

      )}

      <div className="flex justify-between mt-4">
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {[
              "brand",
              "model",
              "battery_capacity_kwh",
              "current_charge_level",
              "avg_energy_consumption",
              "emission_gco2_km",
            ].map((field) => (
              <Input
                key={field}
                placeholder={field.replace("_", " ")}
                type={field === "last_updated" ? "date" : "text"}
                onChange={(e) => setSelectedVehicle((prev) => ({ ...prev, [field]: e.target.value }))}
                value={selectedVehicle[field as keyof Partial<Vehicle>] || ""}
              />
            ))}

            <Select value={selectedVehicle.type || ""} onValueChange={(value) => setSelectedVehicle((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <Button>{selectedVehicle.type || "Select Type"}</Button>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEV">BEV</SelectItem>
                <SelectItem value="ICE">ICE</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedVehicle.status || ""} onValueChange={(value) => setSelectedVehicle((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <Button>{selectedVehicle.status || "Select Status"}</Button>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="charging">Charging</SelectItem>
                <SelectItem value="in_use">In Use</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            type="date"
            placeholder="Last updated"
            onChange={(e) => setSelectedVehicle((prev) => ({ ...prev, last_updated: e.target.value }))}
            value={selectedVehicle.last_updated || ""}
          />

          <Button onClick={handleAddOrUpdateVehicle}>
            {isEditMode ? "Update Vehicle" : "Add Vehicle"}
          </Button>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
};

export default VehicleManagement;
