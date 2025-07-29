import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { FileText, Shield, Car, User } from "lucide-react"

interface QuotationProps {
    formData: {
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
}

export default function Quotation({ formData }: QuotationProps) {

    const calculateQuote = () => {
        const sumInsured = Number.parseInt(formData.vehicle.sumInsured) || 0
        if (sumInsured === 0) return { amount: 0, period: "annual", adminFee: 0 }


        let basePremiumRate = 0.03
        // Adjust base rate based on coverage type
        switch (formData.coverage.type) {
            case "third-party-only":
                basePremiumRate = 0.02
                break
            case "third-party-fire-theft":
                basePremiumRate = 0.03
                break
            case "comprehensive":
                basePremiumRate = 0.05
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
                premium *= 1.1
                break
            default:
                break
        }


        if (formData.vehicle.isNewImport) {
            premium *= 1.2
        }

        // Owner's age and experience adjustments
        const age = Number.parseInt(formData.owner.age) || 0
        const licenseYears = Number.parseInt(formData.owner.licenseYears) || 0

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
            premium *= 1.5 // 50% increase for new owners
        }

        // Claims history adjustment, 25% increase per claim
        if (formData.owner.claims === "yes") {
            const claimsCount = Number.parseInt(formData.owner.previousClaims) || 1
            premium *= 1 + claimsCount * 0.25
        }

        // No-Claim Discount (only for comprehensive coverage)
        if (formData.coverage.type === "comprehensive" && formData.owner.claims === "no") {
            const claimFreeYears = Number.parseInt(formData.owner.claimFreeYears) || 0
            let discount = 0

            switch (claimFreeYears) {
                case 1:
                    discount = 0.15
                    break
                case 2:
                    discount = 0.25
                    break
                case 3:
                    discount = 0.4
                    break
                case 4:
                    discount = 0.6
                    break
                case 5:
                default:
                    if (claimFreeYears >= 5) discount = 0.65
                    break
            }

            // Apply discount only to own damage portion (approximately 70% of comprehensive premium)
            const ownDamagePortion = premium * 0.7
            const thirdPartyPortion = premium * 0.3
            premium = thirdPartyPortion + ownDamagePortion * (1 - discount)
        }

        // Apply payment period adjustments - TRUE PROPORTIONAL METHOD
        let finalPremium = premium
        let periodMultiplier = 1

        switch (formData.coverage.period) {
            case "quarterly":
                periodMultiplier = 0.25 // Exactly 25% of annual
                break
            case "semi-annual":
                periodMultiplier = 0.5 // Exactly 50% of annual
                break
            case "three-quarters":
                periodMultiplier = 0.75 // Exactly 75% of annual
                break
            case "annual":
                periodMultiplier = 1 // Full annual premium

                finalPremium = premium * 0.98 // 2% discount
                break
            default:
                periodMultiplier = 1
                break
        }

        if (formData.coverage.period !== "annual") {
            finalPremium = premium * periodMultiplier
        }

        return {
            amount: Math.max(125 * periodMultiplier, finalPremium), // Minimum scales with period
            period: formData.coverage.period,
            adminFee: 0, // No admin fees in proportional model
            annualEquivalent: premium,
        }
    }

    const quote = calculateQuote()
    const quotationNumber = `ZMI-${Date.now().toString().slice(-8)}`
    const currentDate = new Date().toLocaleDateString("en-GB")
    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB")

    const getPeriodLabel = (period: string) => {
        switch (period) {
            case "quarterly":
                return "Quarterly (3 months)"
            case "semi-annual":
                return "Semi-Annual (6 months)"
            case "three-quarters":
                return "Three Quarters (9 months)"
            case "annual":
                return "Annual (12 months)"
            default:
                return "Annual"
        }
    }

