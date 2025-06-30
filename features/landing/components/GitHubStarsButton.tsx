'use client';
 
import * as React from 'react';
import { Star } from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useInView,
  type HTMLMotionProps,
  type SpringOptions,
  type UseInViewOptions,
} from 'framer-motion';
 
import { cn } from '@/lib/utils';
import { SlidingNumber } from '@/components/animate-ui/text/sliding-number';
import { buttonVariants } from '@/components/ui/button';
 
type FormatNumberResult = { number: string[]; unit: string };
 
function formatNumber(num: number, formatted: boolean): FormatNumberResult {
  if (formatted) {
    if (num < 1000) {
      return { number: [num.toString()], unit: '' };
    }
    const units = ['k', 'M', 'B', 'T'];
    let unitIndex = 0;
    let n = num;
    while (n >= 1000 && unitIndex < units.length) {
      n /= 1000;
      unitIndex++;
    }
    const finalNumber = Math.floor(n).toString();
    return { number: [finalNumber], unit: units[unitIndex - 1] ?? '' };
  } else {
    return { number: num.toLocaleString('en-US').split(','), unit: '' };
  }
}
 
type GitHubStarsButtonProps = HTMLMotionProps<'a'> & {
  username: string;
  repo: string;
  transition?: SpringOptions;
  formatted?: boolean;
  inView?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
  inViewOnce?: boolean;
};
 
function GitHubStarsButton({
  ref,
  username,
  repo,
  transition = { stiffness: 90, damping: 50 },
  formatted = false,
  inView = false,
  inViewOnce = true,
  inViewMargin = '0px',
  className,
  ...props
}: GitHubStarsButtonProps) {
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, transition);
  const motionNumberRef = React.useRef(0);
  const isCompletedRef = React.useRef(false);
  const [, forceRender] = React.useReducer((x) => x + 1, 0);
  const [stars, setStars] = React.useState(0);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [displayParticles, setDisplayParticles] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
 
  const repoUrl = React.useMemo(
    () => `https://github.com/${username}/${repo}`,
    [username, repo],
  );
 
  React.useEffect(() => {
    fetch(`https://api.github.com/repos/${username}/${repo}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [username, repo]);
 
  const handleDisplayParticles = React.useCallback(() => {
    setDisplayParticles(true);
    setTimeout(() => setDisplayParticles(false), 1500);
  }, []);
 
  const localRef = React.useRef<HTMLAnchorElement>(null);
  React.useImperativeHandle(ref, () => localRef.current as HTMLAnchorElement);
 
  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isComponentInView = !inView || inViewResult;
 
  React.useEffect(() => {
    const unsubscribe = springVal.on('change', (latest: number) => {
      const newValue = Math.round(latest);
      if (motionNumberRef.current !== newValue) {
        motionNumberRef.current = newValue;
        forceRender();
      }
      if (stars !== 0 && newValue >= stars && !isCompletedRef.current) {
        isCompletedRef.current = true;
        setIsCompleted(true);
        handleDisplayParticles();
      }
    });
    return () => unsubscribe();
  }, [springVal, stars, handleDisplayParticles]);
 
  React.useEffect(() => {
    if (stars > 0 && isComponentInView) motionVal.set(stars);
  }, [motionVal, stars, isComponentInView]);
 
  const fillPercentage = Math.min(100, (motionNumberRef.current / stars) * 100);
  const formattedResult = formatNumber(motionNumberRef.current, formatted);
  const ghostFormattedNumber = formatNumber(stars, formatted);
 
  const renderNumberSegments = (
    segments: string[],
    unit: string,
    isGhost: boolean,
  ) => (
    <span
      className={cn(
        'flex items-center gap-px',
        isGhost ? 'invisible' : 'absolute top-0 left-0',
      )}
    >
      {segments.map((segment, index) => (
        <React.Fragment key={index}>
          {Array.from(segment).map((digit, digitIndex) => (
            <SlidingNumber key={`${index}-${digitIndex}`} number={+digit} />
          ))}
        </React.Fragment>
      ))}
 
      {formatted && unit && <span className="leading-[1]">{unit}</span>}
    </span>
  );
 
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      handleDisplayParticles();
      setTimeout(() => window.open(repoUrl, '_blank'), 500);
    },
    [handleDisplayParticles, repoUrl],
  );
 
  if (isLoading) return null;
 
  return (
    <motion.a
      ref={localRef}
      href={repoUrl}
      rel="noopener noreferrer"
      target="_blank"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleClick}
      className={cn(
        buttonVariants({ variant: "default", size: "default" }),
        "cursor-pointer",
        className,
      )}
      {...props}
    >
      <svg role="img" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
      <span>GitHub Stars</span>
      <div className="relative inline-flex size-[18px] shrink-0">
        <Star
          className="fill-zinc-300 text-zinc-300"
          size={18}
          aria-hidden="true"
        />
        <Star
          className="absolute top-0 left-0 text-zinc-300 fill-zinc-300"
          aria-hidden="true"
          style={{
            clipPath: `inset(${100 - (isCompleted ? fillPercentage : fillPercentage - 10)}% 0 0 0)`,
          }}
        />
        <AnimatePresence>
          {displayParticles && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(113,113,122,0.4) 0%, rgba(113,113,122,0) 70%)',
                }}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: [1.2, 1.8, 1.2], opacity: [0, 0.3, 0] }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: '0 0 10px 2px rgba(113,113,122,0.6)' }}
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-zinc-500"
                  initial={{ x: '50%', y: '50%', scale: 0, opacity: 0 }}
                  animate={{
                    x: `calc(50% + ${Math.cos((i * Math.PI) / 3) * 30}px)`,
                    y: `calc(50% + ${Math.sin((i * Math.PI) / 3) * 30}px)`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.05,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
      <span className="relative inline-flex">
        {renderNumberSegments(
          ghostFormattedNumber.number,
          ghostFormattedNumber.unit,
          true,
        )}
        {renderNumberSegments(
          formattedResult.number,
          formattedResult.unit,
          false,
        )}
      </span>
    </motion.a>
  );
}
 
export { GitHubStarsButton, type GitHubStarsButtonProps };