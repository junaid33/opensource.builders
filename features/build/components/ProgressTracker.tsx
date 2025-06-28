'use client'

import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BuildWizardStep } from '../types/build'

interface ProgressTrackerProps {
  steps: BuildWizardStep[]
  currentStep: BuildWizardStep['id']
  onStepClick?: (stepId: BuildWizardStep['id']) => void
}

export function ProgressTracker({ steps, currentStep, onStepClick }: ProgressTrackerProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = step.id === currentStep
          const isClickable = onStepClick && (isCompleted || index <= currentStepIndex + 1)

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isCurrent && "border-primary text-primary bg-background",
                  !isCompleted && !isCurrent && "border-muted-foreground/30 text-muted-foreground",
                  isClickable && "cursor-pointer hover:border-primary hover:text-primary"
                )}
                onClick={() => isClickable && onStepClick?.(step.id)}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="ml-3 flex-1">
                <div
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isCurrent && "text-foreground",
                    isCompleted && "text-foreground",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div
                    className={cn(
                      "h-0.5 w-full transition-colors",
                      index < currentStepIndex ? "bg-primary" : "bg-muted-foreground/20"
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: Show current step description */}
      <div className="mt-4 sm:hidden">
        <div className="text-sm text-muted-foreground">
          {steps.find(step => step.id === currentStep)?.description}
        </div>
      </div>
    </div>
  )
}