    const getCoverageDescription = (type: string) => {
        switch (type) {
            case "third-party-only":
                return "Third Party Only - Covers third-party bodily injury and property damage only"
            case "third-party-fire-theft":
                return "Third Party Fire & Theft - Includes third-party coverage plus fire and theft protection"
            case "comprehensive":
                return "Comprehensive - Complete protection including own vehicle damage, theft, fire, and third-party liability"
            default:
                return ""
        }
    }

    return (
        <Card className="max-w-4xl mx-auto" id="quotation-card">
            <CardHeader className="text-center border-b">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">MOTOR INSURANCE QUOTATION</CardTitle>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                        Quotation No: <strong>{quotationNumber}</strong>
                    </span>
                    <span>
                        Date: <strong>{currentDate}</strong>
                    </span>
                    <span>
                        Valid Until: <strong>{validUntil}</strong>
                    </span>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
                {/* Premium Summary */}
                <div className="text-center p-6 bg-primary/5 rounded-lg border">
                    <div className="text-3xl font-bold text-primary mb-2">
                        ZMW {quote.amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-lg font-medium">{getPeriodLabel(formData.coverage.period)} Premium</div>
                    {formData.coverage.period !== "annual" && (
                        <div className="text-sm text-muted-foreground mt-1">
                            Annual Equivalent: ZMW {quote.annualEquivalent?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                        </div>
                    )}
                    {formData.vehicle.isNewImport && (
                        <Badge variant="secondary" className="mt-2">
                            Temporary Cover
                        </Badge>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Vehicle Information */}
                    <Card>
                        <CardHeader className="">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Car className="h-5 w-5" />
                                Vehicle Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Type:</span>
                                <span className="font-medium">
                                    {formData.vehicleType.type
                                        .replace(/-/g, " ")
                                        .split(" ")
                                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(" ")}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Vehicle:</span>
                                <span className="font-medium">
                                    {formData.vehicle.make} {formData.vehicle.model}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Year:</span>
                                <span className="font-medium">{formData.vehicle.year}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Registration:</span>
                                <span className="font-medium">{formData.vehicle.plateNumber || "Pending"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Sum Insured:</span>
                                <span className="font-medium">
                                    ZMW {Number.parseInt(formData.vehicle.sumInsured).toLocaleString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Owner Information */}
                    <Card>
                        <CardHeader className="">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5" />
                                Owner Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Age:</span>
                                <span className="font-medium">{formData.owner.age} years</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">License Experience:</span>
                                <span className="font-medium">{formData.owner.licenseYears} years</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Claims History:</span>
                                <span className="font-medium">
                                    {formData.owner.claims === "yes" ? `${formData.owner.previousClaims} claims` : "No claims"}
                                </span>
                            </div>
                            {formData.owner.claims === "no" && formData.coverage.type === "comprehensive" && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Claim-Free Years:</span>
                                    <span className="font-medium">{formData.owner.claimFreeYears}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Coverage Details */}
                <Card>
                    <CardHeader className="">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Shield className="h-5 w-5" />
                            Coverage Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <div className="font-medium mb-1">
                                {formData.coverage.type
                                    .replace(/-/g, " ")
                                    .split(" ")
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")}
                            </div>
                            <p className="text-sm text-muted-foreground">{getCoverageDescription(formData.coverage.type)}</p>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Payment Period:</span>
                            <span className="font-medium">{getPeriodLabel(formData.coverage.period)}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Important Notes */}
                <Card className="bg-muted/30">
                    <CardHeader className="">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FileText className="h-5 w-5" />
                            Important Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• This quotation is valid for 30 days from the date of issue</li>
                            <li>• Premium is subject to final underwriting approval</li>
                            <li>• Policy terms and conditions apply</li>
                            <li>• All amounts are in Zambian Kwacha (ZMW)</li>
                            {formData.vehicle.isNewImport && <li>• Vehicle must be registered with RTSA within 30 days</li>}
                            <li>• Payment must be received before policy commencement</li>
                        </ul>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>

    )
}
