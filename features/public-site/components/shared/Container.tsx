import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
}

export function Container({ children, wide, className }: ContainerProps) {
  return (
    <div
      className={cn(
        'w-[90%] mx-auto',
        wide ? 'max-w-[800px]' : 'max-w-[600px]',
        className
      )}
    >
      {children}
    </div>
  );
}
