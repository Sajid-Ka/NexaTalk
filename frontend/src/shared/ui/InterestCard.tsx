import React from 'react';
import { Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InterestCardProps {
  label: string;
  icon: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

const InterestCard: React.FC<InterestCardProps> = ({ 
  label, 
  icon, 
  selected, 
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center p-6 rounded-2xl cursor-pointer transition-all duration-300 group",
        "bg-[#0F111A] border-2 w-full h-32 md:h-40",
        selected 
          ? "border-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
          : "border-transparent hover:border-[#22D3EE]/30"
      )}
    >
      {selected && (
        <div className="absolute top-2 right-2 bg-[#22D3EE] rounded-full p-0.5 z-10">
          <Check className="w-3 h-3 text-black" />
        </div>
      )}
      
      <div className={cn(
        "mb-3 transition-colors duration-300",
        selected ? "text-[#22D3EE]" : "text-gray-400 group-hover:text-gray-300"
      )}>
        {React.isValidElement(icon) && React.cloneElement(icon, { 
          className: "w-8 h-8 md:w-10 md:h-10" 
        } as React.HTMLAttributes<HTMLElement>)}
      </div>
      
      <span className={cn(
        "font-medium text-sm md:text-base transition-colors duration-300",
        selected ? "text-white" : "text-gray-400 group-hover:text-gray-300"
      )}>
        {label}
      </span>
    </div>
  );
};

export default InterestCard;
