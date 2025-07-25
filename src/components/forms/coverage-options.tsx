import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { COVERAGE_OPTIONS } from "@/lib/coverage-options"; // <-- import the data
import { CheckCircle } from "lucide-react";

interface CoverageOptions {
  type: "third-party-only" | "third-party-fire-theft" | "comprehensive" | "road-traffic-act-only" | "";
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
        data.type === "comprehensive" ||
        data.type === "road-traffic-act-only"
        ? data.type
        : "",
  })

  const handleCardSelect = (value: string) => {
    const updatedData = {
      ...coverageData,
      type: value as CoverageOptions["type"],
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
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default CoverageOptions;
