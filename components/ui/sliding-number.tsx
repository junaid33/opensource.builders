'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SlidingNumberProps {
  number: number;
}

export function SlidingNumber({ number }: SlidingNumberProps) {
  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={number}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="inline-block"
        >
          {number}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}