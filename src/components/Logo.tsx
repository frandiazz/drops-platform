export default function Logo({ size = 8, textSize = 'xl', showText = true }: { size?: number; textSize?: string; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <svg className={`w-${size} h-${size} text-accent-cyan`} viewBox="0 0 32 40" fill="none" aria-hidden="true">
        <path d="M16 0C16 0 0 18 0 26C0 34.837 7.163 40 16 40C24.837 40 32 34.837 32 26C32 18 16 0 16 0Z" fill="url(#dropGrad)"/>
        <defs><linearGradient id="dropGrad" x1="0" y1="0" x2="32" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#7C3AED"/><stop offset="1" stopColor="#06B6D4"/></linearGradient></defs>
      </svg>
      {showText && <span className={`text-${textSize} font-bold tracking-tight`}>Drops</span>}
    </div>
  );
}
