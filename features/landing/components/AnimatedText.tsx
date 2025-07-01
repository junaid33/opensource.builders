'use client';

import { useState, useEffect } from 'react';

interface AnimatedTextProps {
  words?: string[];
  typingSpeed?: number;
  erasingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export default function AnimatedText({
  words = [
    'Shopify',
    'Notion',
    'Tailwind Plus',
    'v0',
    'Cursor',
    'Figma',
    'Slack',
    'Zoom'
  ],
  typingSpeed = 100,
  erasingSpeed = 50,
  pauseDuration = 2000,
  className = ''
}: AnimatedTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (isTyping && !isDeleting) {
        // Typing phase
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          // Finished typing, pause then start deleting
          setTimeout(() => {
            setIsDeleting(true);
            setIsTyping(false);
          }, pauseDuration);
        }
      } else if (isDeleting) {
        // Deleting phase
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setIsTyping(true);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? erasingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentWordIndex, isTyping, isDeleting, words, typingSpeed, erasingSpeed, pauseDuration]);

  return (
    <span className={`inline-block text-slate-500 dark:text-slate-300  ${className}`}>
      {currentText}
      <span className="animate-pulse text-gray-500">|</span>
    </span>
  );
}