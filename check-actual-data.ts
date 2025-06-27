#!/usr/bin/env tsx

/**
 * Check what's actually running and query the correct schema
 */

async function checkSchema() {
  // Try the expected open source directory queries
  const expectedQuery = `
    query CheckExpectedSchema {
      tools(take: 3) {
        id
        name
        slug
        description
        isOpenSource
        category {
          name
        }
      }
      categories(take: 3) {
        id
        name
        slug
      }
      features(take: 3) {
        id
        name
        featureType
      }
    }
  `

  console.log('🔍 Checking for expected open source directory schema...')
  
  try {
    const response = await fetch('http://localhost:3000/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: expectedQuery })
    })

    const result = await response.json()
    
    if (result.errors) {
      console.log('❌ Expected schema not found. Errors:')
      result.errors.forEach((error: any) => {
        console.log(`  - ${error.message}`)
      })
      
      console.log('\n🔍 Current schema appears to be Medusa/E-commerce')
      console.log('This suggests wrong application is running or database needs migration.')
      
      return false
    } else {
      console.log('✅ Found expected open source directory schema!')
      console.log('Data preview:')
      console.log(`  Tools: ${result.data.tools?.length || 0}`)
      console.log(`  Categories: ${result.data.categories?.length || 0}`)
      console.log(`  Features: ${result.data.features?.length || 0}`)
      
      if (result.data.tools?.length > 0) {
        console.log('\n📋 Sample tools:')
        result.data.tools.forEach((tool: any) => {
          console.log(`  - ${tool.name} (${tool.isOpenSource ? 'Open Source' : 'Proprietary'})`)
        })
      }
      
      return true
    }
  } catch (error) {
    console.error('❌ Failed to query GraphQL:', error)
    return false
  }
}

async function checkAlternatives() {
  const alternativesQuery = `
    query CheckAlternatives {
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
  `
  
  console.log('\n🔗 Checking alternatives data...')
  
  try {
    const response = await fetch('http://localhost:3000/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: alternativesQuery })
    })

    const result = await response.json()
    
    if (!result.errors && result.data.alternatives) {
      console.log(`✅ Found ${result.data.alternatives.length} alternative relationships`)
      result.data.alternatives.forEach((alt: any) => {
        console.log(`  ${alt.openSourceTool?.name} ↔ ${alt.proprietaryTool?.name} (${alt.similarityScore || 'N/A'})`)
      })
    } else {
      console.log('❌ No alternatives found or schema mismatch')
    }
  } catch (error) {
    console.error('❌ Failed to query alternatives:', error)
  }
}

async function main() {
  console.log('🚀 Checking current database state...\n')
  
  const hasCorrectSchema = await checkSchema()
  
  if (hasCorrectSchema) {
    await checkAlternatives()
    console.log('\n💡 The correct schema is running!')
    console.log('If landing page shows "only Shopify alternatives", the issue is in the frontend queries.')
  } else {
    console.log('\n💡 DIAGNOSIS:')
    console.log('The wrong application/database is running. Expected open source directory, got e-commerce.')
    console.log('\nSOLUTIONS:')
    console.log('1. Check if correct database URL is set in .env')
    console.log('2. Run: npm run migrate (to deploy schema)')
    console.log('3. Ensure Keystone config points to correct models')
    console.log('4. Check if multiple services are running on different ports')
  }
}

if (require.main === module) {
  main()
}