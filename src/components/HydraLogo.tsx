import React from 'react';

interface HydraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const sizes = {
  sm: { icon: 24, text: 'text-lg' },
  md: { icon: 36, text: 'text-2xl' },
  lg: { icon: 56, text: 'text-4xl' },
  xl: { icon: 80, text: 'text-6xl' },
};

const HydraLogo: React.FC<HydraLogoProps> = ({ size = 'md', showText = true }) => {
  const s = sizes[size];

  return (
    <div className="flex items-center gap-3 select-none">
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <circle cx="40" cy="40" r="38" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <circle cx="40" cy="40" r="28" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="40" cy="40" r="6" fill="white" opacity="0.85" />
        <line x1="40" y1="12" x2="40" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="40" y1="58" x2="40" y2="68" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="12" y1="40" x2="22" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="58" y1="40" x2="68" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="20" y1="20" x2="27" y2="27" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
        <line x1="60" y1="20" x2="53" y2="27" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
        <line x1="20" y1="60" x2="27" y2="53" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
        <line x1="60" y1="60" x2="53" y2="53" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
        <circle cx="40" cy="12" r="2.5" fill="white" opacity="0.6" />
        <circle cx="68" cy="40" r="2.5" fill="white" opacity="0.4" />
        <circle cx="40" cy="68" r="2.5" fill="white" opacity="0.4" />
        <circle cx="12" cy="40" r="2.5" fill="white" opacity="0.4" />
      </svg>
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
