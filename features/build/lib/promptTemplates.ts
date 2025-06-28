import type { 
  GeneratedPrompt, 
  SelectedFeature, 
  Tool, 
  ToolAnalysisSection, 
  ResourceLink,
  FeatureType 
} from '../types/build'

/**
 * Generate a comprehensive AI implementation prompt based on selected tools and features
 */
export function generateImplementationPrompt(
  selectedTools: Tool[],
  selectedFeatures: SelectedFeature[]
): GeneratedPrompt {
  const introduction = generateIntroduction()
  const projectContext = generateProjectContext()
  const toolAnalysis = generateToolAnalysis(selectedTools, selectedFeatures)
  const implementationPlan = generateImplementationPlan(selectedFeatures)
  const resources = generateResources(selectedTools, selectedFeatures)
  
  const fullPrompt = assembleFullPrompt({
    introduction,
    projectContext,
    toolAnalysis,
    implementationPlan,
    resources
  })

  return {
    introduction,
    projectContext,
    toolAnalysis,
    implementationPlan,
    resources,
    fullPrompt
  }
}

/**
 * Generate the introduction explaining the Next.js/Keystone starter
 */
function generateIntroduction(): string {
  return `# Custom Project Implementation Request

## Project Foundation

You are implementing features into a Next.js/Keystone starter template that provides a solid foundation for building modern web applications. This starter includes:

**Core Technologies:**
- **Next.js 15** with App Router for frontend and API routes
- **Keystone.js 6** for backend, admin interface, and CMS functionality
- **Prisma** for database management and type-safe queries
- **Tailwind CSS** with shadcn/ui components for styling
- **TypeScript** throughout the entire codebase
- **GraphQL API** with auto-generated types and queries

**Architecture Features:**
- Feature-slice architecture for organized code structure
- Server actions for data fetching and mutations
- Component-based UI with reusable shadcn/ui primitives
- Authentication and authorization built-in
- Mobile-responsive design patterns
- Modern development tooling (ESLint, TypeScript, etc.)

**What you'll be implementing:**
Selected features from proven open source tools, adapted to work within this Next.js/Keystone architecture.`
}

/**
 * Generate project context based on selected features
 */
function generateProjectContext(): string {
  return `## Implementation Context

This implementation request focuses on integrating specific features from established open source projects into our Next.js/Keystone starter. Each selected feature has been chosen for its quality, reliability, and compatibility with our architecture.

**Implementation Guidelines:**
1. Follow the existing feature-slice architecture pattern
2. Use server actions for data operations
3. Leverage existing shadcn/ui components when possible
4. Maintain TypeScript type safety throughout
5. Ensure mobile responsiveness
6. Follow existing naming conventions and code patterns
7. Add proper error handling and loading states
8. Include appropriate tests where applicable

**Integration Approach:**
Rather than copying code directly, adapt the core concepts and patterns from the source repositories to work seamlessly with our Keystone backend and Next.js frontend.`
}

/**
 * Generate detailed analysis for each selected tool
 */
function generateToolAnalysis(
  selectedTools: Tool[],
  selectedFeatures: SelectedFeature[]
): ToolAnalysisSection[] {
  return selectedTools.map(tool => {
    const toolFeatures = selectedFeatures.filter(f => f.toolId === tool.id)
    
    return {
      toolName: tool.name,
      repositoryUrl: tool.repositoryUrl,
      selectedFeatures: toolFeatures,
      analysisNotes: generateToolAnalysisNotes(tool, toolFeatures),
      keyFiles: generateKeyFiles(tool, toolFeatures)
    }
  })
}

/**
 * Generate analysis notes for a specific tool
 */
function generateToolAnalysisNotes(tool: Tool, features: SelectedFeature[]): string {
  const featureTypes = [...new Set(features.map(f => f.featureType))]
  const avgQuality = features.reduce((sum, f) => sum + (f.qualityScore || 0), 0) / features.length
  const verifiedCount = features.filter(f => f.verified).length

  return `${tool.name} is a well-established open source project with ${tool.githubStars || 'many'} GitHub stars. 

**Selected Features Analysis:**
- ${features.length} features selected across ${featureTypes.length} categories
- Average quality score: ${avgQuality.toFixed(1)}/10
- ${verifiedCount}/${features.length} features are verified implementations

**Implementation Priority:**
${features
  .sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0))
  .slice(0, 3)
  .map(f => `- ${f.featureName} (Quality: ${f.qualityScore || 'N/A'}/10)`)
  .join('\n')}

**Key Considerations:**
${generateToolSpecificConsiderations(tool, features)}`
}

