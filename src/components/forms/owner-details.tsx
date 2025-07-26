import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ownerValidation } from "@/lib/validation";

export interface OwnerDetails {
  age: string
  licenseYears: string
  claims: "yes" | "no"
  claimFreeYears: string
  previousClaims: string
}

interface OwnerDetailsFormProps {
  data: OwnerDetails;
  onNext: (data: { owner: OwnerDetails }) => void;
  onBack: () => void;
  onUpdate?: (data: { owner: OwnerDetails }) => void
}

const OwnerDetails = ({ data, onNext, onBack, onUpdate }: OwnerDetailsFormProps) => {
  const [ownerData, setOwnerData] = useState({
    age: data.age || "",
    licenseYears: data.licenseYears || "",
    claims: data.claims || "no",
    claimFreeYears: data.claimFreeYears || "0",
    previousClaims: data.previousClaims || "0",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    const updatedData = { ...ownerData, [id]: value }
    setOwnerData(updatedData)
    if (onUpdate) {
      onUpdate({ owner: updatedData })
    }
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    })
  }

  const handleRadioChange = (value: string) => {
    const updatedData = { ...ownerData, claims: value as "yes" | "no" }
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.previousClaims;
      return newErrors;
    })
    if (onUpdate) {
      onUpdate({ owner: updatedData })
    }
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.previousClaims;
      return newErrors;
    })
  }

  const handleSelectChange = (field: string, value: string) => {
    const updatedData = { ...ownerData, [field]: value }
    setOwnerData(updatedData)
    if (onUpdate) {
      onUpdate({ owner: updatedData })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = ownerValidation(ownerData)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length === 0) {
      onNext({ owner: ownerData })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold">Owner/Driver Details</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="text" value={ownerData.age} onChange={handleChange} required min="16" max="100" maxLength={2} />
          {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="licenseYears">Years with License</Label>
          <Input
            id="licenseYears"
            type="text"
            value={ownerData.licenseYears}
            onChange={handleChange}
            required
            min="0"
            maxLength={2}
          />
          {errors.licenseYears && <p className="text-xs text-destructive">{errors.licenseYears}</p>}
        </div>
      </div>

      <div className="space-y-6 ">
        <div className="space-y-2">
          <Label>Any Claims in the Last 3 Years?</Label>
          <RadioGroup value={ownerData.claims} onValueChange={handleRadioChange} className="flex space-x-4">
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

        {ownerData.claims === "no" && (
          <div className="space-y-2">
            <Label>Consecutive Claim-Free Years</Label>
            <Select
              value={ownerData.claimFreeYears}
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

        {ownerData.claims === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="previousClaims">Number of Claims (Last 3 Years)</Label>
            <Input
              id="previousClaims"
              type="number"
              value={ownerData.previousClaims}
              onChange={handleChange}
              min="1"
              max="10"
            />
            {errors.previousClaims && <p className="text-xs text-destructive">{errors.previousClaims}</p>}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} className="min-w-34">
          Back
        </Button>
        <Button type="submit" className="min-w-34">Next</Button>
      </div>
    </form>
  );
};

export default OwnerDetails;
