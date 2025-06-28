'use client'

import { useState } from 'react'
import { BuildWizard } from '../components/BuildWizard'
import { ToolSelector } from '../components/ToolSelector'
import { FeatureSelector } from '../components/FeatureSelector'
import { PromptOutput } from '../components/PromptOutput'
import { ProgressTracker } from '../components/ProgressTracker'
import type { BuildState, BuildWizardStep, Tool, SelectedFeature, FeatureConflict } from '../types/build'

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
    currentStep: 'tools',
    selectedTools: [],
    selectedFeatures: [],
    conflicts: []
  })

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

  const currentStepData = WIZARD_STEPS.find(step => step.id === buildState.currentStep)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">Build Your Project</h1>
            <p className="text-muted-foreground mt-2">
              Select features from proven open source tools and get AI-powered implementation guidance
            </p>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="border-b bg-muted/5">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <ProgressTracker 
              steps={WIZARD_STEPS} 
              currentStep={buildState.currentStep}
              onStepClick={updateStep}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <BuildWizard currentStep={buildState.currentStep}>
            {/* Step 1: Tool Selection */}
            {buildState.currentStep === 'tools' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">{currentStepData?.title}</h2>
                  <p className="text-muted-foreground">{currentStepData?.description}</p>
                </div>
                <ToolSelector
                  selectedTools={buildState.selectedTools}
                  onToolsSelect={handleToolsSelected}
                  initialTools={initialTools}
                  initialCategories={initialCategories}
                />
              </div>
            )}

            {/* Step 2: Feature Selection */}
            {buildState.currentStep === 'features' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">{currentStepData?.title}</h2>
                  <p className="text-muted-foreground">{currentStepData?.description}</p>
                </div>
                <FeatureSelector
                  selectedTools={buildState.selectedTools}
                  selectedFeatures={buildState.selectedFeatures}
                  onFeaturesSelect={handleFeaturesSelected}
                  onConflictsDetected={handleConflictsDetected}
                />
              </div>
            )}

            {/* Step 3: Prompt Output */}
            {buildState.currentStep === 'output' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">{currentStepData?.title}</h2>
                  <p className="text-muted-foreground">{currentStepData?.description}</p>
                </div>
                <PromptOutput
                  selectedTools={buildState.selectedTools}
                  selectedFeatures={buildState.selectedFeatures}
                  conflicts={buildState.conflicts}
                />
              </div>
            )}
          </BuildWizard>
        </div>
      </div>
    </div>
  )
}