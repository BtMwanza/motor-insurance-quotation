import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import type { QuotationFormData } from "@/App";
import { Badge } from "../ui/badge";

interface QuotationSummaryProps {
  formData: QuotationFormData;
  onBack: () => void;
}

const QuotationSummary = ({
  formData,
  onBack,
}: QuotationSummaryProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">4. Review Your Information</h2>

      <div className="grid grid-cols-2 gap-4">
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
              <strong>Age:</strong> {formData.driver.age}
            </p>
            <p>
              <strong>Years with License:</strong> {formData.driver.licenseYears}
            </p>
            <p>
              <strong>Claims in Last 3 Years:</strong> {formData.driver.claims === "yes" ? "Yes" : "No"}
            </p>
            {formData.driver.claims === "no" && formData.coverage.type === "comprehensive" && (
              <p>
                <strong>Claim-Free Years:</strong> {formData.driver.claimFreeYears}
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
              <strong>Coverage Type:</strong>{" "}
              {formData.coverage.type
                .replace(/-/g, " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-2">
        <Button>Proceed to Payment</Button>
        <Button variant="outline" onClick={onBack}>
          Back to Summary
        </Button>
      </div>
    </div>
  );
};

export default QuotationSummary;
