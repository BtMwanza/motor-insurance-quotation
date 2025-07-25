import { useState } from 'react'
import './App.css'
import { Card, CardContent } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import VehicleTypePicker from './components/forms/vehicle-type-picker';
import VehicleDetails from './components/forms/vehicle-details';
import OwnerDetails from './components/forms/owner-details';
import QuotationSummary from './components/forms/quotation-summary';
import Quotation from './components/forms/quatation';
import CoverageOptions from './components/forms/coverage-options';
import SideQuotation from './components/forms/side-quotation';

export interface QuotationFormData {
  vehicleType: { type: "personal" | "commercial" | "taxi" | "" }
  vehicle: {
    make: string
    model: string
    year: string
    chassisNumber: string
    plateNumber: string
    engineNumber: string
    sumInsured: string
    isNewImport: boolean
  }
  driver: { age: string; licenseYears: string; claims: "yes" | "no"; claimFreeYears: string; previousClaims: string }
  coverage: { type: "third-party-only" | "third-party-fire-theft" | "comprehensive" | "road-traffic-act-only" }
}

function App() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<QuotationFormData>({
    vehicleType: { type: "" },
    vehicle: {
      make: "",
      model: "",
      year: "",
      chassisNumber: "",
      plateNumber: "",
      engineNumber: "",
      sumInsured: "",
      isNewImport: false,
    },
    driver: {
      age: "",
      licenseYears: "",
      claims: "no",
      claimFreeYears: "0",
      previousClaims: "0",
    },
    coverage: { type: "third-party-only" },
  })

  const handleNext = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleFormUpdate = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const steps = ["Vehicle Type", "Vehicle Details", "Driver Details", "Coverage Options", "Summary"]

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <Tabs value={String(step)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
                  {steps.map((s, index) => (
                    <TabsTrigger
                      key={s}
                      value={String(index)}
                      disabled={index > step}
                    >
                      {s}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="0" className="mt-6">
                  <VehicleTypePicker
                    data={formData.vehicleType}
                    onNext={handleNext}
                    onUpdate={handleFormUpdate}
                  />
                </TabsContent>
                <TabsContent value="1" className="mt-6">
                  <VehicleDetails
                    data={formData.vehicle}
                    onNext={handleNext}
                    onBack={handleBack}
                    onUpdate={handleFormUpdate}
                  />
                </TabsContent>
                <TabsContent value="2" className="mt-6">
                  <OwnerDetails
                    data={formData.driver}
                    onNext={handleNext}
                    onBack={handleBack}
                    onUpdate={handleFormUpdate}
                  />
                </TabsContent>
                <TabsContent value="3" className="mt-6">
                  <CoverageOptions
                    data={formData.coverage}
                    onNext={handleNext}
                    onBack={handleBack}
                    onUpdate={handleFormUpdate}
                  />
                </TabsContent>
                <TabsContent value="4" className="mt-6">
                  <QuotationSummary
                    formData={formData}
                    onBack={handleBack}
                  />
                </TabsContent>

              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <SideQuotation formData={formData} currentStep={step} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App
