import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { COVERAGE_OPTIONS, COVERAGE_PERIOD_OPTIONS } from "@/lib/coverage-options"; // <-- import the data
import { CheckCircle } from "lucide-react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface CoverageOptions {
  type: "third-party-only" | "third-party-fire-theft" | "comprehensive" | "";
  period: "quarterly" | "semi-annual" | "three-quarters" | "annual" | "";
}

interface CoverageOptionsFormProps {
  data: CoverageOptions;
  onNext: (data: { coverage: CoverageOptions }) => void;
  onBack: () => void;
  onUpdate?: (data: { coverage: CoverageOptions }) => void
}

const CoverageOptions = ({
  data,
  onNext,
  onBack,
  onUpdate,
}: CoverageOptionsFormProps) => {
  const [coverageData, setCoverageData] = useState<CoverageOptions>({
    type:
      data.type === "third-party-only" ||
        data.type === "third-party-fire-theft" ||
        data.type === "comprehensive"
        ? data.type
        : "",

    period: data.period || "",
  })

  const handleCardSelect = (value: string) => {
    // Toggle selection
    const updatedData = {
      ...coverageData,
      type: coverageData.type === value ? "" : (value as CoverageOptions["type"]),
    }
    setCoverageData(updatedData)
    if (onUpdate) {
      onUpdate({ coverage: updatedData })
    }
  }

  const handlePaymentPeriodChange = (value: string) => {
    // Toggle selection
    const updatedData = {
      ...coverageData,
      period: coverageData.period === value ? "" : (value as CoverageOptions["period"]),
    }
    setCoverageData(updatedData)
    if (onUpdate) {
      onUpdate({ coverage: updatedData })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ coverage: coverageData })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold">Select Coverage Options</h2>
      <div className="space-y-2">

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
          {COVERAGE_OPTIONS.map(option => (
            <Card
              key={option.value}
              className={`flex flex-col items-start rounded-md border p-4 relative cursor-pointer transition
                  ${coverageData.type === option.value ? "border-primary ring-2 ring-primary" : "hover:border-primary/60"}
                `}
              tabIndex={0}
              role="button"
              aria-pressed={coverageData.type === option.value}
              onClick={() => handleCardSelect(option.value)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") handleCardSelect(option.value)
              }}
            >
              {coverageData.type === option.value && <CheckCircle className="absolute top-2 right-2 size-4 text-primary" />}
              <div className="items-center">
                {option.title}
              </div>
              <div className={option.badgeClass}>{option.badge}</div>
              <p className="text-sm text-muted-foreground">{option.description}</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {option.bullets.map((b, i) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>
            </Card>
          ))}

        </div>
      </div>

      <div className="space-y-4 mt-6">
        <div className="space-y-2">
          <Label>Payment Period</Label>
          <div className="grid gap-3 md:grid-cols-2">
            {COVERAGE_PERIOD_OPTIONS.map(option => (
              <Card
                key={option.value}
                className={cn("flex space-x-2 p-4 border rounded-lg cursor-pointer transition relative", coverageData.period === option.value ? "border-primary ring-2 ring-primary" : "hover:border-primary/60")}
                tabIndex={0}
                role="button"
                aria-pressed={coverageData.period === option.value}
                onClick={() => handlePaymentPeriodChange(option.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") handlePaymentPeriodChange(option.value)
                }}
              >
                {coverageData.period === option.value && (
                  <CheckCircle className="text-primary absolute top-2 right-2 size-4" size={20} />
                )}
                <div className="">
                  <Label className="font-medium">{option.label}</Label>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
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

export default CoverageOptions;
