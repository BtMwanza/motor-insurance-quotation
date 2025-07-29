import { useEffect, useState } from 'react'
import './App.css'
import { Card, CardContent } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import VehicleTypePicker from './components/forms/vehicle-type-picker';
import VehicleDetails from './components/forms/vehicle-details';
import OwnerDetails from './components/forms/owner-details';
import Summary from './components/forms/summary';
import CoverageOptions from './components/forms/coverage-options';
import SideDisplay from './components/forms/side-display';
import { Car, FileText, User, ShieldCheck, ListChecks } from "lucide-react"; // Example icons
import html2canvas from 'html2canvas-pro';
import Quotation from './components/forms/quotation';

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
  owner: { age: string; licenseYears: string; claims: "yes" | "no"; claimFreeYears: string; previousClaims: string }
  coverage: {
    type: "third-party-only" | "third-party-fire-theft" | "comprehensive" | "";
    period: "quarterly" | "semi-annual" | "three-quarters" | "annual" | "";
  }
}

function App() {
  const [step, setStep] = useState(0);
  const [isHidden, setIsHidden] = useState(true);
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
    owner: {
      age: "",
      licenseYears: "",
      claims: "no",
      claimFreeYears: "0",
      previousClaims: "0",
    },
    coverage: { type: "", period: "" },
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

  const steps = [
    { label: "Vehicle Type", icon: <Car className="w-5 h-5" /> },
    { label: "Vehicle Details", icon: <FileText className="w-5 h-5" /> },
    { label: "Owner/Driver Details", icon: <User className="w-5 h-5" /> },
    { label: "Coverage Options", icon: <ShieldCheck className="w-5 h-5" /> },
    { label: "Summary", icon: <ListChecks className="w-5 h-5" /> },
  ];

  // download image
  useEffect(() => {
    if (!isHidden) {
      const captureAndDownload = async () => {
        try {
          const card = document.getElementById("quotation-card");
          if (card) {
            const canvas = await html2canvas(card);
            const link = document.createElement("a");
            link.download = "quotation.png";
            link.href = canvas.toDataURL();
            link.click();
          }
        } catch (error) {
          console.log("Error downloading image:", error);
        } finally {
          setIsHidden(true);
        }
      };

      captureAndDownload();
    }
  }, [isHidden]);


  const handleExportImage = () => {
    setIsHidden(false);
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-4 gap-4">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <Tabs value={String(step)} className="w-full">
                <TabsList className="grid w-full h-full grid-cols-5">
                  {steps.map((stepObj, index) => (
                    <TabsTrigger
                      key={stepObj.label}
                      value={String(index)}
                      disabled={index > step}
                      className="flex flex-col items-center gap-1"
                    >
                      <span>{stepObj.icon}</span>
                      <span className="hidden md:inline">{stepObj.label}</span>
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
                    data={formData.owner}
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
                  <Summary
                    formData={formData}
                    onBack={handleBack}
                    handleExportImage={handleExportImage}
                  />
                </TabsContent>

              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <SideDisplay formData={formData} currentStep={step} />
          </div>
        </div>
      </div>

      {!isHidden && <Quotation formData={formData} />}
    </main>
  );
}

export default App
