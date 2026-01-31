import React from 'react';

export const Logo = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient
        id="logo-gradient"
        x1="0"
        y1="0"
        x2="40"
        y2="40"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    {/* K */}
    <path
      d="M8 6V34 M8 20L20 6 M8 20L20 34"
      stroke="url(#logo-gradient)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* J */}
    <path
      d="M32 6V24C32 30 28 34 22 34"
      stroke="url(#logo-gradient)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
