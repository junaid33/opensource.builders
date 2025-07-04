'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { BuildWizard } from '../components/BuildWizard'
import { ToolSelector } from '../components/ToolSelector'
import { FeatureSelector } from '../components/FeatureSelector'
import { PromptOutput } from '../components/PromptOutput'
import { ProgressTracker } from '../components/ProgressTracker'
import { PromptBuilder } from '../components/PromptBuilder'
import type { BuildState, BuildWizardStep, Tool, SelectedFeature, FeatureConflict } from '../types/build'
import { cn } from '@/lib/utils'

const WIZARD_STEPS: BuildWizardStep[] = [
  {
    id: 'tools',
    title: 'Select Tools',
    description: 'Choose MIT open source tools to extract features from',
    completed: false
  },
  {
    id: 'features',
    title: 'Select Features',
    description: 'Pick specific features from your selected tools',
    completed: false
  },
  {
    id: 'output',
    title: 'Generate Prompt',
    description: 'Get your AI implementation prompt and starter template',
    completed: false
  }
]

interface Category {
  id: string
  name: string
  slug: string
  color?: string
  toolCount: number
}

interface BuildPageProps {
  initialTools?: Tool[]
  initialCategories?: Category[]
}

export function BuildPage({ initialTools = [], initialCategories = [] }: BuildPageProps) {
  const [buildState, setBuildState] = useState<BuildState>({
    currentStep: 'output',
    selectedTools: [],
    selectedFeatures: [],
    conflicts: []
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const updateStep = (stepId: BuildWizardStep['id']) => {
    setBuildState(prev => ({ ...prev, currentStep: stepId }))
  }

  const handleToolsSelected = (tools: Tool[]) => {
    setBuildState(prev => ({
      ...prev,
      selectedTools: tools,
      selectedFeatures: [], // Reset features when tools change
      currentStep: tools.length > 0 ? 'features' : 'tools'
    }))
  }

  const handleFeaturesSelected = (features: SelectedFeature[]) => {
    setBuildState(prev => ({
      ...prev,
      selectedFeatures: features,
      currentStep: features.length > 0 ? 'output' : 'features'
    }))
  }

  const handleConflictsDetected = (conflicts: FeatureConflict[]) => {
    setBuildState(prev => ({ ...prev, conflicts }))
  }

  const handlePromptChange = (prompt: string) => {
    setGeneratedPrompt(prompt)
  }

  const handleGenerateProject = () => {
    setShowOutput(true)
  }

  const currentStepData = WIZARD_STEPS.find(step => step.id === buildState.currentStep)
  
  const handleNextStep = () => {
    const currentIndex = WIZARD_STEPS.findIndex(step => step.id === buildState.currentStep)
    if (currentIndex < WIZARD_STEPS.length - 1) {
      updateStep(WIZARD_STEPS[currentIndex + 1].id)
    }
  }
  
  const handlePreviousStep = () => {
    const currentIndex = WIZARD_STEPS.findIndex(step => step.id === buildState.currentStep)
    if (currentIndex > 0) {
      updateStep(WIZARD_STEPS[currentIndex - 1].id)
    }
  }

  return (
    <div className="relative py-12">
        {!showOutput ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <PromptBuilder onPromptChange={handlePromptChange} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-3 text-center">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-3xl font-bold"
                >
                  Your AI Implementation Guide
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground"
                >
                  Ready to use prompt for AI-powered development
                </motion.p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Generated Project Prompt:</h3>
                    <p className="text-sm leading-relaxed">{generatedPrompt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button 
                onClick={() => setShowOutput(false)}
                variant="outline"
                size="lg"
                className="group"
              >
                <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Builder
              </Button>
              <Button 
                size="lg"
                className="group"
              >
                Create GitHub Repository
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        )}
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex flex-col items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BuildPage