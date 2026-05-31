import { forwardRef } from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(({ size = 32, showText = true, className = '' }, ref) => (
  <div ref={ref} className={`flex items-center gap-2 ${className}`}>
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true" className="flex-shrink-0">
      <path d="M18 3 Q8 14 6 22 C5 28 10 33 18 33 C26 33 31 28 30 22 Q28 14 18 3 Z" fill="url(#logoGrad)"/>
      <path d="M18 3 L15 10 L18 13 L21 10 Z" fill="white" opacity="0.12"/>
      <path d="M12 25 C12 21.5 18 16 18 16 C18 16 24 21.5 24 25 C24 28 21 31 18 31 C15 31 12 28 12 25 Z" fill="white" opacity="0.08"/>
      <defs>
        <linearGradient id="logoGrad" x1="5" y1="3" x2="31" y2="33" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED"/>
          <stop offset="1" stopColor="#06B6D4"/>
        </linearGradient>
      </defs>
    </svg>
    {showText && <span className="text-xl font-bold tracking-tight text-white">Drops</span>}
  </div>
));

Logo.displayName = 'Logo';
export default Logo;
