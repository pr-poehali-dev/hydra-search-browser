import React from 'react';

interface HydraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const sizes = {
  sm: { text: 'text-lg' },
  md: { text: 'text-2xl' },
  lg: { text: 'text-4xl' },
  xl: { text: 'text-6xl' },
};

const HydraLogo: React.FC<HydraLogoProps> = ({ size = 'md', showText = true }) => {
  const s = sizes[size];

  return (
    <div className="flex items-center select-none">
      {showText && (
        <span
          className={`${s.text} font-golos font-semibold tracking-tight`}
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.65) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Hydra
        </span>
      )}
    </div>
  );
};

export default HydraLogo;
