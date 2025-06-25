'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { cn } from '@/lib/utils'
import useMeasure from 'react-use-measure'
import ToolLogo from './ToolLogo'

// Popular proprietary software with their domains for favicon fallback
const proprietarySoftware = [
  { name: 'Shopify', domain: 'shopify.com', svg: null },
  { name: 'Notion', domain: 'notion.so', svg: null },
  { name: 'Airtable', domain: 'airtable.com', svg: null },
  { name: 'TeamViewer', domain: 'teamviewer.com', svg: null },
  { name: 'Slack', domain: 'slack.com', svg: null },
  { name: 'Heroku', domain: 'heroku.com', svg: null },
  { name: 'Google Analytics', domain: 'analytics.google.com', svg: null },
  { name: 'GitHub', domain: 'github.com', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>` },
  { name: '1Password', domain: '1password.com', svg: null },
  { name: 'Google Docs', domain: 'docs.google.com', svg: null },
  { name: 'Amazon S3', domain: 'aws.amazon.com', svg: null },
  { name: 'Salesforce', domain: 'salesforce.com', svg: null },
  { name: 'Zendesk', domain: 'zendesk.com', svg: null },
  { name: 'Google Drive', domain: 'drive.google.com', svg: null },
  { name: 'Trello', domain: 'trello.com', svg: null },
  { name: 'Intercom', domain: 'intercom.com', svg: null },
  { name: 'Facebook', domain: 'facebook.com', svg: null },
  { name: 'Zapier', domain: 'zapier.com', svg: null },
  { name: 'YouTube', domain: 'youtube.com', svg: null },
  { name: 'Algolia', domain: 'algolia.com', svg: null },
  { name: 'Typeform', domain: 'typeform.com', svg: null },
  { name: 'Zoom', domain: 'zoom.us', svg: null },
  { name: 'Instagram', domain: 'instagram.com', svg: null },
  { name: 'NPM', domain: 'npmjs.com', svg: null },
  { name: 'Auth0', domain: 'auth0.com', svg: null },
  { name: 'Jira', domain: 'atlassian.com', svg: null },
  { name: 'HubSpot', domain: 'hubspot.com', svg: null },
  { name: 'Vercel', domain: 'vercel.com', svg: null },
  { name: 'Medium', domain: 'medium.com', svg: null },
  { name: 'Figma', domain: 'figma.com', svg: null },
  { name: 'Firebase', domain: 'firebase.google.com', svg: null },
  { name: 'Twilio', domain: 'twilio.com', svg: null },
]

// InfiniteSlider component implementation
function InfiniteSlider({
  children,
  gap = 16,
  speed = 25,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: {
  children: React.ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
}) {
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let controls;
    const size = direction === 'horizontal' ? width : height;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;
    
    // Calculate duration based on speed (higher speed = lower duration)
    const duration = contentSize / currentSpeed;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration: duration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return controls?.stop;
  }, [
    key,
    translation,
    currentSpeed,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ]);

  const hoverProps = speedOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentSpeed(speedOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentSpeed(speed);
        },
      }
    : {};

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === 'horizontal'
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// Progressive blur effect for the edges
function ProgressiveBlur({
  direction = 'left',
  blurIntensity = 1,
  className,
}: {
  direction?: 'left' | 'right';
  blurIntensity?: number;
  className?: string;
}) {
  const gradientDirection = direction === 'left' ? 'to right' : 'to left';
  
  return (
    <div
      className={cn('absolute inset-y-0 w-20 pointer-events-none', className)}
      style={{
        [direction]: 0,
        background: `linear-gradient(${gradientDirection}, rgba(248, 250, 252, ${blurIntensity}) 0%, rgba(248, 250, 252, 0) 100%)`,
      }}
    />
  );
}

function SoftwareLogo({ software, onClick }: { 
  software: typeof proprietarySoftware[0]
  onClick: () => void 
}) {
  // Create a mock resolvedLogo for the software
  const resolvedLogo = software.svg ? {
    type: 'svg' as const,
    data: software.svg,
    verified: true
  } : {
    type: 'favicon' as const,
    data: `https://www.google.com/s2/favicons?domain=${software.domain}&sz=32`,
    domain: software.domain,
    verified: true
  }

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 px-4 py-3 transition-opacity hover:opacity-80 cursor-pointer"
    >
      <div className="w-10 h-10 flex items-center justify-center">
        <ToolLogo 
          name={software.name}
          resolvedLogo={resolvedLogo}
          size={32}
          className="text-gray-700"
        />
      </div>
      <span className="font-medium text-xs text-gray-600 whitespace-nowrap">
        {software.name}
      </span>
    </div>
  )
}

interface ProprietarySoftwareProps {
  onSoftwareSelect?: (software: string) => void
}

export default function ProprietarySoftware({ onSoftwareSelect }: ProprietarySoftwareProps) {
  const handleSoftwareClick = (software: string) => {
    onSoftwareSelect?.(software)
  }

  return (
    <section className="bg-slate-50 overflow-hidden py-12">
      <div className="relative m-auto max-w-7xl px-6">
        <div className="flex flex-col items-center">
          <div className="mb-8">
            <p className="font-handwriting text-3xl text-indigo-500 text-center">Popular proprietary software</p>
            <p className="text-sm text-gray-600 text-center mt-2">Click any software to see open source alternatives</p>
          </div>
          <div className="relative py-6 w-full">
            <InfiniteSlider
              speedOnHover={20}
              speed={40}
              gap={8}
              className="py-2"
            >
              {proprietarySoftware.map((software, index) => (
                <SoftwareLogo
                  key={`${software.name}-${index}`}
                  software={software}
                  onClick={() => handleSoftwareClick(software.name)}
                />
              ))}
            </InfiniteSlider>

            <ProgressiveBlur
              direction="left"
              blurIntensity={0.9}
            />
            <ProgressiveBlur
              direction="right"
              blurIntensity={0.9}
            />
          </div>
        </div>
      </div>
    </section>
  )
}