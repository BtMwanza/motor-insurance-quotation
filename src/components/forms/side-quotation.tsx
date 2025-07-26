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
        if (sumInsured === 0) return { amount: 0, period: "annual", adminFee: 0 }

        // Base premium rates as percentage of sum insured
        let basePremiumRate = 0.03 // 3% for third-party-only

        // Adjust base rate based on coverage type
        switch (formData.coverage.type) {
            case "third-party-only":
                basePremiumRate = 0.02
                break
            case "third-party-fire-theft":
                basePremiumRate = 0.035
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
            default:
                break
        }

        // New import surcharge (temporary cover is more expensive)
        if (formData.vehicle.isNewImport) {
            premium *= 1.2 // 20% surcharge for temporary cover
        }

        // Owner/owner age and experience adjustments
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
                // Optional: small discount for paying annually (2-5%)
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
    const hasMinimumData = formData.vehicle.sumInsured && Number.parseInt(formData.vehicle.sumInsured) > 0

    // Calculate No-Claim Discount
    const getNoClaimDiscount = () => {
        if (formData.coverage.type !== "comprehensive" || formData.owner.claims === "yes") return 0
        const claimFreeYears = Number.parseInt(formData.owner.claimFreeYears) || 0
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
            title: "Owner's Details",
            completed: !!(formData.owner.age && formData.owner.licenseYears),
            data: formData.owner.age ? `Age ${formData.owner.age}, ${formData.owner.licenseYears} years license` : null,
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

    const noClaimDiscount = getNoClaimDiscount();

    const getPeriodLabel = (period: string) => {
        switch (period) {
            case "quarterly":
                return "3 months"
            case "semi-annual":
                return "6 months"
            case "three-quarters":
                return "9 months"
            case "annual":
                return "12 months"
            default:
                return "annual"
        }
    }

    return (
        <Card id="quotation-card" className="w-full h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Your Quote
                    </div>
                    {new Date().toLocaleDateString('en-GB')}
                </CardTitle>
                <CardDescription>Real-time calculation based on your information. Complete steps to get the final premium</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Quote Amount */}
                <div className="text-center p-6 bg-background rounded-lg border border-border">
                    {hasMinimumData ? (
                        <>
                            <div className="text-3xl font-bold text-primary">
                                ZMW {quote.amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {getPeriodLabel(quote.period)} premium
                                {formData.coverage.period !== "annual" && (
                                    <span className="block text-xs">
                                        (Annual equivalent: ZMW{" "}
                                        {quote.annualEquivalent?.toLocaleString("en-US", { maximumFractionDigits: 0 })})
                                    </span>
                                )}
                            </div>
                            {quote.adminFee > 0 && (
                                <div className="text-xs text-amber-600 mt-1">
                                    Includes ZMW {quote.adminFee.toLocaleString("en-US", { maximumFractionDigits: 0 })} admin fee
                                </div>
                            )}
                            {formData.vehicle.isNewImport ? (
                                <div className="text-sm text-muted-foreground mt-1">Temporary cover premium</div>
                            ) : (
                                <div className="text-sm text-muted-foreground mt-1">Estimated annual premium</div>
                            )}
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
                <div className="">
                    <h3 className="font-medium text-sm">Information Collected</h3>
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        const isActive = index === currentStep

                        return (
                            <div
                                key={step.title}
                                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${isActive ? "bg-muted border border-primary/30" : "bg-card"
                                    }`}
                            >
                                <div className="flex-shrink-0 mt-0.5">
                                    {step.completed ? (
                                        <CheckCircle className="h-4 w-4 text-primary" />
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
                                {formData.vehicleType.type && (
                                    <div className="flex justify-between">
                                        <span>Vehicle Usage</span>
                                        <span className="capitalize">{formData.vehicleType.type}</span>
                                    </div>
                                )}
                                {formData.vehicle.isNewImport && (
                                    <div className="flex justify-between text-destructive">
                                        <span>New Import Surcharge</span>
                                        <span>+20%</span>
                                    </div>
                                )}
                                {formData.owner.age && (
                                    <div className="flex justify-between">
                                        <span>owner Profile</span>
                                        <span>
                                            {Number.parseInt(formData.owner.age) < 21
                                                ? "Young owner"
                                                : Number.parseInt(formData.owner.age) < 25
                                                    ? "Under 25"
                                                    : Number.parseInt(formData.owner.age) > 65
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
                                    <div className="flex justify-between">
                                        <span>No-Claim Discount</span>
                                        <span>-{noClaimDiscount}%</span>
                                    </div>
                                )}
                                {formData.coverage.period && (
                                    <div className="flex justify-between">
                                        <span>Payment Period</span>
                                        <span>{getPeriodLabel(formData.coverage.period)}</span>
                                    </div>
                                )}
                                {formData.coverage.period === "annual" && (
                                    <div className="flex justify-between text-secondary">
                                        <span>Annual Payment Discount</span>
                                        <span>-2%</span>
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
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-destructive">
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
