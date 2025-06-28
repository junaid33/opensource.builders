'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { BuildWizardStep } from '../types/build'

interface BuildWizardProps {
  children: ReactNode
  currentStep: BuildWizardStep['id']
  className?: string
}

export function BuildWizard({ children, currentStep, className }: BuildWizardProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="transition-all duration-300 ease-in-out">
        {children}
      </div>
    </div>
  )
}