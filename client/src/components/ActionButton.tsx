import React from "react";

interface ActionButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
  type?: "primary" | "secondary";
}

export const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, onClick, type = "primary" }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded ${
        type === "primary" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
      }`}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {label}
    </button>
  );
};
 