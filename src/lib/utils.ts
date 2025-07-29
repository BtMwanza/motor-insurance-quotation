import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const cleanSumInsured = (value: string): string => {
  const cleaned = value.replace(/[^\d.]/g, "")
  const numValue = Number.parseFloat(cleaned)
  return isNaN(numValue) ? "" : numValue.toString()
}

export const formatSumInsured = (value: string): string => {
  const cleaned = cleanSumInsured(value)
  if (!cleaned) return ""
  const numValue = Number.parseFloat(cleaned)
  return numValue.toLocaleString("en-US")
}

export const parseSumInsuredForValidation = (value: string): number => {
  if (!value) return 0
  const cleaned = cleanSumInsured(value)
  const parsed = Number.parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}
