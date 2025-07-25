import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface OwnerDetails {
  age: string
  licenseYears: string
  claims: "yes" | "no"
  claimFreeYears: string
  previousClaims: string
}

interface OwnerDetailsFormProps {
  data: OwnerDetails;
  onNext: (data: { driver: OwnerDetails }) => void;
  onBack: () => void;
  onUpdate?: (data: { driver: OwnerDetails }) => void
}

const OwnerDetails = ({ data, onNext, onBack, onUpdate }: OwnerDetailsFormProps) => {
  const [driverData, setDriverData] = useState({
    age: data.age || "",
    licenseYears: data.licenseYears || "",
    claims: data.claims || "no",
    claimFreeYears: data.claimFreeYears || "0",
    previousClaims: data.previousClaims || "0",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    const updatedData = { ...driverData, [id]: value }
    setDriverData(updatedData)
    if (onUpdate) {
      onUpdate({ driver: updatedData })
    }
  }

  const handleRadioChange = (value: string) => {
    const updatedData = { ...driverData, claims: value as "yes" | "no" }
    setDriverData(updatedData)
    if (onUpdate) {
      onUpdate({ driver: updatedData })
    }
  }

  const handleSelectChange = (field: string, value: string) => {
    const updatedData = { ...driverData, [field]: value }
    setDriverData(updatedData)
    if (onUpdate) {
      onUpdate({ driver: updatedData })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ driver: driverData })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold">2. Driver Details</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" value={driverData.age} onChange={handleChange} required min="16" max="100" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="licenseYears">Years with License</Label>
          <Input
            id="licenseYears"
            type="number"
            value={driverData.licenseYears}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Any Claims in the Last 3 Years?</Label>
          <RadioGroup value={driverData.claims} onValueChange={handleRadioChange} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="claims-yes" />
              <Label htmlFor="claims-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="claims-no" />
              <Label htmlFor="claims-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {driverData.claims === "no" && (
          <div className="space-y-2">
            <Label>Consecutive Claim-Free Years</Label>
            <Select
              value={driverData.claimFreeYears}
              onValueChange={(value) => handleSelectChange("claimFreeYears", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select claim-free years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 years (New policy)</SelectItem>
                <SelectItem value="1">1 year (15% discount)</SelectItem>
                <SelectItem value="2">2 years (25% discount)</SelectItem>
                <SelectItem value="3">3 years (40% discount)</SelectItem>
                <SelectItem value="4">4 years (60% discount)</SelectItem>
                <SelectItem value="5">5+ years (65% discount)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">No-Claim Discount applies to own damage premium only</p>
          </div>
        )}

        {driverData.claims === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="previousClaims">Number of Claims (Last 3 Years)</Label>
            <Input
              id="previousClaims"
              type="number"
              value={driverData.previousClaims}
              onChange={handleChange}
              min="1"
              max="10"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default OwnerDetails;
