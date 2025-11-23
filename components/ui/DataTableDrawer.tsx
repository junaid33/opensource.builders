"use client"

import * as DrawerPrimitives from "@radix-ui/react-dialog"
import * as TabsPrimitives from "@radix-ui/react-tabs"
import * as SelectPrimitives from "@radix-ui/react-select"
import { RiCloseLine, RiExpandUpDownLine, RiCheckLine, RiArrowUpSLine, RiArrowDownSLine } from "@remixicon/react"
import { Download, File, Trash2, CircleCheck, Github, Info, Folder, Lightbulb, ChevronDown, ChevronLeft, ChevronRight, Nut, Search, X, Package, Star, ExternalLink } from "lucide-react"
import React from "react"
import {
  motion,
  AnimatePresence,
  type HTMLMotionProps,
} from 'framer-motion'
import { buttonVariants } from '@/components/ui/button'
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { request } from 'graphql-request'
import debounce from 'lodash.debounce'
// Using custom Select components defined below for consistent styling
import { LogoIcon as OpenfrontIcon } from "@/components/OpenFrontIcon"
import { LogoIcon as OpenshipIcon } from "@/components/OpenShipIcon"
import { NextKeystoneIcon } from "@/components/NextKeystoneIcon"
import { LogoIcon } from "@/features/dashboard/components/Logo"
import ToolIcon from '@/components/ToolIcon'
import BuildStatsCard from './BuildStatsCard'
import { useCapabilitiesConfig, useCapabilityActions, useLastPinnedTool, useBuildStatsCardState } from '@/hooks/use-capabilities-config'
import type { SelectedCapability } from '@/hooks/use-capabilities-config'

// GraphQL query for getting all open source applications
const GET_ALL_OPEN_SOURCE_APPS = `
  query GetAllOpenSourceApps {
    openSourceApplications(
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      repositoryUrl
      websiteUrl
      simpleIconSlug
      simpleIconColor
      capabilities {
        capability {
          id
          name
          slug
          description
          category
          complexity
        }
        implementationNotes
        githubPath
        documentationUrl
        implementationComplexity
        isActive
      }
    }
  }
`

interface SearchResult {
  openSourceApplications: {
    id: string
    name: string
    slug: string
    description?: string
    repositoryUrl?: string
    websiteUrl?: string
    simpleIconSlug?: string
    simpleIconColor?: string
    capabilities: {
      capability: {
        id: string
        name: string
        slug: string
        description?: string
        category?: string
        complexity?: string
      }
      implementationNotes?: string
      githubPath?: string
      documentationUrl?: string
      implementationComplexity?: string
      isActive?: boolean
    }[]
  }[]
}

// Removed - using SelectedCapability from hooks/use-capabilities-config

// Placeholder data types
interface Transaction {
  id: string
  merchant: string
  amount: number
  transaction_date: string
  expense_status: string
  category: string
}

interface DataTableDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: Transaction
  apps: any[]
  selectedCapabilities: SelectedCapability[]
  onSelectedCapabilitiesChange?: (capabilities: SelectedCapability[]) => void // Made optional since we use provider
}

const categories = [
  "Office Supplies",
  "Travel", 
  "Software",
  "Hardware",
  "Marketing",
  "Training",
  "Other"
]

const expense_statuses = [
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
]

// Placeholder activity data
const activity = [
  {
    id: 1,
    type: "submitted",
    person: { name: "Emily Ross" },
    date: "2d ago",
    dateTime: "2024-07-13T10:32",
  },
  {
    id: 2,
    type: "added", 
    person: { name: "Emily Ross" },
    date: "1d ago",
    dateTime: "2024-07-14T11:03",
  },
  {
    id: 3,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=1887&auto=format&fit=facearea&&facepad=2&w=256&h=256",
    },
    comment:
      'Re-classified expense from category "Consultation services" to "Coffee shop"',
    date: "3d ago",
    dateTime: "2023-01-23T15:56",
  },
  {
    id: 4,
    type: "approved",
    person: { name: "Maxime River" },
    date: "10min ago",
    dateTime: "2024-07-15T09:01",
  },
]

