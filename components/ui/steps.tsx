import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Steps({ 
  children, 
  className 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-0", className)}>
      {children}
    </div>
  );
}

export function Step({ 
  children, 
  className,
  number
}: { 
  children: ReactNode;
  className?: string;
  number: number;
}) {
  return (
    <div className={cn("relative pl-8 pb-8 last:pb-0", className)}>
      {/* Number circle */}
      <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black text-sm font-medium">
        {number}
      </div>
      
      {/* Vertical line */}
      <div className="absolute left-3 top-6 bottom-0 w-px bg-gray-600 last:hidden" />
      
      {/* Content */}
      <div className="text-white">
        {children}
      </div>
    </div>
  );
}