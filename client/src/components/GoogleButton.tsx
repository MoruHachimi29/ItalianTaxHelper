import { Button } from "@/components/ui/button";
import { SiGoogle } from "react-icons/si";
import { Loader2 } from "lucide-react";

interface GoogleButtonProps {
  onClick: () => void;
  isLoading: boolean;
  className?: string;
}

export function GoogleButton({ onClick, isLoading, className = "" }: GoogleButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 ${className}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Autenticazione in corso...</span>
        </>
      ) : (
        <>
          <SiGoogle className="h-5 w-5 text-[#4285F4]" />
          <span className="flex">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </span>
        </>
      )}
    </Button>
  );
}