// Placeholder data
const defaultTransaction: Transaction = {
  id: "1",
  merchant: "FedEx",
  amount: 24.99,
  transaction_date: "2024-01-15T14:30:00",
  expense_status: "approved",
  category: "Office Supplies"
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

// Badge component
function CustomBadge({ variant, children }: { variant: string, children: React.ReactNode }) {
  const baseStyles = "inline-flex items-center gap-x-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
  
  let variantStyles = ""
  switch (variant) {
    case "approved":
      variantStyles = "bg-emerald-50 text-emerald-900 ring-emerald-600/30 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20"
      break
    case "pending":
      variantStyles = "bg-orange-50 text-orange-900 ring-orange-600/30 dark:bg-orange-400/10 dark:text-orange-500 dark:ring-orange-400/20"
      break
    case "rejected":
      variantStyles = "bg-rose-50 text-rose-900 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-500 dark:ring-rose-400/20"
      break
    default:
      variantStyles = "bg-blue-50 text-blue-900 ring-blue-500/30 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30"
  }
  
  const [copied, setCopied] = React.useState(false)

  const handleCopyPrompt = async () => {
    const prompt = "Select a starter, then add capabilities to generate a copy-ready AI prompt."
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (_) {
      setCopied(false)
    }
  }

  return (
    <span className={cn(baseStyles, variantStyles)}>
      {children}
    </span>
  )
}

// Button component
function CustomButton({ variant = "primary", children, className, ...props }: { 
  variant?: "primary" | "secondary" | "ghost"
  children: React.ReactNode
  className?: string
  [key: string]: any
}) {
  const baseStyles = "relative inline-flex items-center justify-center whitespace-nowrap rounded-md border px-3 py-2 text-center font-medium shadow-sm transition-all duration-100 ease-in-out text-base sm:text-sm disabled:pointer-events-none disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
  
  let variantStyles = ""
  switch (variant) {
    case "primary":
      variantStyles = "border-transparent text-white dark:text-white bg-blue-500 dark:bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:dark:bg-gray-800 disabled:dark:text-gray-600"
      break
    case "secondary":
      variantStyles = "border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/30 disabled:text-gray-400 disabled:dark:text-gray-600"
      break
    case "ghost":
      variantStyles = "shadow-none border-transparent text-gray-900 dark:text-gray-50 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800/80 disabled:text-gray-400 disabled:dark:text-gray-600"
      break
  }
  
  return (
    <button className={cn(baseStyles, variantStyles, className)} {...props}>
      {children}
    </button>
  )
}

// Input component
function CustomInput({ className, ...props }: { className?: string, [key: string]: any }) {
  return (
    <input
      className={cn(
        "relative block w-full appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm",
        "border-gray-300 dark:border-gray-800",
        "text-gray-900 dark:text-gray-50",
        "placeholder-gray-400 dark:placeholder-gray-500",
        "bg-background",
        "disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400",
        "disabled:dark:border-gray-700 disabled:dark:bg-gray-800 disabled:dark:text-gray-500",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-offset-0 dark:focus:border-blue-500 dark:focus:ring-blue-400/20",
        className
      )}
      {...props}
    />
  )
}

// Select components
function CustomSelect({ children, ...props }: { children: React.ReactNode, [key: string]: any }) {
  return <SelectPrimitives.Root {...props}>{children}</SelectPrimitives.Root>
}

function CustomSelectTrigger({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) {
  return (
    <SelectPrimitives.Trigger
      className={cn(
        "group/trigger flex w-full select-none items-center justify-between gap-2 truncate rounded-md border px-3 py-2 shadow-sm outline-none transition text-base sm:text-sm",
        "border-gray-300 dark:border-gray-800",
        "text-gray-900 dark:text-gray-50",
        "data-[placeholder]:text-gray-500 data-[placeholder]:dark:text-gray-500",
        "bg-background",
        "hover:bg-gray-50 hover:dark:bg-gray-950/50",
        "data-[disabled]:bg-gray-100 data-[disabled]:text-gray-400",
        "data-[disabled]:dark:border-gray-700 data-[disabled]:dark:bg-gray-800 data-[disabled]:dark:text-gray-500",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-offset-0 dark:focus:border-blue-500 dark:focus:ring-blue-400/20",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <SelectPrimitives.Icon asChild>
        <RiExpandUpDownLine className="size-4 shrink-0 text-gray-400 dark:text-gray-600 group-data-[disabled]/trigger:text-gray-300 group-data-[disabled]/trigger:dark:text-gray-600" />
      </SelectPrimitives.Icon>
    </SelectPrimitives.Trigger>
  )
}

function CustomSelectContent({ children, ...props }: { children: React.ReactNode, [key: string]: any }) {
  return (
    <SelectPrimitives.Portal>
      <SelectPrimitives.Content
        className={cn(
          "relative z-50 overflow-hidden rounded-md border shadow-xl shadow-black/[2.5%]",
          "min-w-[calc(var(--radix-select-trigger-width)-2px)] max-w-[95vw]",
          "max-h-[--radix-select-content-available-height]",
          "bg-background",
          "text-gray-900 dark:text-gray-50",
          "border-gray-200 dark:border-gray-800",
          "will-change-[transform,opacity]",
          "data-[state=closed]:animate-hide",
          "data-[side=bottom]:animate-slideDownAndFade data-[side=left]:animate-slideLeftAndFade data-[side=right]:animate-slideRightAndFade data-[side=top]:animate-slideUpAndFade"
        )}
        sideOffset={8}
        position="popper"
        collisionPadding={10}
        {...props}
      >
        <SelectPrimitives.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
          <RiArrowUpSLine className="size-3 shrink-0" aria-hidden="true" />
        </SelectPrimitives.ScrollUpButton>
        <SelectPrimitives.Viewport className="p-1">
          {children}
        </SelectPrimitives.Viewport>
        <SelectPrimitives.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
          <RiArrowDownSLine className="size-3 shrink-0" aria-hidden="true" />
        </SelectPrimitives.ScrollDownButton>
      </SelectPrimitives.Content>
    </SelectPrimitives.Portal>
  )
}

function CustomSelectItem({ children, ...props }: { children: React.ReactNode, [key: string]: any }) {
  return (
    <SelectPrimitives.Item
      className={cn(
        "grid cursor-pointer grid-cols-[1fr_20px] gap-x-2 rounded px-3 py-2 outline-none transition-colors data-[state=checked]:font-semibold sm:text-sm",
        "text-gray-900 dark:text-gray-50",
        "data-[disabled]:pointer-events-none data-[disabled]:text-gray-400 data-[disabled]:hover:bg-none dark:data-[disabled]:text-gray-600",
        "focus-visible:bg-gray-100 focus-visible:dark:bg-gray-900",
        "hover:bg-gray-100 hover:dark:bg-gray-900"
      )}
      {...props}
    >
      <SelectPrimitives.ItemText className="flex-1 truncate text-left">
        {children}
      </SelectPrimitives.ItemText>
      <SelectPrimitives.ItemIndicator>
        <RiCheckLine className="size-5 shrink-0 text-gray-800 dark:text-gray-200" aria-hidden="true" />
      </SelectPrimitives.ItemIndicator>
    </SelectPrimitives.Item>
  )
}

// Copied GitHubStarsButton component (adapted for star buttons)
type StarButtonProps = HTMLMotionProps<'a'> & {
  username: string;
  repo: string;
  formatted?: boolean;
};

function StarButton({
  ref,
  username,
  repo,
  formatted = false,
  className,
  ...props
}: StarButtonProps) {
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
        buttonVariants({ variant: "default", size: "sm" }),
        "cursor-pointer h-8 px-2 text-xs",
        className,
      )}
      {...props}
    >
      <div className="relative inline-flex size-[12px] shrink-0">
        <Star
          className="fill-muted-foreground text-muted-foreground"
          size={12}
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

// Tabs components
function CustomTabs({ children, ...props }: { children: React.ReactNode, [key: string]: any }) {
  return <TabsPrimitives.Root {...props}>{children}</TabsPrimitives.Root>
}

function CustomTabsList({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <TabsPrimitives.List className={cn("px-6", className)}>
      <div className="flex items-center justify-start border-b border-gray-200 dark:border-gray-800">
        {children}
      </div>
    </TabsPrimitives.List>
  )
}

function CustomTabsTrigger({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) {
  return (
    <TabsPrimitives.Trigger
      className={cn(
        "-mb-px items-center justify-center whitespace-nowrap border-b-2 border-transparent px-4 pb-3 text-sm font-medium transition-all",
        "text-gray-500 dark:text-gray-500",
        "hover:text-gray-700 hover:dark:text-gray-400",
        "hover:border-gray-300 hover:dark:border-gray-400",
        "data-[state=active]:border-gray-900 data-[state=active]:text-gray-900",
        "data-[state=active]:dark:border-gray-50 data-[state=active]:dark:text-gray-50",
        "disabled:pointer-events-none",
        "disabled:text-gray-300 disabled:dark:text-gray-700",
        "focus:outline-none focus:ring-0",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitives.Trigger>
  )
}

function CustomTabsContent({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) {
  return (
    <TabsPrimitives.Content
      className={cn("outline-none focus:ring-0", className)}
      {...props}
    >
      {children}
    </TabsPrimitives.Content>
  )
}

// Label component
function CustomLabel({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) {
  return (
    <label className={cn("text-sm font-medium text-gray-900 dark:text-gray-50", className)} {...props}>
      {children}
    </label>
  )
}

// Textarea component
function CustomTextarea({ className, ...props }: { className?: string, [key: string]: any }) {
  return (
    <textarea
      className={cn(
        "relative block w-full appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm min-h-[100px] resize-y",
        "border-gray-300 dark:border-gray-800",
        "text-gray-900 dark:text-gray-50",
        "placeholder-gray-400 dark:placeholder-gray-500", 
        "bg-background",
        "disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400",
        "disabled:dark:border-gray-700 disabled:dark:bg-gray-800 disabled:dark:text-gray-500",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-offset-0 dark:focus:border-blue-500 dark:focus:ring-blue-400/20",
        className
      )}
      {...props}
    />
  )
}

function DataTableDrawerFeed() {
  return (
    <>
      <ul role="list" className="space-y-6">
        {activity.map((activityItem, activityItemindex) => (
          <li key={activityItem.id} className="relative flex gap-x-4">
            <div
              className={cn(
                activityItemindex === activity.length - 1 ? "h-6" : "-bottom-6",
                "absolute left-0 top-0 flex w-6 justify-center",
              )}
            >
              <span className="w-px bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
            </div>
            {activityItem.type === "submitted" ||
              activityItem.type === "added" ? (
              <>
                <div className="relative flex size-6 flex-none items-center justify-center bg-background">
                  <div className="size-1.5 rounded-full bg-muted ring-1 ring-border" />
                </div>
                <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500">
                  <span className="font-medium text-gray-900 dark:text-gray-50">
                    {activityItem.person.name}
                  </span>
                  {activityItem.type === "submitted" ? (
                    <> {activityItem.type} expense</>
                  ) : (
                    <> {activityItem.type} receipt to expense</>
                  )}
                </p>
                <time
                  dateTime={activityItem.dateTime}
                  className="flex-none py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500"
                >
                  {activityItem.date}
                </time>
              </>
            ) : activityItem.type === "commented" ? (
              <>
                <Image
                  alt="Profile Picture"
                  width={50}
                  height={50}
                  src={activityItem.person.imageUrl || ""}
                  className="relative mt-3 size-6 flex-none rounded-full bg-gray-50"
                />
                <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-300 dark:ring-gray-800">
                  <div className="flex justify-between gap-x-4">
                    <div className="py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500">
                      <span className="font-medium text-gray-900 dark:text-gray-50">
                        {activityItem.person.name}
                      </span>{" "}
                      commented
                    </div>
                    <time
                      dateTime={activityItem.dateTime}
                      className="flex-none py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500"
                    >
                      {activityItem.date}
                    </time>
                  </div>
                  <p className="text-sm leading-6 text-gray-500">
                    {activityItem.comment}
                  </p>
                </div>
              </>
            ) : activityItem.type === "approved" ? (
              <>
                <div className="relative flex size-6 flex-none items-center justify-center bg-white dark:bg-[#090E1A]">
                  <CircleCheck
                    className="size-5 text-blue-500 dark:text-blue-500"
                    aria-hidden="true"
                  />
                </div>
                <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500">
                  <span className="font-medium text-gray-900 dark:text-gray-50">
                    {activityItem.person.name}
                  </span>{" "}
                  {activityItem.type} the audit.
                </p>
                <time
                  dateTime={activityItem.dateTime}
                  className="flex-none py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500"
                >
                  {activityItem.date}
                </time>
              </>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="flex gap-x-4">
        <Image
          alt="Profile Picture"
          width={50}
          height={50}
          src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1887&auto=format&fit=facearea&&facepad=2&w=256&h=256"
          className="size-6 flex-none rounded-full bg-gray-50"
        />
        <form action="#" className="relative flex-auto">
          <CustomLabel className="sr-only">
            Add your comment
          </CustomLabel>
          <CustomTextarea
            placeholder="Add your comment..."
            rows={4}
          />
        </form>
      </div>
    </>
  )
}

export function DataTableDrawer({
  open,
  onOpenChange,
  data = defaultTransaction,
  apps,
  selectedCapabilities, // This comes from the provider now
  onSelectedCapabilitiesChange, // Optional fallback
}: DataTableDrawerProps) {
  const status = expense_statuses.find(
    (item) => item.value === data?.expense_status,
  )
  const { config } = useCapabilitiesConfig()
  const { addCapability, removeCapability } = useCapabilityActions()
  const lastPinnedToolId = useLastPinnedTool()
  
  // Use capabilities from provider, fallback to prop
  const actualSelectedCapabilities = config.selectedCapabilities.length > 0 ? config.selectedCapabilities : selectedCapabilities

  // Starter templates (from legacy Build page)
  const starterTemplates = [
    { 
      id: "1", 
      name: "Next.js + Keystone Starter", 
      description: "Full-stack template with admin", 
      source: "https://github.com/junaid33/next-keystone-starter",
      info: "A full-stack Next.js application combining Next.js (App Router) with KeystoneJS as a headless CMS. It features GraphQL API, custom admin dashboard, authentication, database integration with PostgreSQL, and role-based permissions. Built with modern TypeScript architecture and includes comprehensive documentation. This starter was used to build opensource.builders, Openfront, and Openship - all production applications demonstrating its capabilities."
    },
    { 
      id: "openfront", 
      name: "Openfront", 
      description: "Open source e-commerce platform", 
      source: "https://github.com/openshiporg/openfront",
      info: "Openfront is built off of this same starter, but it's a Shopify alternative with comprehensive e-commerce features including product management, order processing, payment handling, and shipping integration."
    },
    { 
      id: "openship", 
      name: "Openship", 
      description: "Order routing & fulfillment platform", 
      source: "https://github.com/openshiporg/openship",
      info: "Openship is built off the same Next.js + Keystone starter with additional order routing and fulfillment automation capabilities for dropshipping and multi-vendor marketplaces."
    },
    { 
      id: "opensource-builders", 
      name: "opensource.builders", 
      description: "Open source tool discovery platform", 
      source: "https://github.com/junaid33/opensource.builders",
      info: "opensource.builders is built off the same Next.js + Keystone starter and helps developers discover and compare open source alternatives to proprietary tools."
    },
    { 
      id: "byos", 
      name: "Bring Your Own Starter", 
      description: "Start with what you have", 
      source: null,
      info: "Use your existing codebase as the foundation. Perfect for integrating powerful features from open source tools into your current project without starting from scratch."
    },
  ] as const
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>("1")
  const { updateBuildStatsCard } = useBuildStatsCardState()
  const [copied, setCopied] = React.useState(false)
  const [githubMcpEnabled, setGithubMcpEnabled] = React.useState(true)
  const [showThankYouDialog, setShowThankYouDialog] = React.useState(false)

  const handleCapabilitySelect = (capability: any, toolId: string, toolName: string, toolIcon?: string, toolColor?: string, toolRepo?: string) => {
    const compositeId = `${toolId}-${capability.capability.id}`
    const selectedCapability: SelectedCapability = {
      id: compositeId,
      capabilityId: capability.capability.id,
      toolId: toolId,
      name: capability.capability.name,
      description: capability.capability.description,
      category: capability.capability.category,
      complexity: capability.capability.complexity,
      toolName,
      toolIcon,
      toolColor,
      toolRepo,
      implementationNotes: capability.implementationNotes,
      githubPath: capability.githubPath,
      documentationUrl: capability.documentationUrl
    }

    const isAlreadySelected = selectedCapabilities.some(f => f.id === compositeId)
    if (isAlreadySelected) {
      onSelectedCapabilitiesChange(selectedCapabilities.filter(f => f.id !== compositeId))
    } else {
      onSelectedCapabilitiesChange([...selectedCapabilities, selectedCapability])
    }
  }

  const handleCapabilityRemove = (capabilityId: string) => {
    removeCapability(capabilityId)
  }


  // Group capabilities by tool/application
  const groupedCapabilities = React.useMemo(() => {
    const groups: {[key: string]: SelectedCapability[]} = {}
    if (actualSelectedCapabilities) {
      actualSelectedCapabilities.forEach(capability => {
        if (!groups[capability.toolName]) {
          groups[capability.toolName] = []
        }
        groups[capability.toolName].push(capability)
      })
    }
    return groups
  }, [actualSelectedCapabilities])


  const generatePromptText = () => {
    // Get the current template and capabilities using the same logic as the UI
    const currentTemplate = starterTemplates.find(t => t.id === selectedTemplate)
    
    if (!currentTemplate && (!actualSelectedCapabilities || actualSelectedCapabilities.length === 0)) {
      return "Select a starter and add capabilities to generate your AI prompt."
    }

    let prompt = ""
    
    // Add starter section (reusing the same logic as the UI)
    if (currentTemplate) {
      prompt += `Use the ${currentTemplate.name} as your starting point. This template provides ${currentTemplate.description.toLowerCase()} and will serve as the foundation for your application.\n\n`
      
      if (currentTemplate.id === '1') {
        prompt += `Please git clone this repo: git clone https://github.com/junaid33/next-keystone-starter.git\n\nThen read the README.md and other relevant markdown files to get a general sense of how this full-stack Next.js application works. It's a Next.js application with a Keystone admin dashboard built-in, a GraphQL API, role-based permissions, and is designed with feature slices architecture. Review the /features directory structure and the project's architecture documentation.\n\n`
      }
    }
    
    // Group capabilities by name (same logic as the UI)
    const capabilitiesByName: {[capabilityName: string]: SelectedCapability[]} = {}
    actualSelectedCapabilities?.forEach(capability => {
      if (!capabilitiesByName[capability.name]) {
        capabilitiesByName[capability.name] = []
      }
      capabilitiesByName[capability.name].push(capability)
    })
    
    // Add capability sections (simplified text version of the UI)
    Object.entries(capabilitiesByName).forEach(([capabilityName, implementations]) => {
      prompt += `Implement ${capabilityName}:\n\n`
      
      implementations.forEach((implementation) => {
        if (implementations.length > 1) {
          prompt += `${implementation.toolName} approach:\n`
        }
        
        if (implementation.description) {
          prompt += `${implementation.description}\n\n`
        }
        
        if (implementation.githubPath && implementation.toolRepo) {
          if (githubMcpEnabled) {
            prompt += `Use the GitHub MCP to access the ${implementation.toolName} repository at ${implementation.toolRepo}, then analyze ${implementation.githubPath} to understand the implementation.\n\n`
          } else {
            prompt += `Look up ${implementation.githubPath} in the ${implementation.toolName} repository on GitHub for implementation details.\n\n`
          }
        }
        
        if (implementation.documentationUrl) {
          prompt += `Reference the documentation at: ${implementation.documentationUrl}\n\n`
        }
        
        if (implementation.implementationNotes) {
          prompt += `Note: ${implementation.implementationNotes}\n\n`
        }
      })
    })
    
    return prompt.trim()
  }

  const handleCopyPrompt = async () => {
    const prompt = generatePromptText()
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setShowThankYouDialog(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (_error) {
      setCopied(false)
    }
  }

  return (
    <DrawerPrimitives.Root open={open} onOpenChange={onOpenChange}>
      {data ? (
        <DrawerPrimitives.Portal>
          <DrawerPrimitives.Overlay
            className={cn(
              "fixed inset-0 z-50 overflow-y-auto",
              "bg-black/30 dark:bg-black/60",
              "data-[state=closed]:animate-hide data-[state=open]:animate-dialogOverlayShow"
            )}
            style={{
              animationDuration: "400ms",
              animationFillMode: "backwards",
            }}
          >
            <DrawerPrimitives.Content
              className={cn(
                "fixed inset-y-2 mx-auto flex w-[95vw] flex-1 flex-col overflow-y-auto rounded-md border p-4 shadow-lg focus:outline-none max-sm:inset-x-2 sm:inset-y-2 sm:right-2 sm:max-w-lg sm:p-6 lg:inset-4 lg:max-w-none lg:w-auto lg:pb-0",
                "border-border",
                "bg-background",
                "data-[state=closed]:animate-drawerSlideRightAndFade data-[state=open]:animate-drawerSlideLeftAndFade",
                "focus:outline-none focus:ring-0"
              )}
            >
              {/* Header */}
              <div className="-mx-6 flex items-start justify-between gap-x-4 border-b border-border px-6 pb-4">
                <div className="mt-1 flex flex-col gap-y-1">
                  <DrawerPrimitives.Title className="text-base font-semibold text-foreground w-full">
                    Interactive Prompt Builder
                  </DrawerPrimitives.Title>
                  <div className="mt-1">
                    <span className="text-left text-sm text-muted-foreground">
                      Build a copy-ready AI prompt by choosing a starter and adding capabilities from open source tools. Pin compatibilities on any alternatives page to add them here.
                    </span>
                  </div>
                </div>
                <DrawerPrimitives.Close asChild>
                  <CustomButton
                    variant="ghost"
                    className="aspect-square p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <RiCloseLine className="size-6" aria-hidden="true" />
                  </CustomButton>
                </DrawerPrimitives.Close>
              </div>

              {/* Body */}
              <div className="flex-1 py-4 -mx-6 overflow-y-auto lg:overflow-hidden lg:py-0">
                {/* Desktop: Three-column layout */}
                <div className="hidden lg:flex lg:h-full lg:px-6 lg:py-4">
                  {/* Left Column: Choose Starter + Find Capabilities */}
                  <div className="flex-1 flex flex-col overflow-y-auto pr-4">
                    {/* Choose Starter (ported) */}
                    <div className="space-y-3 mb-5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Choose Starter</p>
                      <CustomSelect value={selectedTemplate} onValueChange={(value) => {
                        setSelectedTemplate(value)
                        updateBuildStatsCard({ currentAppIndex: 0 })
                      }}>
                        <CustomSelectTrigger>
                          {(() => {
                            const t = starterTemplates.find(s => s.id === selectedTemplate)
                            if (!t) return <SelectPrimitives.Value placeholder="Choose a starter template" />
                            return (
                              <span className="flex items-center gap-3">
                                {t.id === 'openfront' ? (
                                  <OpenfrontIcon className="w-6 h-6" />
                                ) : t.id === 'openship' ? (
                                  <OpenshipIcon className="w-6 h-6" />
                                ) : t.id === 'byos' ? (
                                  <LogoIcon className="w-6 h-6" />
                                ) : t.id === '1' ? (
                                  <NextKeystoneIcon className="w-6 h-6" />
                                ) : t.id === 'opensource-builders' ? (
                                  <LogoIcon className="w-6 h-6" />
                                ) : (
                                  <LogoIcon className="w-6 h-6" />
                                )}
                                <span>
                                  <span className="block font-medium leading-5">{t.name}</span>
                                  <span className="text-gray-500 dark:text-gray-500 mt-0.5 block text-xs leading-4">{t.description}</span>
                                </span>
                              </span>
                            )
                          })()}
                        </CustomSelectTrigger>
                        <CustomSelectContent>
                          {starterTemplates.map((template) => (
                            <CustomSelectItem key={template.id} value={template.id}>
                              <span className="flex items-center gap-3">
                                {template.id === 'openfront' ? (
                                  <OpenfrontIcon className="w-6 h-6" />
                                ) : template.id === 'openship' ? (
                                  <OpenshipIcon className="w-6 h-6" />
                                ) : template.id === 'byos' ? (
                                  <LogoIcon className="w-6 h-6" />
                                ) : template.id === '1' ? (
                                  <NextKeystoneIcon className="w-6 h-6" />
                                ) : template.id === 'opensource-builders' ? (
                                  <LogoIcon className="w-6 h-6" />
                                ) : (
                                  <LogoIcon className="w-6 h-6" />
                                )}
                                <span>
                                  <span className="block font-medium">{template.name}</span>
                                  <span className="text-gray-500 dark:text-gray-500 mt-0.5 block text-xs">{template.description}</span>
                                </span>
                              </span>
                            </CustomSelectItem>
                          ))}
                        </CustomSelectContent>
                      </CustomSelect>
                      {(() => {
                        const template = starterTemplates.find(t => t.id === selectedTemplate)
                        if (!template) return null
                        return (
                          <div className="flex items-center gap-2">
                            {template.source && (
                              <a href={template.source} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-50 transition-colors text-xs">
                                <Github className="h-3 w-3" />
                                <span>Source</span>
                              </a>
                            )}
                            <span className="text-gray-500 dark:text-gray-600 text-xs">•</span>
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-xs">
                                  <Info className="h-3 w-3" />
                                  <span>Info</span>
                                </button>
                              </PopoverTrigger>
                              <PopoverContent side="top" className="w-80">
                                <div className="space-y-2">
                                  <p className="text-sm text-foreground">
                                    {template?.info || 'starter'}
                                  </p>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        )
                      })()}
                    </div>

                    {/* Build Stats Card */}
                    <div className="space-y-3 flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Find Open Source Capabilities</p>
                      <BuildStatsCard
                        apps={apps}
                        selectedCapabilities={new Set(actualSelectedCapabilities?.map(cap => cap.id) || [])}
                        selectedStarterId={selectedTemplate}
                      />
                    </div>

                    {/* Copy Prompt Button */}
                    <div className="pt-4 mt-auto">
                      <button
                        onClick={handleCopyPrompt}
                        className="w-full inline-flex items-center justify-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-b from-background to-muted border border-border hover:from-muted hover:to-muted/80 transition-all duration-200 shadow-sm text-sm font-medium"
                      >
                        {copied ? "Copied!" : "Copy Prompt"}
                      </button>
                    </div>
                  </div>

                  {/* Middle Column: Selected Capabilities */}
                  <div className="flex-1 space-y-3 overflow-y-auto px-4 border-l border-border -my-4 py-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Selected Capabilities</p>
                    {actualSelectedCapabilities && actualSelectedCapabilities.length > 0 ? (
                      <div className="space-y-2">
                        {actualSelectedCapabilities
                          .sort((a, b) => a.toolName.localeCompare(b.toolName))
                          .map((capability) => (
                          <div key={capability.id} className="flex items-center gap-3 rounded-lg bg-muted border p-3">
                            {/* Tool Icon */}
                            <div className="flex h-8 w-8 items-center justify-center flex-shrink-0">
                              {capability.toolIcon ? (
                                <ToolIcon
                                  name={capability.toolName}
                                  simpleIconSlug={capability.toolIcon}
                                  simpleIconColor={capability.toolColor}
                                  size={32}
                                />
                              ) : (
                                <div
                                  className="flex aspect-square items-center justify-center rounded-md overflow-hidden relative after:rounded-[inherit] after:absolute after:inset-0 after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] after:pointer-events-none"
                                  style={{
                                    width: 32,
                                    height: 32,
                                    background: capability.toolColor || '#000000'
                                  }}
                                >
                                  <div
                                    className="absolute inset-0 opacity-30"
                                    style={{
                                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                      backgroundSize: "256px 256px",
                                    }}
                                  />
                                  <div
                                    className="absolute inset-0 rounded-md"
                                    style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(255,255,255,0.1)" }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span
                                      className="font-instrument-serif font-bold text-foreground select-none"
                                      style={{
                                        fontSize: 32 * 0.45,
                                        textShadow: "0 1px 4px rgba(255,255,255,0.3), 0 0 8px rgba(255,255,255,0.2)",
                                        filter: 'brightness(0) invert(1)',
                                        opacity: 0.9
                                      }}
                                    >
                                      {capability.toolName.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent rounded-t-md" />
                                </div>
                              )}
                            </div>

                            {/* Capability Info */}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{capability.name}</div>
                              <div className="text-xs text-muted-foreground">
                                from {capability.toolName}
                                {capability.category && (
                                  <>
                                    <span className="mx-1">·</span>
                                    <span className="capitalize">{capability.category}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleCapabilityRemove(capability.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1 focus:outline-none focus:ring-0 flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic p-4 border border-dashed rounded-lg">
                        No capabilities selected. Use the search above to find and pin capabilities.
                      </div>
                    )}
                  </div>

                  {/* Right Column: Full Prompt Preview */}
                  <div className="flex-1 space-y-3 overflow-y-auto px-4 border-l border-border -my-4 py-4">
                    {/* MCP Toggle */}
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">MCP Servers</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setGithubMcpEnabled(!githubMcpEnabled)}
                          className="inline-flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-b from-background to-muted border border-border hover:from-muted hover:to-muted/80 transition-all duration-200 shadow-sm"
                        >
                          <div className={`inline-block size-2 shrink-0 rounded-full ${
                            githubMcpEnabled
                              ? 'bg-green-500 outline outline-3 -outline-offset-1 outline-green-100 dark:outline-green-900'
                              : 'bg-red-500 outline outline-3 -outline-offset-1 outline-red-100 dark:outline-red-900'
                          }`} />
                          <span className="text-sm font-medium">GitHub MCP</span>
                        </button>

                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                              <Info className="h-4 w-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent side="top" className="w-80">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Github className="h-4 w-4" />
                                <span className="text-sm font-medium">GitHub MCP Setup</span>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-2">
                                {githubMcpEnabled ? (
                                  <p><strong>Enabled:</strong> The AI prompt will instruct to use the GitHub MCP for direct repository access. This uses fewer tokens since it doesn't need to search the web.</p>
                                ) : (
                                  <p><strong>Disabled:</strong> The AI prompt will instruct to use web search to look up GitHub code. This may use more tokens but works without MCP setup.</p>
                                )}
                                <div className="pt-2 border-t">
                                  <p className="text-xs font-medium mb-2">To enable GitHub MCP:</p>
                                  <div className="space-y-1 text-xs">
                                    <p>1. Create a GitHub personal access token with public repository access</p>
                                    <p>2. Add the GitHub MCP to your Claude Code/Cursor/VS Code configuration</p>
                                  </div>
                                  <a
                                    href="https://github.com/settings/tokens"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline text-xs block mt-2"
                                  >
                                    Create GitHub Token →
                                  </a>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Generated Prompt</p>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50 shadow-sm">
                      <div className="text-sm leading-relaxed text-foreground">
                        {(() => {
                          const currentTemplate = starterTemplates.find(t => t.id === selectedTemplate)
                          const capabilityGroups = Object.entries(groupedCapabilities)

                          if (!currentTemplate && capabilityGroups.length === 0) {
                            return (
                              <span className="text-muted-foreground italic">
                                Select a starter and add capabilities to generate your AI prompt.
                              </span>
                            )
                          }

                          const capabilitiesByName: {[capabilityName: string]: SelectedCapability[]} = {}
                          actualSelectedCapabilities.forEach(capability => {
                            if (!capabilitiesByName[capability.name]) {
                              capabilitiesByName[capability.name] = []
                            }
                            capabilitiesByName[capability.name].push(capability)
                          })

                          return (
                            <div className="space-y-4">
                              {currentTemplate && (
                                <div className="flex items-start gap-2 text-sm leading-relaxed">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <button className="flex-shrink-0 inline-flex items-center gap-2 hover:bg-muted/50 rounded px-1 py-0.5 transition-colors focus:outline-none focus:ring-0">
                                        <div style={{ width: 20, height: 20 }}>
                                          {currentTemplate.id === 'openfront' ? (
                                            <OpenfrontIcon className="w-5 h-5" />
                                          ) : currentTemplate.id === 'openship' ? (
                                            <OpenshipIcon className="w-5 h-5" />
                                          ) : currentTemplate.id === 'byos' ? (
                                            <LogoIcon className="w-5 h-5" />
                                          ) : currentTemplate.id === '1' ? (
                                            <NextKeystoneIcon className="w-5 h-5" />
                                          ) : currentTemplate.id === 'opensource-builders' ? (
                                            <LogoIcon className="w-5 h-5" />
                                          ) : (
                                            <LogoIcon className="w-5 h-5" />
                                          )}
                                        </div>
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent side="top" className="w-80">
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium">Starter Template</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          {currentTemplate.id === 'openfront' ? (
                                            <OpenfrontIcon className="w-6 h-6" />
                                          ) : currentTemplate.id === 'openship' ? (
                                            <OpenshipIcon className="w-6 h-6" />
                                          ) : currentTemplate.id === 'byos' ? (
                                            <LogoIcon className="w-6 h-6" />
                                          ) : currentTemplate.id === '1' ? (
                                            <NextKeystoneIcon className="w-6 h-6" />
                                          ) : currentTemplate.id === 'opensource-builders' ? (
                                            <LogoIcon className="w-6 h-6" />
                                          ) : (
                                            <LogoIcon className="w-6 h-6" />
                                          )}
                                          <div>
                                            <p className="text-sm font-medium text-foreground">{currentTemplate.name}</p>
                                            <p className="text-xs text-muted-foreground">{currentTemplate.description}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                  <div className="flex-1">
                                    {currentTemplate.id === '1' ? (
                                      <Collapsible>
                                        <div className="flex items-center justify-between">
                                          {currentTemplate.name}
                                          <CollapsibleTrigger className="text-muted-foreground hover:text-foreground transition-colors p-1">
                                            <ChevronDown className="h-4 w-4" />
                                          </CollapsibleTrigger>
                                        </div>
                                        <CollapsibleContent className="mt-3">
                                          <div className="w-full cursor-pointer transition duration-100 ease-linear rounded-[10px] bg-card text-foreground shadow-xs ring-1 ring-inset ring-border hover:bg-muted/50 p-4">
                                            <div className="inline-flex items-center mb-3">
                                              <span className="inline-flex items-center rounded-md bg-muted shadow-xs ring-1 ring-inset ring-border gap-1.5 px-2 py-0.5">
                                                <span className="inline-block size-2 shrink-0 rounded-full bg-primary outline outline-3 -outline-offset-1 outline-primary/20" />
                                                Understanding the Starter
                                              </span>
                                            </div>
                                            <div className="space-y-3 text-sm">
                                              <div className="text-muted-foreground">
                                                Please git clone this repo: <code className="bg-muted px-1 rounded text-xs">git clone https://github.com/junaid33/next-keystone-starter.git</code>
                                              </div>
                                              <div className="text-muted-foreground">
                                                Then read the README.md and other relevant markdown files to get a general sense of how this full-stack Next.js application works.
                                              </div>
                                            </div>
                                          </div>
                                        </CollapsibleContent>
                                      </Collapsible>
                                    ) : (
                                      currentTemplate.name
                                    )}
                                  </div>
                                </div>
                              )}

                              {Object.entries(capabilitiesByName).map(([capabilityName, implementations]) => {
                                const hasMultipleImplementations = implementations.length > 1
                                return (
                                  <div key={capabilityName} className="flex items-start gap-2 text-sm leading-relaxed">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <button className="flex-shrink-0 inline-flex items-center gap-2 hover:bg-muted/50 rounded px-1 py-0.5 transition-colors focus:outline-none focus:ring-0">
                                          <div className="relative flex -space-x-1.5">
                                            {implementations.slice(0, 3).map((impl, idx) => (
                                              <div key={impl.id} className="relative" style={{ zIndex: 10 - idx }}>
                                                {impl.toolIcon ? (
                                                  <div className="w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center">
                                                    <ToolIcon
                                                      name={impl.toolName}
                                                      simpleIconSlug={impl.toolIcon}
                                                      simpleIconColor={impl.toolColor}
                                                      size={12}
                                                    />
                                                  </div>
                                                ) : (
                                                  <div
                                                    className="w-5 h-5 rounded-full border border-border flex items-center justify-center relative overflow-hidden"
                                                    style={{ background: impl.toolColor || '#6B7280', color: 'white' }}
                                                  >
                                                    <span className="relative text-[8px] font-bold">
                                                      {impl.toolName.charAt(0).toUpperCase()}
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </button>
                                      </PopoverTrigger>
                                      <PopoverContent side="top" className="w-80">
                                        <div className="space-y-3">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{capabilityName}</span>
                                            {hasMultipleImplementations && (
                                              <span className="text-xs bg-muted px-2 py-1 rounded">
                                                {implementations.length} implementations
                                              </span>
                                            )}
                                          </div>
                                          <div className="space-y-2">
                                            {implementations.map(implementation => (
                                              <div key={implementation.id} className="p-2 rounded border bg-muted/30">
                                                <div className="flex items-center gap-2 mb-1">
                                                  {implementation.toolIcon ? (
                                                    <ToolIcon
                                                      name={implementation.toolName}
                                                      simpleIconSlug={implementation.toolIcon}
                                                      simpleIconColor={implementation.toolColor}
                                                      size={16}
                                                    />
                                                  ) : (
                                                    <div
                                                      className="flex aspect-square items-center justify-center rounded-sm overflow-hidden text-[8px] font-instrument-serif font-bold"
                                                      style={{ width: 16, height: 16, background: implementation.toolColor || '#6B7280', color: 'white' }}
                                                    >
                                                      {implementation.toolName.charAt(0).toUpperCase()}
                                                    </div>
                                                  )}
                                                  <p className="text-sm font-medium">{implementation.toolName}</p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                    <div className="flex-1">
                                      <Collapsible>
                                        <div className="flex items-center justify-between">
                                          Implement {capabilityName}
                                          <CollapsibleTrigger className="text-muted-foreground hover:text-foreground transition-colors p-1">
                                            <ChevronDown className="h-4 w-4" />
                                          </CollapsibleTrigger>
                                        </div>
                                        <CollapsibleContent>
                                          {implementations.map((implementation, index) => (
                                            <div key={`${capabilityName}-${implementation.id}-${index}`} className="mt-3">
                                              <div className="w-full cursor-pointer transition duration-100 ease-linear rounded-[10px] bg-card text-foreground shadow-xs ring-1 ring-inset ring-border hover:bg-muted/50 p-4">
                                                <div className="inline-flex items-center mb-3">
                                                  <span className="inline-flex items-center rounded-md bg-muted shadow-xs ring-1 ring-inset ring-border gap-2 px-2 py-0.5">
                                                    {implementation.toolIcon ? (
                                                      <ToolIcon
                                                        name={implementation.toolName}
                                                        simpleIconSlug={implementation.toolIcon}
                                                        simpleIconColor={implementation.toolColor}
                                                        size={16}
                                                      />
                                                    ) : (
                                                      <span
                                                        className="inline-block size-2 shrink-0 rounded-full outline outline-3 -outline-offset-1"
                                                        style={{
                                                          backgroundColor: implementation.toolColor || '#6366f1',
                                                          outlineColor: `${implementation.toolColor || '#6366f1'}30`
                                                        }}
                                                      />
                                                    )}
                                                    {hasMultipleImplementations ? `${implementation.toolName} approach` : implementation.toolName}
                                                  </span>
                                                </div>
                                                <div className="space-y-3 text-sm">
                                                  {implementation.description && (
                                                    <div className="text-muted-foreground">{implementation.description}</div>
                                                  )}
                                                  {implementation.githubPath && implementation.toolRepo && (
                                                    <div className="text-muted-foreground">
                                                      {githubMcpEnabled ? (
                                                        <>Use the GitHub MCP to access the {implementation.toolName} repository at <code className="bg-muted px-1 rounded text-xs">{implementation.toolRepo}</code>, then analyze <code className="bg-muted px-1 rounded text-xs">{implementation.githubPath}</code> to understand the implementation.</>
                                                      ) : (
                                                        <>Look up <code className="bg-muted px-1 rounded text-xs">{implementation.githubPath}</code> in the {implementation.toolName} repository on GitHub for implementation details.</>
                                                      )}
                                                    </div>
                                                  )}
                                                  {implementation.documentationUrl && (
                                                    <div className="text-muted-foreground">
                                                      Reference the documentation at: <a href={implementation.documentationUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{implementation.documentationUrl}</a>
                                                    </div>
                                                  )}
                                                  {implementation.implementationNotes && (
                                                    <div className="text-muted-foreground">
                                                      <em>Note: {implementation.implementationNotes}</em>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </CollapsibleContent>
                                      </Collapsible>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile: Tabbed layout (existing) */}
                <CustomTabs defaultValue="builder" className="lg:hidden">
                  <CustomTabsList>
                    <CustomTabsTrigger value="builder" className="px-4">
                      Builder
                    </CustomTabsTrigger>
                    <CustomTabsTrigger value="full-prompt" className="px-4">
                      Full Prompt
                    </CustomTabsTrigger>
                  </CustomTabsList>
                  <CustomTabsContent value="builder" className="space-y-5 px-6 mt-4">
                    {/* Choose Starter (ported) */}
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Choose Starter</p>
                      <CustomSelect value={selectedTemplate} onValueChange={(value) => {
                        setSelectedTemplate(value)
                        // Reset to first app when starter changes
                        updateBuildStatsCard({ currentAppIndex: 0 })
                      }}>
                        <CustomSelectTrigger>
                          {(() => {
                            const t = starterTemplates.find(s => s.id === selectedTemplate)
                            if (!t) return <SelectPrimitives.Value placeholder="Choose a starter template" />
                            return (
                              <span className="flex items-center gap-3">
                                {t.id === 'openfront' ? (
                                  <OpenfrontIcon className="w-6 h-6" />
                                ) : t.id === 'openship' ? (
                                  <OpenshipIcon className="w-6 h-6" />
                                ) : t.id === 'byos' ? (
                                  <LogoIcon className="w-6 h-6" />
                                ) : t.id === '1' ? (
                                  <NextKeystoneIcon className="w-6 h-6" />
                                ) : t.id === 'opensource-builders' ? (
                                  <LogoIcon className="w-6 h-6" />
                                ) : (
                                  <LogoIcon className="w-6 h-6" />
                                )}
                                <span>
                                  <span className="block font-medium leading-5">{t.name}</span>
                                  <span className="text-gray-500 dark:text-gray-500 mt-0.5 block text-xs leading-4">{t.description}</span>
                                </span>
                              </span>
                            )
                          })()}
                        </CustomSelectTrigger>
                        <CustomSelectContent>
                          {starterTemplates.map((template) => (
                            <CustomSelectItem key={template.id} value={template.id}>
                              <span className="flex items-center gap-3">
                                {template.id === 'openfront' ? (
                                  <OpenfrontIcon className="w-6 h-6" />
                                ) : template.id === 'openship' ? (
                                  <OpenshipIcon className="w-6 h-6" />
                                ) : template.id === 'byos' ? (
                                  <LogoIcon className="w-6 h-6" />
                                ) : template.id === '1' ? (
                                  <NextKeystoneIcon className="w-6 h-6" />
                                ) : template.id === 'opensource-builders' ? (
                                  <LogoIcon className="w-6 h-6" />
                                ) : (
                                  <LogoIcon className="w-6 h-6" />
                                )}
                                <span>
                                  <span className="block font-medium">{template.name}</span>
                                  <span className="text-gray-500 dark:text-gray-500 mt-0.5 block text-xs">{template.description}</span>
                                </span>
                              </span>
                            </CustomSelectItem>
                          ))}
                        </CustomSelectContent>
                      </CustomSelect>
                      {(() => {
                        const template = starterTemplates.find(t => t.id === selectedTemplate)
                        if (!template) return null
                        return (
                          <div className="flex items-center gap-2">
                            {template.source && (
                              <a href={template.source} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-50 transition-colors text-xs">
                                <Github className="h-3 w-3" />
                                <span>Source</span>
                              </a>
                            )}
                            <span className="text-gray-500 dark:text-gray-600 text-xs">•</span>
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-xs">
                                  <Info className="h-3 w-3" />
                                  <span>Info</span>
                                </button>
                              </PopoverTrigger>
                              <PopoverContent side="top" className="w-80">
                                <div className="space-y-2">
                                  <p className="text-sm text-foreground">
                                    {template?.info || 'starter'}
                                  </p>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        )
                      })()}
                    </div>

                    {/* Build Stats Card */}
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Find Open Source Capabilities</p>
                      <BuildStatsCard
                        apps={apps}
                        selectedCapabilities={new Set(actualSelectedCapabilities?.map(cap => cap.id) || [])}
                        selectedStarterId={selectedTemplate}
                      />

                      {/* Selected Capabilities - Flat List */}
                      {actualSelectedCapabilities && actualSelectedCapabilities.length > 0 && (
                        <div className="space-y-2">
                          {actualSelectedCapabilities
                            .sort((a, b) => a.toolName.localeCompare(b.toolName))
                            .map((capability) => (
                            <div key={capability.id} className="flex items-center gap-3 rounded-lg bg-muted border p-3">
                              {/* Tool Icon */}
                              <div className="flex h-8 w-8 items-center justify-center flex-shrink-0">
                                {capability.toolIcon ? (
                                  <ToolIcon
                                    name={capability.toolName}
                                    simpleIconSlug={capability.toolIcon}
                                    simpleIconColor={capability.toolColor}
                                    size={32}
                                  />
                                ) : (
                                  <div
                                    className="flex aspect-square items-center justify-center rounded-md overflow-hidden relative after:rounded-[inherit] after:absolute after:inset-0 after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] after:pointer-events-none"
                                    style={{
                                      width: 32,
                                      height: 32,
                                      background: capability.toolColor || '#000000'
                                    }}
                                  >
                                    {/* Noise texture overlay */}
                                    <div
                                      className="absolute inset-0 opacity-30"
                                      style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                        backgroundSize: "256px 256px",
                                      }}
                                    />

                                    {/* Additional inner shadow for depth */}
                                    <div
                                      className="absolute inset-0 rounded-md"
                                      style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(255,255,255,0.1)" }}
                                    />

                                    {/* Letter */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span
                                        className="font-instrument-serif font-bold text-foreground select-none"
                                        style={{
                                          fontSize: 32 * 0.45,
                                          textShadow: "0 1px 4px rgba(255,255,255,0.3), 0 0 8px rgba(255,255,255,0.2)",
                                          filter: 'brightness(0) invert(1)',
                                          opacity: 0.9
                                        }}
                                      >
                                        {capability.toolName.charAt(0).toUpperCase()}
                                      </span>
                                    </div>

                                    {/* Subtle highlight */}
                                    <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent rounded-t-md" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Capability Info */}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium">{capability.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  from {capability.toolName}
                                  {capability.category && (
                                    <>
                                      <span className="mx-1">·</span>
                                      <span className="capitalize">{capability.category}</span>
                                    </>
                                  )}
                                  {capability.complexity && (
                                    <>
                                      <span className="mx-1">·</span>
                                      <span>{capability.complexity} complexity</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {/* Remove Button */}
                              <button
                                onClick={() => handleCapabilityRemove(capability.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 focus:outline-none focus:ring-0 flex-shrink-0"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CustomTabsContent>
                  <CustomTabsContent value="full-prompt" className="space-y-6 px-6 mt-4">
                    {/* Available MCP Servers */}
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Available MCP Servers</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setGithubMcpEnabled(!githubMcpEnabled)}
                          className="inline-flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-b from-background to-muted border border-border hover:from-muted hover:to-muted/80 transition-all duration-200 shadow-sm"
                        >
                          <div className={`inline-block size-2 shrink-0 rounded-full ${
                            githubMcpEnabled
                              ? 'bg-green-500 outline outline-3 -outline-offset-1 outline-green-100 dark:outline-green-900'
                              : 'bg-red-500 outline outline-3 -outline-offset-1 outline-red-100 dark:outline-red-900'
                          }`} />
                          <span className="text-sm font-medium">GitHub MCP</span>
                        </button>
                        
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                              <Info className="h-4 w-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent side="top" className="w-80">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Github className="h-4 w-4" />
                                <span className="text-sm font-medium">GitHub MCP Setup</span>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-2">
                                {githubMcpEnabled ? (
                                  <p><strong>Enabled:</strong> The AI prompt will instruct to use the GitHub MCP for direct repository access. This uses fewer tokens since it doesn't need to search the web.</p>
                                ) : (
                                  <p><strong>Disabled:</strong> The AI prompt will instruct to use web search to look up GitHub code. This may use more tokens but works without MCP setup.</p>
                                )}
                                <div className="pt-2 border-t">
                                  <p className="text-xs font-medium mb-2">To enable GitHub MCP:</p>
                                  <div className="space-y-1 text-xs">
                                    <p>1. Create a GitHub personal access token with public repository access</p>
                                    <p>2. Add the GitHub MCP to your Claude Code/Cursor/VS Code configuration</p>
                                  </div>
                                  <a 
                                    href="https://github.com/settings/tokens" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline text-xs block mt-2"
                                  >
                                    Create GitHub Token →
                                  </a>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Generated Prompt</p>
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50 shadow-sm">
                        <div className="text-sm leading-relaxed text-foreground">
                          {(() => {
                            const currentTemplate = starterTemplates.find(t => t.id === selectedTemplate)
                            const capabilityGroups = Object.entries(groupedCapabilities)
                            
                            if (!currentTemplate && capabilityGroups.length === 0) {
                              return (
                                <span className="text-muted-foreground italic">
                                  Select a starter and add capabilities to generate your AI prompt.
                                </span>
                              )
                            }

                            // Group capabilities by capability name for better AI prompt generation
                            const capabilitiesByName: {[capabilityName: string]: SelectedCapability[]} = {}
                            actualSelectedCapabilities.forEach(capability => {
                              if (!capabilitiesByName[capability.name]) {
                                capabilitiesByName[capability.name] = []
                              }
                              capabilitiesByName[capability.name].push(capability)
                            })

                            return (
                              <div className="space-y-4">
                                {/* Starter paragraph */}
                                {currentTemplate && (
                                  <div className="flex items-start gap-2 text-sm leading-relaxed">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <button className="flex-shrink-0 inline-flex items-center gap-2 hover:bg-muted/50 rounded px-1 py-0.5 transition-colors focus:outline-none focus:ring-0">
                                          <div style={{ width: 20, height: 20 }}>
                                            {currentTemplate.id === 'openfront' ? (
                                              <OpenfrontIcon className="w-5 h-5" />
                                            ) : currentTemplate.id === 'openship' ? (
                                              <OpenshipIcon className="w-5 h-5" />
                                            ) : currentTemplate.id === 'byos' ? (
                                              <LogoIcon className="w-5 h-5" />
                                            ) : currentTemplate.id === '1' ? (
                                              <NextKeystoneIcon className="w-5 h-5" />
                                            ) : currentTemplate.id === 'opensource-builders' ? (
                                              <LogoIcon className="w-5 h-5" />
                                            ) : (
                                              <LogoIcon className="w-5 h-5" />
                                            )}
                                          </div>
                                        </button>
                                      </PopoverTrigger>
                                      <PopoverContent side="top" className="w-80">
                                        <div className="space-y-3">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">Starter Template</span>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            {currentTemplate.id === 'openfront' ? (
                                              <OpenfrontIcon className="w-6 h-6" />
                                            ) : currentTemplate.id === 'openship' ? (
                                              <OpenshipIcon className="w-6 h-6" />
                                            ) : currentTemplate.id === 'byos' ? (
                                              <LogoIcon className="w-6 h-6" />
                                            ) : currentTemplate.id === '1' ? (
                                              <NextKeystoneIcon className="w-6 h-6" />
                                            ) : currentTemplate.id === 'opensource-builders' ? (
                                              <LogoIcon className="w-6 h-6" />
                                            ) : (
                                              <LogoIcon className="w-6 h-6" />
                                            )}
                                            <div>
                                              <p className="text-sm font-medium text-foreground">{currentTemplate.name}</p>
                                              <p className="text-xs text-muted-foreground">{currentTemplate.description}</p>
                                            </div>
                                          </div>
                                          {currentTemplate.info && (
                                            <p className="text-sm text-muted-foreground">{currentTemplate.info}</p>
                                          )}
                                          <div className="flex items-center gap-2 pt-2 border-t">
                                            {currentTemplate.source && (
                                              <a
                                                href={currentTemplate.source}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-xs"
                                              >
                                                <Github className="h-3 w-3" />
                                                <span>Source</span>
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                    <div className="flex-1">
                                      {currentTemplate.id === '1' ? (
                                        <Collapsible>
                                          <div className="flex items-center justify-between">
                                            {currentTemplate.name}
                                            <CollapsibleTrigger className="text-muted-foreground hover:text-foreground transition-colors p-1">
                                              <ChevronDown className="h-4 w-4" />
                                            </CollapsibleTrigger>
                                          </div>
                                          
                                          <CollapsibleContent className="mt-3">
                                            {/* Git Clone capability-style card */}
                                            <div className="w-full cursor-pointer transition duration-100 ease-linear rounded-[10px] bg-card text-foreground shadow-xs ring-1 ring-inset ring-border hover:bg-muted/50 p-4">
                                              {/* Header with badge */}
                                              <div className="inline-flex items-center mb-3">
                                                <span className="inline-flex items-center rounded-md bg-muted shadow-xs ring-1 ring-inset ring-border gap-1.5 px-2 py-0.5">
                                                  <span className="inline-block size-2 shrink-0 rounded-full bg-primary outline outline-3 -outline-offset-1 outline-primary/20" />
                                                  Understanding the Starter
                                                </span>
                                              </div>
                                              
                                              {/* Content */}
                                              <div className="space-y-3 text-sm">
                                                <div className="text-muted-foreground">
                                                  Please git clone this repo: <code className="bg-muted px-1 rounded text-xs">git clone https://github.com/junaid33/next-keystone-starter.git</code>
                                                </div>
                                                
                                                <div className="text-muted-foreground">
                                                  Then read the README.md and other relevant markdown files to get a general sense of how this full-stack Next.js application works. It's a Next.js application with a Keystone admin dashboard built-in, a GraphQL API, role-based permissions, and is designed with feature slices architecture. Review the /features directory structure and the project's architecture documentation.
                                                </div>
                                              </div>
                                            </div>
                                          </CollapsibleContent>
                                        </Collapsible>
                                      ) : (
                                        <>
                                          Use the {currentTemplate.name} as your starting point. This template provides {currentTemplate.description.toLowerCase()} and will serve as the foundation for your application.
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Capability-specific paragraphs */}
                                {Object.entries(capabilitiesByName).map(([capabilityName, implementations]) => {
                                  const hasMultipleImplementations = implementations.length > 1
                                  return (
                                    <div key={capabilityName} className="flex items-start gap-2 text-sm leading-relaxed">
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <button className="flex-shrink-0 inline-flex items-center gap-2 hover:bg-muted/50 rounded px-1 py-0.5 transition-colors focus:outline-none focus:ring-0">
                                            {/* Avatar stack showing all tools that implement this capability */}
                                            <div className="relative flex -space-x-1.5">
                                              {implementations.slice(0, 3).map((impl, idx) => (
                                                <div key={impl.id} className="relative" style={{ zIndex: 10 - idx }}>
                                                  {impl.toolIcon ? (
                                                    <div className="w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center">
                                                      <ToolIcon
                                                        name={impl.toolName}
                                                        simpleIconSlug={impl.toolIcon}
                                                        simpleIconColor={impl.toolColor}
                                                        size={16}
                                                      />
                                                    </div>
                                                  ) : (
                                                    <div 
                                                      className="w-5 h-5 rounded-full border border-border flex items-center justify-center relative overflow-hidden"
                                                      style={{ 
                                                        background: impl.toolColor || '#6B7280',
                                                        color: 'white'
                                                      }}
                                                    >
                                                      {/* Noise texture overlay */}
                                                      <div
                                                        className="absolute inset-0 opacity-30"
                                                        style={{
                                                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                                          backgroundSize: "256px 256px",
                                                        }}
                                                      />
                                                      <span className="relative text-[8px] font-bold">
                                                        {impl.toolName.charAt(0).toUpperCase()}
                                                      </span>
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                              {implementations.length > 3 && (
                                                <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                                                  +{implementations.length - 3}
                                                </div>
                                              )}
                                            </div>
                                          </button>
                                        </PopoverTrigger>
                                        <PopoverContent side="top" className="w-80">
                                          <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm font-medium">{capabilityName}</span>
                                              {hasMultipleImplementations && (
                                                <span className="text-xs bg-muted px-2 py-1 rounded">
                                                  {implementations.length} implementations
                                                </span>
                                              )}
                                            </div>
                                            <div className="space-y-2">
                                              {implementations.map(implementation => (
                                                <div key={implementation.id} className="p-2 rounded border bg-muted/30">
                                                  <div className="flex items-center gap-2 mb-1">
                                                    {implementation.toolIcon ? (
                                                      <ToolIcon
                                                        name={implementation.toolName}
                                                        simpleIconSlug={implementation.toolIcon}
                                                        simpleIconColor={implementation.toolColor}
                                                        size={16}
                                                      />
                                                    ) : (
                                                      <div 
                                                        className="flex aspect-square items-center justify-center rounded-sm overflow-hidden text-[8px] font-instrument-serif font-bold"
                                                        style={{ 
                                                          width: 16, 
                                                          height: 16,
                                                          background: implementation.toolColor || '#6B7280',
                                                          color: 'white'
                                                        }}
                                                      >
                                                        {implementation.toolName.charAt(0).toUpperCase()}
                                                      </div>
                                                    )}
                                                    <p className="text-sm font-medium">{implementation.toolName}</p>
                                                  </div>
                                                  {implementation.description && (
                                                    <p className="text-xs text-muted-foreground mt-1">{implementation.description}</p>
                                                  )}
                                                  {implementation.implementationNotes && (
                                                    <p className="text-xs text-muted-foreground mt-1 italic">{implementation.implementationNotes}</p>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                      <div className="flex-1">
                                        <Collapsible>
                                          <div className="flex items-center justify-between">
                                            Implement {capabilityName}:
                                            <CollapsibleTrigger className="text-muted-foreground hover:text-foreground transition-colors p-1">
                                              <ChevronDown className="h-4 w-4" />
                                            </CollapsibleTrigger>
                                          </div>
                                          
                                          <CollapsibleContent>
                                            {implementations.map((implementation, index) => (
                                          <div key={`${capabilityName}-${implementation.id}-${index}`} className="mt-3">
                                            {/* Everything inside one card */}
                                            <div className="w-full cursor-pointer transition duration-100 ease-linear rounded-[10px] bg-card text-foreground shadow-xs ring-1 ring-inset ring-border hover:bg-muted/50 p-4">
                                              {/* Header with badge */}
                                              <div className="inline-flex items-center mb-3">
                                                <span className="inline-flex items-center rounded-md bg-muted shadow-xs ring-1 ring-inset ring-border gap-2 px-2 py-0.5">
                                                  {implementation.toolIcon ? (
                                                    <ToolIcon
                                                      name={implementation.toolName}
                                                      simpleIconSlug={implementation.toolIcon}
                                                      simpleIconColor={implementation.toolColor}
                                                      size={16}
                                                    />
                                                  ) : (
                                                    <span 
                                                      className="inline-block size-2 shrink-0 rounded-full outline outline-3 -outline-offset-1"
                                                      style={{ 
                                                        backgroundColor: implementation.toolColor || '#6366f1',
                                                        outlineColor: `${implementation.toolColor || '#6366f1'}30`
                                                      }}
                                                    />
                                                  )}
                                                  {hasMultipleImplementations ? `${implementation.toolName} approach` : implementation.toolName}
                                                </span>
                                              </div>
                                              
                                              {/* All content inside the card */}
                                              <div className="space-y-3 text-sm">
                                                {implementation.description && (
                                                  <div className="text-muted-foreground">{implementation.description}</div>
                                                )}
                                                
                                                {implementation.githubPath && implementation.toolRepo && (
                                                  <div className="text-muted-foreground">
                                                    {githubMcpEnabled ? (
                                                      <>Use the GitHub MCP to access the {implementation.toolName} repository at <code className="bg-muted px-1 rounded text-xs">{implementation.toolRepo}</code>, then analyze <code className="bg-muted px-1 rounded text-xs">{implementation.githubPath}</code> to understand the implementation.</>
                                                    ) : (
                                                      <>Look up <code className="bg-muted px-1 rounded text-xs">{implementation.githubPath}</code> in the {implementation.toolName} repository on GitHub for implementation details.</>
                                                    )}
                                                  </div>
                                                )}
                                                
                                                {implementation.documentationUrl && (
                                                  <div className="text-muted-foreground">
                                                    Reference the documentation at: <a href={implementation.documentationUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{implementation.documentationUrl}</a>
                                                  </div>
                                                )}
                                                
                                                {implementation.implementationNotes && (
                                                  <div className="text-muted-foreground">
                                                    <em>Note: {implementation.implementationNotes}</em>
                                                  </div>
                                                )}
                                                
                                                {implementation.implementationComplexity && (
                                                  <div>
                                                    <span className="text-xs bg-muted px-2 py-0.5 rounded">
                                                      Complexity: {implementation.implementationComplexity}
                                                    </span>
                                                  </div>
                                                )}

                                                {hasMultipleImplementations && index === 0 && (
                                                  <div className="text-muted-foreground text-xs italic border-t pt-2 mt-2">
                                                    💡 Compare with other implementations below to choose the best approach for your use case.
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                          </CollapsibleContent>
                                        </Collapsible>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  </CustomTabsContent>
                </CustomTabs>
              </div>

              {/* Footer - only show on mobile */}
              <div className="flex border-t border-border pt-4 sm:justify-end -mx-6 -mb-2 gap-2 bg-background px-6 lg:hidden">
                <button
                  onClick={handleCopyPrompt}
                  className="w-full inline-flex items-center justify-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-b from-background to-muted border border-border hover:from-muted hover:to-muted/80 transition-all duration-200 shadow-sm text-sm font-medium"
                >
                  {copied ? "Copied!" : "Copy Prompt"}
                </button>
              </div>
            </DrawerPrimitives.Content>
          </DrawerPrimitives.Overlay>
        </DrawerPrimitives.Portal>
      ) : null}

      {/* Thank You Dialog */}
      <Dialog open={showThankYouDialog} onOpenChange={setShowThankYouDialog}>
        <DialogContent className="sm:max-w-lg p-6">
          <div className="relative flex shrink-0 items-center justify-center rounded-full size-16 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mb-3">
            <CircleCheck className="size-8" />
          </div>
          
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground mb-2">
              Prompt Copied Successfully!
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mb-3">
              Your prompt references amazing features built by these projects. Please consider starring them to show your support.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-2">
            {actualSelectedCapabilities && Array.from(
              new Map(
                actualSelectedCapabilities.map(cap => [cap.toolName, cap])
              ).values()
            ).map((capability) => (
              capability.toolRepo && (() => {
                const repoMatch = capability.toolRepo.match(/github\.com\/([^\/]+)\/([^\/]+)/);
                if (repoMatch) {
                  const [, username, repo] = repoMatch;
                  return (
                    <div key={capability.id} className="flex items-center gap-3 rounded-lg bg-muted border p-3">
                      {/* Tool Icon */}
                      <div className="flex h-8 w-8 items-center justify-center flex-shrink-0">
                        {capability.toolIcon ? (
                          <ToolIcon
                            name={capability.toolName}
                            simpleIconSlug={capability.toolIcon}
                            simpleIconColor={capability.toolColor}
                            size={32}
                          />
                        ) : (
                          <div
                            className="flex aspect-square items-center justify-center rounded-md overflow-hidden relative after:rounded-[inherit] after:absolute after:inset-0 after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] after:pointer-events-none"
                            style={{
                              width: 32,
                              height: 32,
                              background: capability.toolColor || '#000000'
                            }}
                          >
                            {/* Noise texture overlay */}
                            <div
                              className="absolute inset-0 opacity-30"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />

                            {/* Additional inner shadow for depth */}
                            <div
                              className="absolute inset-0 rounded-md"
                              style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(255,255,255,0.1)" }}
                            />

                            {/* Letter */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span
                                className="font-instrument-serif font-bold text-foreground select-none"
                                style={{
                                  fontSize: 32 * 0.45,
                                  textShadow: "0 1px 4px rgba(255,255,255,0.3), 0 0 8px rgba(255,255,255,0.2)",
                                  filter: 'brightness(0) invert(1)',
                                  opacity: 0.9
                                }}
                              >
                                {capability.toolName.charAt(0).toUpperCase()}
                              </span>
                            </div>

                            {/* Subtle highlight */}
                            <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent rounded-t-md" />
                          </div>
                        )}
                      </div>
                      
                      {/* Capability Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{capability.toolName}</div>
                        <div className="text-xs text-muted-foreground">
                          {username}/{repo.replace('.git', '')}
                        </div>
                      </div>
                      
                      {/* Star Button */}
                      <a
                        href={`https://github.com/${username}/${repo.replace('.git', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:from-gray-100 hover:to-gray-150 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200 shadow-sm text-sm font-medium"
                      >
                        <Star className="h-4 w-4" />
                        <span>Star</span>
                      </a>
                    </div>
                  );
                }
                return null;
              })()
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </DrawerPrimitives.Root>
  )
}