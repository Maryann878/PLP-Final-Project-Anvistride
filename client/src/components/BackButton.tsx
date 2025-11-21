import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  showText?: boolean;
  to?: string;
}

const BackButton = ({ 
  className = "", 
  variant = "outline",
  showText = true,
  to 
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleBack}
      className={`flex items-center gap-2 ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
      {showText && <span>Back</span>}
    </Button>
  );
};

export default BackButton;

