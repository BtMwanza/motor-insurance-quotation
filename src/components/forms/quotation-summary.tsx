import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import type { QuotationFormData } from "@/App";
import { Badge } from "../ui/badge";

interface QuotationSummaryProps {
  formData: QuotationFormData;
  onBack: () => void;
  handleExportImage: () => Promise<void>
}

const QuotationSummary = ({
  formData,
  onBack,
  handleExportImage,
}: QuotationSummaryProps) => {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">Review Your Information</h2>


      <Card>
        <CardHeader>
          <CardTitle>Vehicle Type</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <p>
            <strong>Type:</strong>{" "}
            {formData.vehicleType.type
              .replace(/-/g, " ")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Vehicle Details
            {formData.vehicle.isNewImport && (
              <Badge variant="secondary" className="text-xs">
                New Import
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <p>
            <strong>Make:</strong> {formData.vehicle.make}
          </p>
          <p>
            <strong>Model:</strong> {formData.vehicle.model}
          </p>
          <p>
            <strong>Year:</strong> {formData.vehicle.year}
          </p>
          <p>
            <strong>Plate Number:</strong> {formData.vehicle.plateNumber || "Pending Registration"}
          </p>
          <p>
            <strong>Chassis Number:</strong> {formData.vehicle.chassisNumber}
          </p>
          <p>
            <strong>Engine Number:</strong> {formData.vehicle.engineNumber}
          </p>
          <p>
            <strong>Sum Insured:</strong> ZMW {Number.parseInt(formData.vehicle.sumInsured || "0").toLocaleString()}
          </p>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Owner's Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <p>
            <strong>Age:</strong> {formData.owner.age}
          </p>
          <p>
            <strong>Years with License:</strong> {formData.owner.licenseYears}
          </p>
          <p>
            <strong>Claims in Last 3 Years:</strong> {formData.owner.claims === "yes" ? "Yes" : "No"}
          </p>
          {formData.owner.claims === "no" && formData.coverage.type === "comprehensive" && (
            <p>
              <strong>Claim-Free Years:</strong> {formData.owner.claimFreeYears}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coverage Options</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <p>
            <strong>Type:</strong>{" "}
            {formData.coverage.type
              .replace(/-/g, " ")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </p>
        </CardContent>
      </Card>


      <div className="flex items-center justify-between gap-2">

        <Button variant="outline" onClick={onBack} className="min-w-34">
          Back
        </Button>
        <Button onClick={handleExportImage} className="min-w-34">Download Quote</Button>
      </div>
    </div>
  );
};

export default QuotationSummary;