/**
 * Generate tool-specific implementation considerations
 */
function generateToolSpecificConsiderations(tool: Tool, features: SelectedFeature[]): string {
  const considerations: string[] = []

  // Add tool-specific advice based on common patterns
  if (tool.name.toLowerCase().includes('cal') || features.some(f => f.featureName.toLowerCase().includes('schedul'))) {
    considerations.push('- Pay special attention to timezone handling and calendar integration patterns')
    considerations.push('- Consider the booking flow UX and state management approach')
  }

  if (tool.name.toLowerCase().includes('supabase') || features.some(f => f.featureName.toLowerCase().includes('auth'))) {
    considerations.push('- Integrate authentication with Keystone\'s existing auth system')
    considerations.push('- Ensure proper session management and security practices')
  }

  if (features.some(f => f.featureType === 'api')) {
    considerations.push('- Design API endpoints to work with Keystone\'s GraphQL schema')
    considerations.push('- Ensure proper error handling and validation')
  }

  if (features.some(f => f.featureType === 'ui_ux')) {
    considerations.push('- Use existing shadcn/ui components for consistency')
    considerations.push('- Maintain responsive design patterns')
  }

  return considerations.length > 0 ? considerations.join('\n') : '- Follow standard implementation patterns for this tool type'
}

/**
 * Generate key files to reference from the source repository
 */
function generateKeyFiles(tool: Tool, features: SelectedFeature[]): string[] {
  const files: string[] = []

  // Add generic patterns based on feature types
  features.forEach(feature => {
    switch (feature.featureType) {
      case 'core':
        files.push(`src/lib/${feature.featureName.toLowerCase().replace(/\s+/g, '-')}.ts`)
        files.push(`components/${feature.featureName.replace(/\s+/g, '')}/*`)
        break
      case 'api':
        files.push(`pages/api/${feature.featureName.toLowerCase().replace(/\s+/g, '-')}.ts`)
        files.push(`lib/api/${feature.featureName.toLowerCase().replace(/\s+/g, '-')}.ts`)
        break
      case 'ui_ux':
        files.push(`components/${feature.featureName.replace(/\s+/g, '')}/*`)
        files.push(`styles/${feature.featureName.toLowerCase().replace(/\s+/g, '-')}.css`)
        break
      case 'integration':
        files.push(`lib/integrations/${feature.featureName.toLowerCase().replace(/\s+/g, '-')}.ts`)
        files.push(`hooks/use${feature.featureName.replace(/\s+/g, '')}.ts`)
        break
    }
  })

  // Add tool-specific file patterns
  if (tool.name.toLowerCase().includes('cal')) {
    files.push('apps/web/components/booking/', 'packages/lib/slots.ts', 'apps/web/pages/api/book/')
  }

  return [...new Set(files)].slice(0, 8) // Limit to 8 most relevant files
}

/**
 * Generate step-by-step implementation plan
 */
function generateImplementationPlan(selectedFeatures: SelectedFeature[]): string[] {
  const plan: string[] = [
    'Review the Next.js/Keystone starter structure and understand existing patterns',
    'Analyze the selected source repositories and identify core implementation patterns'
  ]

  // Group features by type for logical implementation order
  const featuresByType = groupFeaturesByType(selectedFeatures)
  
  // Add implementation steps based on feature types
  if (featuresByType.core?.length > 0) {
    plan.push('Implement core functionality and business logic')
    plan.push('Set up database schema extensions in Keystone if needed')
  }

  if (featuresByType.api?.length > 0) {
    plan.push('Create API endpoints and GraphQL resolvers')
    plan.push('Add proper validation and error handling for APIs')
  }

  if (featuresByType.ui_ux?.length > 0) {
    plan.push('Build UI components using existing shadcn/ui patterns')
    plan.push('Ensure responsive design and accessibility compliance')
  }

  if (featuresByType.integration?.length > 0) {
    plan.push('Implement third-party service integrations')
    plan.push('Set up environment variables and configuration')
  }

  if (featuresByType.security?.length > 0) {
    plan.push('Implement security features and authentication flows')
    plan.push('Add proper authorization and access controls')
  }

  plan.push(
    'Test feature interactions and ensure compatibility',
    'Add appropriate error boundaries and loading states',
    'Update documentation and add usage examples',
    'Perform final testing and optimization'
  )

  return plan
}

