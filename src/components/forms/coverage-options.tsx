import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface CoverageOptions {
  type: "third-party-only" | "third-party-fire-theft" | "comprehensive" | "road-traffic-act-only";
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
  const [coverageData, setCoverageData] = useState({
    type: data.type || "third-party-only",
  })

  const handleRadioChange = (value: string) => {
    const updatedData = {
      ...coverageData,
      type: value as "third-party-only" | "third-party-fire-theft" | "comprehensive",
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
      <h2 className="text-2xl font-semibold">3. Select Coverage Options</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Coverage Type</Label>
          <RadioGroup
            value={coverageData.type}
            onValueChange={handleRadioChange}
            className="grid gap-4 md:grid-cols-1 lg:grid-cols-3"
          >
            <Card className="flex flex-col items-start rounded-md border p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="third-party-only" id="coverage-third-party-only" />
                <Label htmlFor="coverage-third-party-only" className="text-lg font-medium">
                  Third Party Only
                </Label>
              </div>
              <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Minimum Legal Requirement</div>
              <p className="text-sm text-muted-foreground">
                Basic protection covering accidents causing injury or death to others only. This is the minimum legal
                requirement in Zambia.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Third-party bodily injury coverage</li>
                <li>• Third-party property damage</li>
                <li>• Legal liability protection</li>
                <li>• No own vehicle damage coverage</li>
              </ul>
            </Card>

            <Card className="flex flex-col items-start rounded-md border p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="third-party-fire-theft" id="coverage-third-party-fire-theft" />
                <Label htmlFor="coverage-third-party-fire-theft" className="text-lg font-medium">
                  Third Party Fire & Theft
                </Label>
              </div>
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Enhanced Protection</div>
              <p className="text-sm text-muted-foreground">
                Includes all Third Party Only benefits plus protection against vehicle fire and theft.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• All Third Party Only benefits</li>
                <li>• Fire damage to your vehicle</li>
                <li>• Theft protection</li>
                <li>• Vandalism coverage</li>
                <li>• Attempted theft damage</li>
              </ul>
            </Card>

            <Card className="flex flex-col items-start rounded-md border p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comprehensive" id="coverage-comprehensive" />
                <Label htmlFor="coverage-comprehensive" className="text-lg font-medium">
                  Comprehensive
                </Label>
              </div>
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Complete Protection</div>
              <p className="text-sm text-muted-foreground">
                Complete protection including own-vehicle damage, theft, fire, plus third-party liability. Eligible for
                No-Claim Discount.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• All Third Party Fire & Theft benefits</li>
                <li>• Own vehicle accident damage</li>
                <li>• Collision coverage</li>
                <li>• Weather damage protection</li>
                <li>• Windscreen replacement</li>
                <li>• No-Claim Discount eligible</li>
              </ul>
            </Card>

            <Card className="flex flex-col items-start rounded-md border p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="road-traffic-act-only" id="coverage-road-traffic-act-only" />
                <Label htmlFor="coverage-road-traffic-act-only" className="text-lg font-medium text-green-700">
                  Road Traffic Act Only
                </Label>
              </div>
              <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-semibold">Statutory Minimum</div>
              <p className="text-sm text-muted-foreground">
                This policy covers liability for Third Party Personal Injuries or Death. For any vehicle, this is the minimum cover required by the Road Traffic Act.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Third-party bodily injury or death</li>
                <li>• Meets legal requirements for public roads</li>
                <li>• No own vehicle or property damage coverage</li>
              </ul>
            </Card>
          </RadioGroup>
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
