#!/usr/bin/env tsx

/**
 * Analyze tool data structure for individual tool pages
 * Focus on: Tools, Features, Alternatives, Categories, TechStacks, DeploymentOptions
 * Ignore: Flows (to be deleted)
 */

interface ToolAnalysis {
  totalTools: number
  toolsWithFeatures: number
  toolsWithAlternatives: number
  toolsWithLogos: number
  featuresBreakdown: {
    total: number
    byType: Record<string, number>
  }
  alternativesBreakdown: {
    totalRelationships: number
    openSourceTools: number
    proprietaryTools: number
  }
  categoriesBreakdown: {
    total: number
    toolsPerCategory: Record<string, number>
  }
  techStacksBreakdown: {
    total: number
    mostUsedStacks: Array<{ name: string; count: number }>
  }
  deploymentOptionsBreakdown: {
    total: number
    optionCounts: Record<string, number>
  }
}

async function analyzeToolData(): Promise<ToolAnalysis> {
  const query = `
    query AnalyzeToolData {
      # Get all tools with their relationships
      tools {
        id
        name
        slug
        description
        logoUrl
        logoSvg
        isOpenSource
        category {
          id
          name
          slug
        }
        features {
          feature {
            id
            name
            featureType
          }
        }
        proprietaryAlternatives {
          proprietaryTool {
            id
            name
          }
        }
        openSourceAlternatives {
          openSourceTool {
            id
            name
          }
        }
        techStacks {
          techStack {
            id
            name
          }
        }
        deploymentOptions {
          id
          platform
          difficulty
          estimatedTime
        }
      }
      
      # Get all features
      features {
        id
        name
        featureType
        tools {
          tool {
            id
          }
        }
      }
      
      # Get all categories
      categories {
        id
        name
        slug
        tools {
          id
        }
      }
      
      # Get all tech stacks
      techStacks {
        id
        name
        tools {
          tool {
            id
          }
        }
      }
      
      # Get all deployment options
      deploymentOptions {
        id
        platform
        difficulty
        estimatedTime
        tool {
          id
        }
      }
    }
  `

  const response = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query })
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`)
  }

  const result = await response.json()
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors)
    throw new Error('GraphQL query failed')
  }
  
  const { data } = result
  
  // Analyze the data
  const analysis: ToolAnalysis = {
    totalTools: data.tools.length,
    toolsWithFeatures: data.tools.filter((tool: any) => tool.features.length > 0).length,
    toolsWithAlternatives: data.tools.filter((tool: any) => 
      tool.proprietaryAlternatives.length > 0 || tool.openSourceAlternatives.length > 0
    ).length,
    toolsWithLogos: data.tools.filter((tool: any) => tool.logoSvg || tool.logoUrl).length,
    
    featuresBreakdown: {
      total: data.features.length,
      byType: data.features.reduce((acc: Record<string, number>, feature: any) => {
        const type = feature.featureType || 'Unknown'
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {})
    },
    
    alternativesBreakdown: {
      totalRelationships: data.tools.reduce((sum: number, tool: any) => 
        sum + tool.proprietaryAlternatives.length + tool.openSourceAlternatives.length, 0
      ),
      openSourceTools: data.tools.filter((tool: any) => tool.isOpenSource).length,
      proprietaryTools: data.tools.filter((tool: any) => !tool.isOpenSource).length
    },
    
    categoriesBreakdown: {
      total: data.categories.length,
      toolsPerCategory: data.categories.reduce((acc: Record<string, number>, category: any) => {
        acc[category.name] = category.tools.length
        return acc
      }, {})
    },
    
    techStacksBreakdown: {
      total: data.techStacks.length,
      mostUsedStacks: data.techStacks
        .map((stack: any) => ({
          name: stack.name,
          count: stack.tools.length
        }))
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 10)
    },
    
    deploymentOptionsBreakdown: {
      total: data.deploymentOptions.length,
      optionCounts: data.deploymentOptions.reduce((acc: Record<string, number>, option: any) => {
        const platform = option.platform || 'Unknown'
        acc[platform] = (acc[platform] || 0) + 1
        return acc
      }, {})
    }
  }
  
  return analysis
}

function displayAnalysis(analysis: ToolAnalysis) {
  console.log('🔍 TOOL DATA ANALYSIS')
  console.log('====================')
  
  console.log('\n📊 OVERVIEW:')
  console.log(`Total Tools: ${analysis.totalTools}`)
  console.log(`Tools with Features: ${analysis.toolsWithFeatures} (${Math.round(analysis.toolsWithFeatures/analysis.totalTools*100)}%)`)
  console.log(`Tools with Alternatives: ${analysis.toolsWithAlternatives} (${Math.round(analysis.toolsWithAlternatives/analysis.totalTools*100)}%)`)
  console.log(`Tools with Logos: ${analysis.toolsWithLogos} (${Math.round(analysis.toolsWithLogos/analysis.totalTools*100)}%)`)
  
  console.log('\n🎯 FEATURES:')
  console.log(`Total Features: ${analysis.featuresBreakdown.total}`)
  console.log('Feature Types:')
  Object.entries(analysis.featuresBreakdown.byType)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`)
    })
  
  console.log('\n🔄 ALTERNATIVES:')
  console.log(`Total Relationships: ${analysis.alternativesBreakdown.totalRelationships}`)
  console.log(`Open Source Tools: ${analysis.alternativesBreakdown.openSourceTools}`)
  console.log(`Proprietary Tools: ${analysis.alternativesBreakdown.proprietaryTools}`)
  
  console.log('\n📂 CATEGORIES:')
  console.log(`Total Categories: ${analysis.categoriesBreakdown.total}`)
  console.log('Tools per Category:')
  Object.entries(analysis.categoriesBreakdown.toolsPerCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} tools`)
    })
  
  console.log('\n⚙️ TECH STACKS:')
  console.log(`Total Tech Stacks: ${analysis.techStacksBreakdown.total}`)
  console.log('Most Used Stacks:')
  analysis.techStacksBreakdown.mostUsedStacks.forEach(stack => {
    console.log(`  ${stack.name}: ${stack.count} tools`)
  })
  
  console.log('\n🚀 DEPLOYMENT OPTIONS:')
  console.log(`Total Deployment Options: ${analysis.deploymentOptionsBreakdown.total}`)
  console.log('Deployment Platforms:')
  Object.entries(analysis.deploymentOptionsBreakdown.optionCounts)
    .sort(([,a], [,b]) => b - a)
    .forEach(([platform, count]) => {
      console.log(`  ${platform}: ${count} options`)
    })
  
  console.log('\n💡 RECOMMENDATIONS FOR TOOL PAGES:')
  console.log('1. Hero Section: Use name, description, logo, category, stars')
  console.log('2. Features Section: Group by featureType, show compatibility scores')
  console.log('3. Alternatives Section: Show both proprietary and open source alternatives')
  console.log('4. Tech Stack Section: Display associated technologies')
  console.log('5. Deployment Section: Show deployment options and types')
  console.log('6. Consider adding feature comparison tables')
  console.log('7. Add filtering by category and tech stack')
}

async function main() {
  try {
    console.log('Analyzing tool data structure...\n')
    const analysis = await analyzeToolData()
    displayAnalysis(analysis)
    
    console.log('\n✅ Analysis complete!')
    console.log('Ready to build individual tool pages with this data structure.')
  } catch (error) {
    console.error('❌ Analysis failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { analyzeToolData, type ToolAnalysis }