/**
 * Group features by their type for organized implementation
 */
function groupFeaturesByType(features: SelectedFeature[]): Record<FeatureType, SelectedFeature[]> {
  return features.reduce((acc, feature) => {
    if (!acc[feature.featureType]) {
      acc[feature.featureType] = []
    }
    acc[feature.featureType].push(feature)
    return acc
  }, {} as Record<FeatureType, SelectedFeature[]>)
}

/**
 * Generate resource links
 */
function generateResources(selectedTools: Tool[], selectedFeatures: SelectedFeature[]): ResourceLink[] {
  const resources: ResourceLink[] = [
    {
      title: 'Next.js Documentation',
      url: 'https://nextjs.org/docs',
      description: 'Complete guide to Next.js App Router and features'
    },
    {
      title: 'Keystone.js Documentation',
      url: 'https://keystonejs.com/docs',
      description: 'Keystone.js CMS and backend documentation'
    },
    {
      title: 'shadcn/ui Components',
      url: 'https://ui.shadcn.com',
      description: 'Reusable UI components built with Radix UI and Tailwind CSS'
    }
  ]

  // Add tool-specific resources
  selectedTools.forEach(tool => {
    if (tool.repositoryUrl) {
      resources.push({
        title: `${tool.name} Repository`,
        url: tool.repositoryUrl,
        description: `Source code and implementation patterns for ${tool.name}`
      })
    }
    
    if (tool.websiteUrl) {
      resources.push({
        title: `${tool.name} Documentation`,
        url: tool.websiteUrl,
        description: `Official documentation and guides for ${tool.name}`
      })
    }
  })

  return resources
}

/**
 * Assemble the complete prompt
 */
function assembleFullPrompt(promptData: Omit<GeneratedPrompt, 'fullPrompt'>): string {
  const { introduction, projectContext, toolAnalysis, implementationPlan, resources } = promptData

  let fullPrompt = introduction + '\n\n' + projectContext + '\n\n'

  // Add tool analysis sections
  fullPrompt += '## Selected Tools & Features\n\n'
  
  toolAnalysis.forEach(analysis => {
    fullPrompt += `### From ${analysis.toolName}`
    if (analysis.repositoryUrl) {
      fullPrompt += ` (${analysis.repositoryUrl})`
    }
    fullPrompt += '\n\n'

    fullPrompt += '**Selected Features:**\n'
    analysis.selectedFeatures.forEach(feature => {
      fullPrompt += `- ${feature.featureName}`
      if (feature.qualityScore) {
        fullPrompt += ` (Quality: ${feature.qualityScore}/10)`
      }
      fullPrompt += '\n'
    })

    fullPrompt += '\n**Implementation Notes:**\n'
    fullPrompt += analysis.analysisNotes + '\n\n'

    if (analysis.keyFiles.length > 0) {
      fullPrompt += '**Key Files to Reference:**\n'
      analysis.keyFiles.forEach(file => {
        fullPrompt += `- \`${file}\`\n`
      })
      fullPrompt += '\n'
    }

    // Add feature-specific implementation notes
    analysis.selectedFeatures.forEach(feature => {
      if (feature.implementationNotes) {
        fullPrompt += `**${feature.featureName} Implementation Notes:**\n`
        fullPrompt += feature.implementationNotes + '\n\n'
      }
    })
  })

  // Add implementation plan
  fullPrompt += '## Implementation Plan\n\n'
  implementationPlan.forEach((step, index) => {
    fullPrompt += `${index + 1}. ${step}\n`
  })

  // Add resources
  fullPrompt += '\n## Resources\n\n'
  resources.forEach(resource => {
    fullPrompt += `- [${resource.title}](${resource.url}) - ${resource.description}\n`
  })

  // Add closing instructions
  fullPrompt += `
## Getting Started

1. **Clone or download the Next.js/Keystone starter template**
2. **Review the existing codebase structure** to understand the patterns and architecture
3. **Follow the implementation plan above** step by step
4. **Reference the source repositories** for implementation details and patterns
5. **Adapt the code** to work with our Keystone backend and Next.js frontend
6. **Test thoroughly** to ensure features work together harmoniously

Remember to maintain compatibility with the existing Keystone.js architecture and follow the established patterns in the starter template.

Happy coding! 🚀`

  return fullPrompt
}