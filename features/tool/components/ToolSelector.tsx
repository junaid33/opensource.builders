'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import * as SelectPrimitive from '@radix-ui/react-select'

interface ProprietaryTool {
  id: string
  name: string
  slug: string
  simpleIconSlug?: string
  simpleIconColor?: string
}

interface ToolSelectorProps {
  currentTool: string
  allTools: ProprietaryTool[]
}

export default function ToolSelector({ currentTool, allTools }: ToolSelectorProps) {
  const router = useRouter()

  const handleToolChange = (toolName: string) => {
    // Find the selected tool to get its slug
    const selectedTool = allTools.find(tool => tool.name === toolName)
    if (selectedTool) {
      // Navigate to the tool page using the actual slug from the database
      router.push(`/tool/${selectedTool.slug}`)
    }
  }

  return (
    <Select value={currentTool} onValueChange={handleToolChange}>
      <SelectPrimitive.Trigger className="flex items-center gap-4 w-auto h-auto p-0 border-none bg-transparent hover:bg-transparent focus:ring-0 focus:ring-offset-0 focus:border-none shadow-none focus:outline-none">
        <SelectValue asChild>
          <h1 className="text-5xl font-bold text-foreground tracking-tight cursor-pointer hover:text-foreground/90 transition-colors">
            {currentTool}
          </h1>
        </SelectValue>
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors stroke-3" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectContent className="min-w-[300px] max-h-[400px]">
        {allTools.map((tool) => (
          <SelectItem 
            key={tool.id} 
            value={tool.name}
            className="text-lg py-3 px-4 cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          >
            {tool.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}