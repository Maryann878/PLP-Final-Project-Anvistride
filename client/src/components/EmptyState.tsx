import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  iconBg?: string;
  iconColor?: string;
  buttonClassName?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  iconBg = "from-purple-100 via-purple-50 to-teal-100 dark:from-purple-900/30 dark:to-teal-900/30",
  iconColor = "text-purple-600 dark:text-purple-400",
  buttonClassName = "bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 focus-visible:ring-purple-500",
}) => {
  return (
    <Card className="backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50">
      <CardContent className="p-12 sm:p-16 text-center">
        <div className={cn("w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg shadow-purple-500/10 animate-pulse-slow ring-2 ring-white/20", iconBg)}>
          <Icon className={cn("h-14 w-14 sm:h-16 sm:w-16", iconColor)} />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
          {description}
        </p>
        <Button 
          onClick={onAction} 
          className={cn(
            "text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-100 focus-visible:ring-2 focus-visible:ring-offset-2",
            buttonClassName
          )}
        >
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
