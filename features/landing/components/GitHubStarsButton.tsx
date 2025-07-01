'use client';
 
import * as React from 'react';
import { Star } from 'lucide-react';
import {
  motion,
  AnimatePresence,
  type HTMLMotionProps,
} from 'framer-motion';
 
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

type GitHubStarsButtonProps = HTMLMotionProps<'a'> & {
  username: string;
  repo: string;
  formatted?: boolean;
};

function GitHubStarsButton({
  ref,
  username,
  repo,
  formatted = false,
  className,
  ...props
}: GitHubStarsButtonProps) {
  const [stars, setStars] = React.useState(1255);
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

  const formatStarCount = (count: number) => {
    if (formatted) {
      if (count < 1000) return count.toString();
      if (count < 1000000) return `${Math.floor(count / 1000)}k`;
      return `${Math.floor(count / 1000000)}M`;
    }
    return count.toLocaleString('en-US');
  };
  
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
          className="fill-muted-foreground text-muted-foreground"
          size={18}
          aria-hidden="true"
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
        {formatStarCount(stars)}
      </span>
    </motion.a>
  );
}
 
export { GitHubStarsButton, type GitHubStarsButtonProps };