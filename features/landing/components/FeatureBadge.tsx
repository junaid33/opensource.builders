'use client'

import { useId } from "react"
import { CheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface FeatureBadgeProps {
  name: string
  compatible?: boolean
  featureType?: string
}

export default function FeatureBadge({ name, compatible = true, featureType }: FeatureBadgeProps) {
  const id = useId()
  
  return (
    <Badge 
      className="has-data-[state=unchecked]:bg-muted has-data-[state=unchecked]:text-muted-foreground has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative outline-none has-focus-visible:ring-[3px]"
      variant={compatible ? "default" : "secondary"}
    >
      <Checkbox
        id={id}
        className="peer sr-only after:absolute after:inset-0"
        checked={compatible}
        disabled
      />
      <CheckIcon
        size={12}
        className={`${compatible ? 'block' : 'hidden'} peer-data-[state=checked]:block`}
        aria-hidden="true"
      />
      <label
        htmlFor={id}
        className="cursor-pointer select-none after:absolute after:inset-0"
      >
        {name}
      </label>
    </Badge>
  )
}