import { memo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const BackLink = memo(function BackLink({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8 py-2">
      <ArrowLeft className="w-4 h-4" /> Volver
    </Link>
  );
});

export default BackLink;
