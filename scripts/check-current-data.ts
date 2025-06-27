#!/usr/bin/env tsx

/**
 * Check current database state and analyze what tools and alternatives exist
 */

interface DatabaseAnalysis {
  totalTools: number
  openSourceTools: number
  proprietaryTools: number
  toolsWithFeatures: number
  toolsWithAlternatives: number
  totalFeatures: number
  totalAlternativeRelationships: number
  categoryBreakdown: Record<string, number>
  proprietaryToolsToCheck: string[]
  alternativeRelationships: Array<{
    proprietary: string
    openSource: string[]
  }>
}

async function analyzeCurrentData(): Promise<DatabaseAnalysis> {
  const query = `
    query AnalyzeCurrentData {
      tools {
        id
        name
        slug
        isOpenSource
        category {
          name
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
      }
      
      features {
        id
        name
        featureType
      }
      
      categories {
        id
        name
        tools {
          id
        }
      }
    }
  `

  const response = await fetch('http://localhost:3003/api/graphql', {
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
  
  // Build alternative relationships map
  const alternativeRelationships: Array<{
    proprietary: string
    openSource: string[]
  }> = []
  
  const proprietaryToolsMap = new Map<string, string[]>()
  
  data.tools.forEach((tool: any) => {
    if (!tool.isOpenSource) {
      // This is a proprietary tool, collect its open source alternatives
      const openSourceAlts = tool.openSourceAlternatives.map((alt: any) => alt.openSourceTool.name)
      if (openSourceAlts.length > 0) {
        proprietaryToolsMap.set(tool.name, openSourceAlts)
      }
    }
  })
  
  proprietaryToolsMap.forEach((openSourceAlts, proprietaryName) => {
    alternativeRelationships.push({
      proprietary: proprietaryName,
      openSource: openSourceAlts
    })
  })
  
  // Key proprietary tools to check from the research
  const proprietaryToolsToCheck = [
    "Google Analytics",
    "Notion", 
    "Shopify",
    "HubSpot",
    "Salesforce",
    "Mailchimp",
    "Airtable",
    "TeamViewer",
    "Adobe Photoshop",
    "Zoom",
    "Slack",
    "Asana",
    "Trello",
    "Jira"
  ]
  
  const analysis: DatabaseAnalysis = {
    totalTools: data.tools.length,
    openSourceTools: data.tools.filter((tool: any) => tool.isOpenSource).length,
    proprietaryTools: data.tools.filter((tool: any) => !tool.isOpenSource).length,
    toolsWithFeatures: data.tools.filter((tool: any) => tool.features.length > 0).length,
    toolsWithAlternatives: data.tools.filter((tool: any) => 
      tool.proprietaryAlternatives.length > 0 || tool.openSourceAlternatives.length > 0
    ).length,
    totalFeatures: data.features.length,
    totalAlternativeRelationships: alternativeRelationships.length,
    categoryBreakdown: data.categories.reduce((acc: Record<string, number>, category: any) => {
      acc[category.name] = category.tools.length
      return acc
    }, {}),
    proprietaryToolsToCheck,
    alternativeRelationships
  }
  
  return analysis
}

function displayAnalysis(analysis: DatabaseAnalysis) {
  console.log('🔍 CURRENT DATABASE STATE ANALYSIS')
  console.log('===================================')
  
  console.log('\n📊 OVERVIEW:')
  console.log(`Total Tools: ${analysis.totalTools}`)
  console.log(`Open Source Tools: ${analysis.openSourceTools} (${Math.round(analysis.openSourceTools/analysis.totalTools*100)}%)`)
  console.log(`Proprietary Tools: ${analysis.proprietaryTools} (${Math.round(analysis.proprietaryTools/analysis.totalTools*100)}%)`)
  console.log(`Tools with Features: ${analysis.toolsWithFeatures} (${Math.round(analysis.toolsWithFeatures/analysis.totalTools*100)}%)`)
  console.log(`Tools with Alternatives: ${analysis.toolsWithAlternatives} (${Math.round(analysis.toolsWithAlternatives/analysis.totalTools*100)}%)`)
  console.log(`Total Features: ${analysis.totalFeatures}`)
  console.log(`Alternative Relationships: ${analysis.totalAlternativeRelationships}`)
  
  console.log('\n📂 CATEGORIES:')
  Object.entries(analysis.categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} tools`)
    })
  
  console.log('\n🔄 EXISTING ALTERNATIVE RELATIONSHIPS:')
  if (analysis.alternativeRelationships.length > 0) {
    analysis.alternativeRelationships.forEach(relationship => {
      console.log(`  ${relationship.proprietary} → ${relationship.openSource.join(', ')}`)
    })
  } else {
    console.log('  No alternative relationships found')
  }
  
  console.log('\n🎯 KEY PROPRIETARY TOOLS STATUS:')
  analysis.proprietaryToolsToCheck.forEach(toolName => {
    const relationship = analysis.alternativeRelationships.find(r => r.proprietary === toolName)
    if (relationship) {
      console.log(`  ✅ ${toolName} → ${relationship.openSource.join(', ')}`)
    } else {
      console.log(`  ❌ ${toolName} (no alternatives found)`)
    }
  })
}

async function main() {
  try {
    console.log('Checking current database state...\n')
    const analysis = await analyzeCurrentData()
    displayAnalysis(analysis)
    
    console.log('\n✅ Analysis complete!')
    console.log('\n🔧 SCHEMA STATUS:')
    console.log('  ✅ API running on correct port (3003)')
    console.log('  ✅ Open source directory schema (not Medusa e-commerce)')
    console.log('  ✅ Tools, Features, Categories, Alternatives models working')
    
  } catch (error) {
    console.error('❌ Analysis failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { analyzeCurrentData, type DatabaseAnalysis }