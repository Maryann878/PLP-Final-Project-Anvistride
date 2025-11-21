import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorsProps {
  stepsCount: number;
  currentStep: number;
  completedSteps: number[];
  onClick: (step: number) => void;
}

export const StepIndicators: React.FC<StepIndicatorsProps> = ({
  stepsCount,
  currentStep,
  completedSteps,
  onClick,
}) => {
  return (
    <div className="flex gap-2 mt-4 justify-center">
      {Array.from({ length: stepsCount }).map((_, index) => (
        <div
          key={index}
          onClick={() => onClick(index)}
          className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer
            ${currentStep === index ? "bg-blue-500 border-blue-500 text-white" : ""}
            ${completedSteps.includes(index) && currentStep !== index ? "bg-green-500 border-green-500 text-white" : ""}
          `}
        >
          {completedSteps.includes(index) && <Check size={16} />}
        </div>
      ))}
    </div>
  );
};
