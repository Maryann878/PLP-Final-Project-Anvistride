import React from "react";

interface ProgressBarProps {
  progress: number; // 0 - 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 h-2 rounded">
      <div
        className="h-2 bg-blue-500 rounded"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
