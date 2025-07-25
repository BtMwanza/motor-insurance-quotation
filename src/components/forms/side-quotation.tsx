"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Circle, Car, User, Shield, FileText, Percent, AlertTriangle } from "lucide-react"
import type { QuotationFormData } from "@/App"

interface SideQuotationProps {
    formData: QuotationFormData
    currentStep: number
}

export default function SideQuotation({ formData, currentStep }: SideQuotationProps) {
    const calculateQuote = () => {
        const sumInsured = Number.parseInt(formData.vehicle.sumInsured) || 0
        if (sumInsured === 0) return 0

        // Base premium rates as percentage of sum insured
        let basePremiumRate = 0.03 // 3% for third-party-only

        // Adjust base rate based on coverage type
        switch (formData.coverage.type) {
            case "third-party-only":
                basePremiumRate = 0.02 // 2% of sum insured
                break
            case "third-party-fire-theft":
                basePremiumRate = 0.035 // 3.5% of sum insured
                break
            case "comprehensive":
                basePremiumRate = 0.05 // 5% of sum insured
                break
        }

        let premium = sumInsured * basePremiumRate

        // Vehicle type multiplier
        switch (formData.vehicleType.type) {
            case "commercial":
                premium *= 1.5
                break
            case "taxi":
                premium *= 2.5
                break
            case "personal":
            default:
                // No multiplier for personal use
                break
        }

        // New import surcharge (temporary cover is more expensive)
        if (formData.vehicle.isNewImport) {
            premium *= 1.2 // 20% surcharge for temporary cover
        }

        // Driver age and experience adjustments
        const age = Number.parseInt(formData.driver.age) || 0
        const licenseYears = Number.parseInt(formData.driver.licenseYears) || 0

        if (age > 0) {
            if (age < 21) {
                premium *= 1.8 // 80% increase for under 21
            } else if (age < 25) {
                premium *= 1.4 // 40% increase for under 25
            } else if (age > 65) {
                premium *= 1.2 // 20% increase for over 65
            }
        }

        if (licenseYears < 2) {
            premium *= 1.5 // 50% increase for new drivers
        }

        // Claims history adjustment
        if (formData.driver.claims === "yes") {
            const claimsCount = Number.parseInt(formData.driver.previousClaims) || 1
            premium *= 1 + claimsCount * 0.25 // 25% increase per claim
        }

        // No-Claim Discount (only for comprehensive coverage)
        if (formData.coverage.type === "comprehensive" && formData.driver.claims === "no") {
            const claimFreeYears = Number.parseInt(formData.driver.claimFreeYears) || 0
            let discount = 0

            switch (claimFreeYears) {
                case 1:
                    discount = 0.15 // 15%
                    break
                case 2:
                    discount = 0.25 // 25%
                    break
                case 3:
                    discount = 0.4 // 40%
                    break
                case 4:
                    discount = 0.6 // 60%
                    break
                case 5:
                default:
                    if (claimFreeYears >= 5) discount = 0.65 // 65%
                    break
            }

            // Apply discount only to own damage portion (approximately 70% of comprehensive premium)
            const ownDamagePortion = premium * 0.7
            const thirdPartyPortion = premium * 0.3
            premium = thirdPartyPortion + ownDamagePortion * (1 - discount)
        }

        return Math.max(500, premium) // Minimum premium of ZMW 500
    }

    const quote = calculateQuote()
    const hasMinimumData = formData.vehicle.sumInsured && Number.parseInt(formData.vehicle.sumInsured) > 0

    // Calculate No-Claim Discount
    const getNoClaimDiscount = () => {
        if (formData.coverage.type !== "comprehensive" || formData.driver.claims === "yes") return 0
        const claimFreeYears = Number.parseInt(formData.driver.claimFreeYears) || 0
        switch (claimFreeYears) {
            case 1:
                return 15
            case 2:
                return 25
            case 3:
                return 40
            case 4:
                return 60
            case 5:
            default:
                return claimFreeYears >= 5 ? 65 : 0
        }
    }

    const steps = [
        {
            icon: Car,
            title: "Vehicle Type",
            completed: !!formData.vehicleType.type,
            data: formData.vehicleType.type
                ? formData.vehicleType.type
                    .replace(/-/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : null,
        },
        {
            icon: FileText,
            title: "Vehicle Details",
            completed: !!(formData.vehicle.make && formData.vehicle.model && formData.vehicle.sumInsured),
            data:
                formData.vehicle.make && formData.vehicle.model
                    ? `${formData.vehicle.make} ${formData.vehicle.model} - ${formData.vehicle.plateNumber || "Pending Registration"}`
                    : null,
        },
        {
            icon: User,
            title: "Driver Details",
            completed: !!(formData.driver.age && formData.driver.licenseYears),
            data: formData.driver.age ? `Age ${formData.driver.age}, ${formData.driver.licenseYears} years license` : null,
        },
        {
            icon: Shield,
            title: "Coverage",
            completed: !!formData.coverage.type,
            data: formData.coverage.type
                ? formData.coverage.type
                    .replace(/-/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : null,
        },
    ]

    const noClaimDiscount = getNoClaimDiscount()

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Your Quote
                </CardTitle>
                <CardDescription>Real-time estimate based on your information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Quote Amount */}
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                    {hasMinimumData ? (
                        <>
                            <div className="text-3xl font-bold text-blue-600">
                                ZMW {quote.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {formData.vehicle.isNewImport ? "Temporary cover premium" : "Estimated annual premium"}
                            </div>
                            {formData.vehicle.isNewImport && (
                                <div className="flex items-center justify-center gap-1 mt-2">
                                    <AlertTriangle className="h-3 w-3 text-amber-600" />
                                    <span className="text-xs text-amber-600 font-medium">Temporary Cover (20% surcharge)</span>
                                </div>
                            )}
                            {noClaimDiscount > 0 && (
                                <div className="flex items-center justify-center gap-1 mt-2">
                                    <Percent className="h-3 w-3 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">
                                        {noClaimDiscount}% No-Claim Discount Applied
                                    </span>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="text-2xl font-medium text-muted-foreground">ZMW ---</div>
                            <div className="text-sm text-muted-foreground mt-1">Enter vehicle value to see estimate</div>
                        </>
                    )}
                </div>

                <Separator />

                {/* Progress Steps */}
                <div className="space-y-4">
                    <h3 className="font-medium text-sm">Information Collected</h3>
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        const isActive = index === currentStep

                        return (
                            <div
                                key={step.title}
                                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${isActive ? "bg-blue-50 border border-blue-200" : ""}`}
                            >
                                <div className="flex-shrink-0 mt-0.5">
                                    {step.completed ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">{step.title}</span>
                                        {isActive && (
                                            <Badge variant="secondary" className="text-xs">
                                                Current
                                            </Badge>
                                        )}
                                    </div>
                                    {step.data && <div className="text-xs text-muted-foreground mt-1 truncate">{step.data}</div>}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Quote Breakdown */}
                {hasMinimumData && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <h3 className="font-medium text-sm">Quote Factors</h3>
                            <div className="space-y-1 text-xs text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>Sum Insured</span>
                                    <span>ZMW {Number.parseInt(formData.vehicle.sumInsured || "0").toLocaleString()}</span>
                                </div>
                                {/*    {formData.vehicle.usage && (
                                    <div className="flex justify-between">
                                        <span>Vehicle Usage</span>
                                        <span className="capitalize">{formData.vehicle.usage}</span>
                                    </div>
                                )} */}
                                {formData.vehicle.isNewImport && (
                                    <div className="flex justify-between text-amber-600">
                                        <span>New Import Surcharge</span>
                                        <span>+20%</span>
                                    </div>
                                )}
                                {formData.driver.age && (
                                    <div className="flex justify-between">
                                        <span>Driver Profile</span>
                                        <span>
                                            {Number.parseInt(formData.driver.age) < 21
                                                ? "Young Driver"
                                                : Number.parseInt(formData.driver.age) < 25
                                                    ? "Under 25"
                                                    : Number.parseInt(formData.driver.age) > 65
                                                        ? "Senior"
                                                        : "Standard"}
                                        </span>
                                    </div>
                                )}
                                {formData.coverage.type && (
                                    <div className="flex justify-between">
                                        <span>Coverage Level</span>
                                        <span className="capitalize">{formData.coverage.type.replace(/-/g, " ")}</span>
                                    </div>
                                )}
                                {noClaimDiscount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>No-Claim Discount</span>
                                        <span>-{noClaimDiscount}%</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* New Import Warning */}
                {formData.vehicle.isNewImport && (
                    <>
                        <Separator />
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-amber-700">
                                    <p className="font-medium mb-1">Temporary Cover Notice</p>
                                    <p>Registration with RTSA required within 30 days to maintain coverage.</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
