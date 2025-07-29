import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { VEHICLE_MAKES } from "@/lib/vehicles";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { vehicleValidation } from "@/lib/validation";
import { cleanSumInsured, formatSumInsured } from "@/lib/utils";

export interface VehicleDetails {
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

const currentYear = new Date().getFullYear();




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
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "sumInsured") {
      const cleanedValue = cleanSumInsured(value)
      const updatedData = { ...vehicleData, [id]: cleanedValue }
      setVehicleData(updatedData)
      if (onUpdate) {
        onUpdate({ vehicle: updatedData })
      }
    } else {
      const updatedData = { ...vehicleData, [id]: value }
      setVehicleData(updatedData)
      if (onUpdate) {
        onUpdate({ vehicle: updatedData })
      }
    }
    setErrors((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    const updatedData = { ...vehicleData, [field]: value };
    setVehicleData(updatedData);
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
    if (onUpdate) {
      onUpdate({ vehicle: updatedData });
    }
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    const updatedData = { ...vehicleData, isNewImport: checked };
    if (checked) {
      setErrors((prev) => {
        const { plateNumber, ...rest } = prev;
        return rest;
      });
    }
    setVehicleData(updatedData);
    if (onUpdate) {
      onUpdate({ vehicle: updatedData });
    }
    setErrors((prev) => {
      const { plateNumber, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = vehicleValidation(vehicleData, currentYear);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onNext({ vehicle: vehicleData });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold">Vehicle Details</h2>

      <div className="flex items-center space-x-2 p-4 rounded-lg border border-primary/20">
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
          {errors.make && <p className="text-xs text-destructive">{errors.make}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" value={vehicleData.model} onChange={handleChange} required />
          {errors.model && <p className="text-xs text-destructive">{errors.model}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="text"
            value={vehicleData.year}
            onChange={handleChange}
            required
            min="1900"
            max={currentYear.toString()}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
          />
          {errors.year && <p className="text-xs text-destructive">{errors.year}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="plateNumber">
            Plate Number
            {vehicleData.isNewImport && <span className="text-muted-foreground"> - Optional for new imports</span>}
          </Label>
          <Input
            id="plateNumber"
            value={vehicleData.plateNumber}
            onChange={handleChange}
            required={!vehicleData.isNewImport}
            disabled={vehicleData.isNewImport}
            placeholder={vehicleData.isNewImport ? "Will be updated after registration" : "e.g. ABC1234"}
            maxLength={10}
          />
          {errors.plateNumber && <p className="text-xs text-destructive">{errors.plateNumber}</p>}

        </div>
        <div className="space-y-2">
          <Label htmlFor="chassisNumber">Chassis Number (no special characters)</Label>
          <Input id="chassisNumber" value={vehicleData.chassisNumber} onChange={handleChange} required maxLength={17} />
          {errors.chassisNumber && <p className="text-xs text-destructive">{errors.chassisNumber}</p>}
          <p className="text-xs text-muted-foreground">Found on vehicle registration book or vehicle body</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="engineNumber">Engine Number (no special characters)</Label>
          <Input id="engineNumber" value={vehicleData.engineNumber} onChange={handleChange} required maxLength={17} />
          {errors.engineNumber && <p className="text-xs text-destructive">{errors.engineNumber}</p>}
          <p className="text-xs text-muted-foreground">Found on vehicle registration book or engine block</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sumInsured">Sum Insured (ZMW)</Label>
          <Input
            id="sumInsured"
            type="text"
            value={formatSumInsured(vehicleData.sumInsured)}
            onChange={handleChange}
            required
            placeholder="e.g. 150000"
          />
          {errors.sumInsured && <p className="text-xs text-destructive">{errors.sumInsured}</p>}
          <p className="text-xs text-muted-foreground">Current market value of your vehicle</p>
        </div>
      </div>

      {vehicleData.isNewImport && (
        <div className="p-4 bg-secondary/30 border border-secondary/20 rounded-lg">
          <h3 className="font-medium text-secondary-foreground mb-2">New Import Vehicle Notice</h3>
          <ul className="text-sm text-secondary-foreground space-y-1">
            <li>• Temporary cover will be issued using chassis and engine numbers</li>
            <li>• You must update your policy with the plate number once registered with RTSA</li>
            <li>• Policy will be suspended if registration is not completed within 30 days</li>
          </ul>
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} className="min-w-34">
          Back
        </Button>
        <Button type="submit" disabled={!vehicleData.make} className="min-w-34">
          Next
        </Button>
      </div>
    </form>
  );
};

export default VehicleDetails;
