import React from 'react';
import { Droplets } from 'lucide-react';

interface WaterTextBgProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'title' | 'subtle' | 'badge' | 'header';
  showDroplet?: boolean;
}

export const WaterTextBg: React.FC<WaterTextBgProps> = ({
  children,
  className = '',
  variant = 'title',
  showDroplet = false,
}) => {
  if (variant === 'badge') {
    return (
      <span
        className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold overflow-hidden border transition-all duration-300 shadow-sm ${className} bg-sky-50/90 dark:bg-sky-950/80 border-sky-300/60 dark:border-sky-700/60 text-sky-900 dark:text-sky-100`}
      >
        {/* Organic Water Wave SVG in background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30 dark:opacity-40 pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 120 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 16 C 30 10, 60 22, 90 14 C 105 10, 115 18, 120 16 L 120 28 L 0 28 Z"
            fill="currentColor"
            className="text-sky-300 dark:text-sky-500 animate-pulse"
          />
        </svg>

        {showDroplet && (
          <Droplets className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 relative z-10" />
        )}
        <span className="relative z-10">{children}</span>
      </span>
    );
  }

  if (variant === 'header') {
    return (
      <div className={`relative inline-block py-0.5 px-2.5 rounded-lg overflow-hidden group ${className}`}>
        {/* Fluid natural water flow backing */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-400/15 via-teal-400/20 to-sky-400/15 dark:from-sky-500/20 dark:via-teal-500/25 dark:to-sky-500/20 border border-sky-300/40 dark:border-sky-600/40 backdrop-blur-xs transition-all group-hover:from-sky-400/25 group-hover:to-teal-400/30 pointer-events-none"
        />
        {/* Soft flowing wave contour */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-3 opacity-40 dark:opacity-50 pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 100 12"
          fill="none"
        >
          <path
            d="M0 6 Q 25 12, 50 6 T 100 6 L 100 12 L 0 12 Z"
            fill="currentColor"
            className="text-sky-400 dark:text-sky-400"
          />
        </svg>
        <div className="relative z-10 flex items-center gap-2">{children}</div>
      </div>
    );
  }

  // Default 'title' variant: Natural flowing water current under typography
  return (
    <span className={`relative inline-block ${className}`}>
      {/* Cool fluid water background aura */}
      <span
        aria-hidden="true"
        className="absolute -inset-x-2.5 -inset-y-1 rounded-md bg-gradient-to-r from-sky-400/12 via-teal-300/15 to-sky-400/12 dark:from-sky-500/20 dark:via-cyan-400/15 dark:to-sky-500/20 -z-10 blur-[1px] transform -skew-x-1"
      />
      {/* Flowing water wave baseline */}
      <svg
        aria-hidden="true"
        className="absolute -bottom-1 left-0 right-0 w-full h-2.5 text-sky-400/30 dark:text-sky-400/40 pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 100 8"
        fill="none"
      >
        <path
          d="M0 4 C 20 0, 40 8, 60 4 C 80 0, 95 6, 100 4 L 100 8 L 0 8 Z"
          fill="currentColor"
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </span>
  );
};
