import type { OwnerDetails } from "@/components/forms/owner-details";
import type { VehicleDetails } from "@/components/forms/vehicle-details";
import { parseSumInsuredForValidation } from "./utils";

const PLATE_REGEX = /^(?:[A-Z]{1,3}\d{1,4}|GRZ\s?\d{1,4}|G\d{1,4}|D\d{1,4}|ZP\d{1,4}|ZAF\d{1,4}|ZNS\d{1,4}|ZRA\d{1,4}|[A-Z]{1,6}\s?\d{0,4})$/i;

const CHASSIS_ENGINE_REGEX = /^[A-HJ-NPR-Z0-9]{11,17}$/i; // 17 chars, no I, O, Q, but allow 11-17 for some imports


export const vehicleValidation = (vehicleData: VehicleDetails, currentYear: number) => {
    const newErrors: { [key: string]: string } = {};
    // Year
    const year = Number(vehicleData.year.trim());
    if (!vehicleData.year || isNaN(year) || year < 1900 || year > currentYear) {
        newErrors.year = `Enter a valid year between 1886 and ${currentYear}`;
    }

    if (!year || !/^\d{4}$/.test(vehicleData.year.trim())) {
        newErrors.year = "Enter a valid year (4 digits)";
    }

    // Plate number (if not new import)
    /*  if (!vehicleData.isNewImport) {
         if (!vehicleData.plateNumber || !PLATE_REGEX.test(vehicleData.plateNumber.trim())) {
             newErrors.plateNumber = "Enter a valid Zambian plate number (e.g. ABC1234, GRZ 1234)";
         }
     } */
    // Chassis number
    if (!vehicleData.chassisNumber || !CHASSIS_ENGINE_REGEX.test(vehicleData.chassisNumber.trim())) {
        newErrors.chassisNumber = "Enter a valid chassis number (11-17 alphanumeric, no I/O/Q)";
    }
    // Engine number
    if (!vehicleData.engineNumber || !CHASSIS_ENGINE_REGEX.test(vehicleData.engineNumber.trim())) {
        newErrors.engineNumber = "Enter a valid engine number (11-17 alphanumeric, no I/O/Q)";
    }
    // Sum insured
    const sumInsuredValue = parseSumInsuredForValidation(vehicleData.sumInsured)
    if (!vehicleData.sumInsured.trim()) {
        newErrors.sumInsured = "Please enter the sum insured amount"
    } else if (sumInsuredValue === 0) {
        newErrors.sumInsured = "Please enter a valid numeric amount"
    } else if (sumInsuredValue < 1000) {
        newErrors.sumInsured = "Minimum sum insured is ZMW 1,000"
    }
    // Make
    if (!vehicleData.make) {
        newErrors.make = "Select a vehicle make";
    }
    // Model
    if (!vehicleData.model) {
        newErrors.model = "Enter the vehicle model";
    }
    return newErrors;
};


export const ownerValidation = (driverData: OwnerDetails) => {
    const newErrors: { [key: string]: string } = {}
    const age = Number(driverData.age)
    const licenseYears = Number(driverData.licenseYears)
    const previousClaims = Number(driverData.previousClaims)

    if (!driverData.age || isNaN(age) || age < 16 || age > 100) {
        newErrors.age = "Enter a valid age between 16 and 100"
    }
    if (!driverData.licenseYears || isNaN(licenseYears) || licenseYears < 0 || licenseYears > (age - 16)) {
        newErrors.licenseYears = "Enter valid years (cannot exceed age minus 16)"
    }
    if (driverData.claims === "yes") {
        if (!driverData.previousClaims || isNaN(previousClaims) || previousClaims < 1 || previousClaims > 10) {
            newErrors.previousClaims = "Enter a valid number of claims (1-10)"
        }
    }
    return newErrors
}