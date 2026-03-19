'use client';

import { cn } from '@/lib/utils';
import styles from './ShinyText.module.css';

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
  disabled?: boolean;
}

export function ShinyText({
  text,
  className = '',
  speed = 5,
  disabled = false,
}: ShinyTextProps) {
  return (
    <span
      className={cn(styles.shinyText, disabled && styles.shinyTextDisabled, className)}
      style={{ animationDuration: `${speed}s` }}
    >
      {text}
    </span>
  );
}
