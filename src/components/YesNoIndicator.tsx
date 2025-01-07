"use client";

import { Check, X } from "lucide-react";

interface YesNoIndicatorProps {
  label: string; // The label (e.g., "Cloud Based", "Tech Supported")
  value: string | boolean | "YES" | "NO"; // The value to check
}

export const YesNoIndicator: React.FC<YesNoIndicatorProps> = ({ label, value }) => {
  const isYes = value === 'YES' || value === true;

  return (
    <p className="text-sm flex items-center gap-2">
      {label}:
      <span className={`flex items-center gap-1 ${isYes ? 'text-green-600' : 'text-red-600'}`}>
        {isYes ? (
          <>
            Yes <Check className="w-5 h-5" />
          </>
        ) : (
          <>
            No <X className="w-5 h-5" />
          </>
        )}
      </span>
    </p>
  );
};
