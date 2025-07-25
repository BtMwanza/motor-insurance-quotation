import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardTitle } from "../ui/card";

interface VehicleTypeSelectionProps {
  data: { type: "personal" | "commercial" | "taxi" | "" };
  onNext: (data: { vehicleType: { type: string } }) => void;
  onUpdate?: (data: { vehicleType: { type: string } }) => void;
}

const VehicleTypePicker = ({ data, onNext, onUpdate }: VehicleTypeSelectionProps) => {
  const [selectedType, setSelectedType] = useState(data.type || "");

  const vehicleTypes = [
    {
      id: "personal",
      name: "Personal",
    },
    {
      id: "taxi",
      name: "Taxi",
    },
    {
      id: "commercial",
      name: "Commercial",
    },
  ];

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
    if (onUpdate) {
      onUpdate({ vehicleType: { type: typeId } })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedType) {
      onNext({ vehicleType: { type: selectedType } })
    } else {
      alert("Please select a vehicle type.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-4xl font-bold text-center">Vehicle Type</h2>
      <p className="text-center text-lg text-muted-foreground">
        Please select the type of vehicle you would like insured by indicating
        with the options below.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vehicleTypes.map((type) => (
          <Card
            key={type.id}
            className={cn(
              "cursor-pointer overflow-hidden transition-all duration-200 flex items-center justify-center",
              selectedType === type.id
                ? "ring-2 ring-blue-500 ring-offset-2"
                : ""
            )}
            onClick={() => handleTypeSelect(type.id)}
          >
            <CardContent className={cn("p-4 text-foreground")}>
              <CardTitle className="text-md">{type.name}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={!selectedType}>
          Next
        </Button>
      </div>
    </form>
  );
};

export default VehicleTypePicker;
