'use client'

import { useState, useId } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LogoIcon } from '@/features/dashboard/components/Logo'
import { cn } from '@/lib/utils'

interface BuildQuestion {
  id: string
  question: string
  answer: string
}

const starterTemplates = [
  {
    id: '1',
    name: 'Next.js + Keystone Starter',
    description: 'Full-stack template with admin'
  }
]

const buildQuestions: BuildQuestion[] = [
  {
    id: 'item-1',
    question: 'Which features would you like to include?',
    answer: 'Select specific features from proven MIT-licensed open source tools. Popular options include Cal.com\'s scheduling system, Supabase\'s authentication, Stripe\'s payment processing, and many more. Each feature comes with implementation notes and quality scores.',
  },
]

interface PromptBuilderProps {
  onPromptChange?: (prompt: string) => void
  className?: string
}

export function PromptBuilder({ onPromptChange, className }: PromptBuilderProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const selectId = useId()

  const generatePrompt = () => {
    const templateInfo = selectedTemplate ? `Using ${starterTemplates.find(t => t.id === selectedTemplate)?.name || 'starter template'}. ` : ''
    if (selectedAnswers.length === 0 && !selectedTemplate) return ''
    
    const prompt = `${templateInfo}Build a modern web application with the following specifications: ${selectedAnswers.join(' ')} Please provide a comprehensive implementation plan with step-by-step instructions.`
    return prompt
  }

  const handleAccordionChange = (value: string) => {
    const question = buildQuestions.find(q => q.id === value)
    if (!question) return

    const newAnswers = selectedAnswers.includes(question.answer)
      ? selectedAnswers.filter(answer => answer !== question.answer)
      : [...selectedAnswers, question.answer]
    
    setSelectedAnswers(newAnswers)
    
    const templateInfo = selectedTemplate ? `Using ${starterTemplates.find(t => t.id === selectedTemplate)?.name || 'starter template'}. ` : ''
    const newPrompt = newAnswers.length > 0 || selectedTemplate
      ? `${templateInfo}Build a modern web application with the following specifications: ${newAnswers.join(' ')} Please provide a comprehensive implementation plan with step-by-step instructions.`
      : ''
    
    onPromptChange?.(newPrompt)
  }

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value)
    
    const templateInfo = value ? `Using ${starterTemplates.find(t => t.id === value)?.name || 'starter template'}. ` : ''
    const newPrompt = selectedAnswers.length > 0 || value
      ? `${templateInfo}Build a modern web application with the following specifications: ${selectedAnswers.join(' ')} Please provide a comprehensive implementation plan with step-by-step instructions.`
      : ''
    
    onPromptChange?.(newPrompt)
  }

  return (
    <section className={cn("py-8", className)}>
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Interactive Prompt Builder</h2>
          <p className="text-muted-foreground mt-4 text-balance">
            Customize your project by selecting the features and configurations that match your needs.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <div className="bg-card w-full rounded-2xl border px-8 py-6 shadow-sm space-y-6">
            {/* Starter Template Selection */}
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Choose Starter</p>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange} defaultValue="1">
                <SelectTrigger
                  className="h-auto ps-2 text-left border-0 shadow-none [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_span]:shrink-0"
                >
                  <SelectValue placeholder="Choose a starter template" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                  {starterTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <span className="flex items-center gap-3">
                        <LogoIcon className="w-6 h-6" />
                        <span>
                          <span className="block font-medium">{template.name}</span>
                          <span className="text-muted-foreground mt-0.5 block text-xs">
                            {template.description}
                          </span>
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                  <SelectItem value="none" disabled>
                    <span className="text-muted-foreground text-sm">No other options</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dash Separator */}
            <div className="border-t border-dashed border-border my-6"></div>

            {/* Features Accordion */}
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Choose Features</p>
              <Accordion
                type="multiple"
                className="space-y-0"
              >
                {buildQuestions.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="border-dashed"
                  >
                    <AccordionTrigger 
                      className="cursor-pointer text-base hover:no-underline"
                      onClick={() => handleAccordionChange(item.id)}
                    >
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-base">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {(selectedAnswers.length > 0 || selectedTemplate) && (
            <div className="mt-6 px-8">
              <p className="text-muted-foreground text-sm">
                {selectedTemplate && `Template: ${starterTemplates.find(t => t.id === selectedTemplate)?.name}`}
                {selectedTemplate && selectedAnswers.length > 0 && ' • '}
                {selectedAnswers.length > 0 && `${selectedAnswers.length} configuration${selectedAnswers.length !== 1 ? 's' : ''} selected`}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}