/**
 * TypeScript interfaces for the Build feature
 */

export interface Tool {
  id: string
  name: string
  slug: string
  description: string
  websiteUrl?: string
  repositoryUrl?: string
  simpleIconSlug?: string
  simpleIconColor?: string
  license: string
  githubStars?: number
  isOpenSource: boolean
  category?: {
    id: string
    name: string
    slug: string
    color?: string
  }
  features: ToolFeature[]
}

export interface Feature {
  id: string
  name: string
  slug: string
  description: string
  featureType: FeatureType
  category?: {
    id: string
    name: string
  }
}

export interface ToolFeature {
  id: string
  tool: {
    id: string
    name: string
    repositoryUrl?: string
  }
  feature: Feature
  implementationNotes?: string
  qualityScore?: number
  verified: boolean
}

export interface SelectedFeature {
  toolId: string
  toolName: string
  toolRepositoryUrl?: string
  featureId: string
  featureName: string
  featureDescription: string
  featureType: FeatureType
  qualityScore?: number
  implementationNotes?: string
  verified: boolean
}

export interface FeatureConflict {
  feature1: SelectedFeature
  feature2: SelectedFeature
  conflictType: 'dependency' | 'incompatible' | 'overlapping'
  severity: 'warning' | 'error'
  resolution?: string
}

export interface GeneratedPrompt {
  introduction: string
  projectContext: string
  toolAnalysis: ToolAnalysisSection[]
  implementationPlan: string[]
  resources: ResourceLink[]
  fullPrompt: string
}

export interface ToolAnalysisSection {
  toolName: string
  repositoryUrl?: string
  selectedFeatures: SelectedFeature[]
  analysisNotes: string
  keyFiles: string[]
}

export interface ResourceLink {
  title: string
  url: string
  description: string
}

export interface BuildWizardStep {
  id: 'tools' | 'features' | 'output'
  title: string
  description: string
  completed: boolean
}

export interface BuildState {
  currentStep: BuildWizardStep['id']
  selectedTools: Tool[]
  selectedFeatures: SelectedFeature[]
  conflicts: FeatureConflict[]
  generatedPrompt?: GeneratedPrompt
}

export type FeatureType = 
  | 'core'
  | 'integration' 
  | 'ui_ux'
  | 'api'
  | 'security'
  | 'performance'
  | 'analytics'
  | 'collaboration'
  | 'deployment'
  | 'customization'

export interface PromptTemplate {
  introduction: string
  projectFoundation: string
  toolAnalysisTemplate: string
  implementationPlanTemplate: string
  resourcesTemplate: string
}

export interface FilterOptions {
  search?: string
  categories?: string[]
  featureTypes?: FeatureType[]
  minStars?: number
  sortBy?: 'name' | 'stars' | 'updated'
  sortOrder?: 'asc' | 'desc'
}