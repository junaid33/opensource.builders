#!/usr/bin/env tsx

/**
 * Test GraphQL queries against the API to understand what's available
 */

async function testQuery(query: string, variables?: any, port = 3000) {
  try {
    const response = await fetch(`http://localhost:${port}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    return { error: error.message }
  }
}

async function main() {
  console.log('🔍 Testing API queries...\n')

  // Test port 3000 first
  console.log('📡 Testing port 3000...')
  const port3000Result = await testQuery(`
    query TestPort3000 {
      tools(take: 2) {
        id
        name
        isOpenSource
      }
    }
  `, {}, 3000)
  
  if (port3000Result.error) {
    console.log(`❌ Port 3000 error: ${port3000Result.error}`)
  } else if (port3000Result.errors) {
    console.log('❌ Port 3000 GraphQL errors:', port3000Result.errors.map((e: any) => e.message))
  } else {
    console.log('✅ Port 3000 works! Found tools:', port3000Result.data?.tools?.length || 0)
  }

  // Test port 3003
  console.log('\n📡 Testing port 3003...')
  const port3003Result = await testQuery(`
    query TestPort3003 {
      tools(take: 2) {
        id
        name
        isOpenSource
      }
    }
  `, {}, 3003)
  
  if (port3003Result.error) {
    console.log(`❌ Port 3003 error: ${port3003Result.error}`)
  } else if (port3003Result.errors) {
    console.log('❌ Port 3003 GraphQL errors:', port3003Result.errors.map((e: any) => e.message))
  } else {
    console.log('✅ Port 3003 works! Found tools:', port3003Result.data?.tools?.length || 0)
  }

  // If we found a working port, test more queries
  const workingPort = port3003Result.data ? 3003 : (port3000Result.data ? 3000 : null)
  
  if (!workingPort) {
    console.log('\n❌ No working GraphQL endpoint found on either port')
    return
  }

  console.log(`\n🎯 Using port ${workingPort} for detailed testing...`)

  // Test basic tools query
  console.log('\n1️⃣ Testing basic tools query:')
  const toolsResult = await testQuery(`
    query GetTools {
      tools(take: 5) {
        id
        name
        slug
        description
        isOpenSource
        category {
          name
        }
      }
    }
  `, {}, workingPort)

  if (toolsResult.data?.tools) {
    console.log(`✅ Found ${toolsResult.data.tools.length} tools`)
    toolsResult.data.tools.forEach((tool: any) => {
      console.log(`  - ${tool.name} (${tool.isOpenSource ? 'Open Source' : 'Proprietary'}) - ${tool.category?.name || 'No category'}`)
    })
  } else {
    console.log('❌ No tools found:', toolsResult.errors?.[0]?.message || 'Unknown error')
  }

  // Test alternatives query
  console.log('\n2️⃣ Testing alternatives query:')
  const alternativesResult = await testQuery(`
    query GetAlternatives {
      alternatives(take: 5) {
        id
        proprietaryTool {
          name
        }
        openSourceTool {
          name
        }
        similarityScore
      }
    }
  `, {}, workingPort)

  if (alternativesResult.data?.alternatives) {
    console.log(`✅ Found ${alternativesResult.data.alternatives.length} alternatives`)
    alternativesResult.data.alternatives.forEach((alt: any) => {
      console.log(`  - ${alt.openSourceTool?.name} ↔ ${alt.proprietaryTool?.name} (score: ${alt.similarityScore || 'N/A'})`)
    })
  } else {
    console.log('❌ No alternatives found:', alternativesResult.errors?.[0]?.message || 'Unknown error')
  }

  // Test specific query for Shopify alternatives
  console.log('\n3️⃣ Testing Shopify alternatives query:')
  const shopifyResult = await testQuery(`
    query GetShopifyAlternatives {
      alternatives(where: { 
        proprietaryTool: { 
          name: { equals: "Shopify" } 
        } 
      }) {
        id
        openSourceTool {
          name
          slug
          description
          logoSvg
          githubStars
        }
        similarityScore
      }
    }
  `, {}, workingPort)

  if (shopifyResult.data?.alternatives) {
    console.log(`✅ Found ${shopifyResult.data.alternatives.length} Shopify alternatives`)
    shopifyResult.data.alternatives.forEach((alt: any) => {
      console.log(`  - ${alt.openSourceTool?.name}: ${alt.openSourceTool?.description?.substring(0, 60)}...`)
    })
  } else {
    console.log('❌ No Shopify alternatives found:', shopifyResult.errors?.[0]?.message || 'Unknown error')
  }

  // Test query for specific proprietary tools
  console.log('\n4️⃣ Testing query for specific proprietary tools:')
  const proprietaryResult = await testQuery(`
    query GetProprietaryTools {
      tools(where: { isOpenSource: { equals: false } }, take: 10) {
        id
        name
        slug
        description
      }
    }
  `, {}, workingPort)

  if (proprietaryResult.data?.tools) {
    console.log(`✅ Found ${proprietaryResult.data.tools.length} proprietary tools`)
    proprietaryResult.data.tools.forEach((tool: any) => {
      console.log(`  - ${tool.name}`)
    })
  } else {
    console.log('❌ No proprietary tools found:', proprietaryResult.errors?.[0]?.message || 'Unknown error')
  }

  console.log(`\n✅ API testing complete! Working endpoint: localhost:${workingPort}/api/graphql`)
}

if (require.main === module) {
  main()
}