import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import type { QuotationFormData } from "@/App";

interface QuoteDisplayProps {
  formData: QuotationFormData;
  onBack: () => void;
}

const Quotation = () => {


  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold">5. Your Quotation</h2>

    </div>
  );
};

export default Quotation;
