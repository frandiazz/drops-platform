import { memo } from 'react';

const GlassCard = memo(function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-8 sm:p-10 ${className}`}>
      {children}
    </div>
  );
});

export default GlassCard;
