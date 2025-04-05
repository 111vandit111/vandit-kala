import { ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, className }) => {
  return (
    <div className={`relative group/tooltip inline-block h-fit ${className}`}>
      {children}
      <div className="absolute left-1/2 hidden -translate-x-1/2 bottom-full mb-2 w-max max-w-[200px] bg-black/75 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover/tooltip:block group-hover/tooltip:opacity-100 transition-all duration-300 shadow-lg text-center">
        {text}
        <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-default-gray"></div>
      </div>
    </div>
  );
};

export default Tooltip;
