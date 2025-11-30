import React from 'react';

interface PaperButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const PaperButton: React.FC<PaperButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "border-2 border-black rounded-md px-4 py-2 font-hand text-lg font-bold transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]";
  
  const variants = {
    primary: "bg-yellow-300 hover:bg-yellow-400 text-black",
    secondary: "bg-white hover:bg-gray-50 text-black",
    danger: "bg-red-300 hover:bg-red-400 text-black"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};
