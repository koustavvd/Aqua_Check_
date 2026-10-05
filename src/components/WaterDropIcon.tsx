import React from 'react';

interface WaterDropIconProps {
  className?: string;
  size?: number;
  fill?: string;
  variant?: 'outline' | 'solid' | 'gradient';
}

export const WaterDropIcon: React.FC<WaterDropIconProps> = ({
  className = 'w-5 h-5 text-sky-600',
  size = 20,
  fill,
  variant = 'gradient',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="waterDropGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="waterDropShine" x1="7" y1="8" x2="11" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {variant === 'gradient' ? (
        <>
          {/* Main Drop Body */}
          <path
            d="M12 2.69L12 2.69C9.5 6.0 5 11.2 5 15.5C5 19.09 8.13 22 12 22C15.87 22 19 19.09 19 15.5C19 11.2 14.5 6.0 12 2.69Z"
            fill="url(#waterDropGrad)"
          />
          {/* Natural Light Reflection / Specular Highlight */}
          <path
            d="M9 13C8.5 14.2 8.5 16 9.5 17.5"
            stroke="url(#waterDropShine)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ) : variant === 'solid' ? (
        <path
          d="M12 2.69C9.5 6.0 5 11.2 5 15.5C5 19.09 8.13 22 12 22C15.87 22 19 19.09 19 15.5C19 11.2 14.5 6.0 12 2.69Z"
          fill={fill || 'currentColor'}
        />
      ) : (
        <path
          d="M12 2.69C9.5 6.0 5 11.2 5 15.5C5 19.09 8.13 22 12 22C15.87 22 19 19.09 19 15.5C19 11.2 14.5 6.0 12 2.69Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
    </svg>
  );
};
