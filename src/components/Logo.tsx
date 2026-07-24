import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'color'; // dark: dark text (for light bg), light: white text (for dark bg)
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
}) => {
  // Height classes for clear, bold visibility
  const heightClasses = {
    sm: 'h-9 sm:h-10',
    md: 'h-12 sm:h-14 lg:h-16',
    lg: 'h-16 sm:h-20',
    xl: 'h-20 sm:h-24',
  };

  const primarySrc = variant === 'light' ? '/mef-logo-white.png' : '/mef-logo.png';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={primarySrc}
        onError={(e) => {
          const img = e.currentTarget;
          img.onerror = null;
          img.src = '/MEF_logo_svg.png';
        }}
        alt="MARIA EUGENIA FERNÁNDEZ Negocios Inmobiliarios"
        className={`${heightClasses[size]} w-auto object-contain transition-transform duration-300 hover:scale-102 filter drop-shadow-xs`}
      />
    </div>
  );
};

