import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { VEHICLE_MAKES } from "@/lib/vehicles";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";

interface VehicleDetails {
  make: string
  model: string
  year: string
  chassisNumber: string
  plateNumber: string
  engineNumber: string
  sumInsured: string
  isNewImport: boolean
}

interface VehicleDetailsFormProps {
  data: VehicleDetails
  onNext: (data: { vehicle: VehicleDetails }) => void
  onBack: () => void
  onUpdate?: (data: { vehicle: VehicleDetails }) => void
}

const VehicleDetails = ({ data, onNext, onBack, onUpdate }: VehicleDetailsFormProps) => {
  const [vehicleData, setVehicleData] = useState({
    make: data.make || "",
    model: data.model || "",
    year: data.year || "",
    chassisNumber: data.chassisNumber || "",
    plateNumber: data.plateNumber || "",
    engineNumber: data.engineNumber || "",
    sumInsured: data.sumInsured || "",
    isNewImport: data.isNewImport || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    const updatedData = { ...vehicleData, [id]: value }
    setVehicleData(updatedData)
    if (onUpdate) {
      onUpdate({ vehicle: updatedData })
    }
  }

  const handleSelectChange = (field: string, value: string) => {
    const updatedData = { ...vehicleData, [field]: value }
    setVehicleData(updatedData)
    if (onUpdate) {
      onUpdate({ vehicle: updatedData })
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    const updatedData = { ...vehicleData, isNewImport: checked }
    // Clear plate number if it's a new import
    if (checked) {
      updatedData.plateNumber = ""
    }
    setVehicleData(updatedData)
    if (onUpdate) {
      onUpdate({ vehicle: updatedData })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ vehicle: vehicleData })
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold">1. Vehicle Details</h2>

      <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Checkbox id="isNewImport" checked={vehicleData.isNewImport} onCheckedChange={handleCheckboxChange} />
        <Label htmlFor="isNewImport" className="text-sm font-medium">
          This is a newly imported vehicle (not yet registered with RTSA)
        </Label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Make</Label>
          <Select value={vehicleData.make} onValueChange={(value) => handleSelectChange("make", value)} >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select vehicle make" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {VEHICLE_MAKES.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.make}>
                  {vehicle.make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" value={vehicleData.model} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={vehicleData.year}
            onChange={handleChange}
            required
            min="1900"
            max={new Date().getFullYear().toString()}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plateNumber">
            Plate Number (Registration Number)
            {vehicleData.isNewImport && <span className="text-muted-foreground"> - Optional for new imports</span>}
          </Label>
          <Input
            id="plateNumber"
            value={vehicleData.plateNumber}
            onChange={handleChange}
            required={!vehicleData.isNewImport}
            disabled={vehicleData.isNewImport}
            placeholder={vehicleData.isNewImport ? "Will be updated after registration" : "e.g. ABC1234"}
            maxLength={7}
          />
          {!vehicleData.isNewImport && (
            <p className="text-xs text-muted-foreground">Required for policy issuance and road tax certificate</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="chassisNumber">Chassis Number</Label>
          <Input id="chassisNumber" value={vehicleData.chassisNumber} onChange={handleChange} required maxLength={17} />
          <p className="text-xs text-muted-foreground">Found on vehicle registration book or vehicle body</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="engineNumber">Engine Number</Label>
          <Input id="engineNumber" value={vehicleData.engineNumber} onChange={handleChange} required maxLength={17} />
          <p className="text-xs text-muted-foreground">Found on vehicle registration book or engine block</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sumInsured">Sum Insured (ZMW)</Label>
          <Input
            id="sumInsured"
            type="number"
            value={vehicleData.sumInsured}
            onChange={handleChange}
            required
            min="1000"
            placeholder="e.g. 150000"
          />
          <p className="text-xs text-muted-foreground">Current market value of your vehicle</p>
        </div>

      </div>

      {vehicleData.isNewImport && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-medium text-amber-800 mb-2">New Import Vehicle Notice</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Temporary cover will be issued using chassis and engine numbers</li>
            <li>• You must update your policy with the plate number once registered with RTSA</li>
            <li>• Road tax certificate cannot be obtained without valid registration</li>
            <li>• Policy will be suspended if registration is not completed within 30 days</li>
          </ul>
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={!vehicleData.make}>
          Next
        </Button>
      </div>
    </form>
  );
};

export default VehicleDetails;
