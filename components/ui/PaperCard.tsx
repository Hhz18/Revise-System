import React from 'react';

interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white border-2 border-black rounded-lg 
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
        transition-all duration-200 
        ${onClick ? 'cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
