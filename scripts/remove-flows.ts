#!/usr/bin/env tsx

/**
 * Remove flows and flow-related data from the database
 * This includes: Flow model, ToolFlow junction table
 */

async function removeFlows() {
  const mutations = [
    // Delete all ToolFlow relationships first
    `
    mutation DeleteAllToolFlows {
      deleteToolFlows(where: {}) {
        count
      }
    }
    `,
    
    // Delete all Flow entries
    `
    mutation DeleteAllFlows {
      deleteFlows(where: {}) {
        count
      }
    }
    `
  ]

  for (const mutation of mutations) {
    try {
      console.log('Executing mutation...')
      const response = await fetch('http://localhost:3000/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.KEYSTONE_AUTH_TOKEN}`
        },
        body: JSON.stringify({ query: mutation })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors)
      } else {
        console.log('Success:', result.data)
      }
    } catch (error) {
      console.error('Failed to execute mutation:', error)
    }
  }
}

async function main() {
  console.log('🗑️  Removing flows from database...')
  
  if (!process.env.KEYSTONE_AUTH_TOKEN) {
    console.error('❌ KEYSTONE_AUTH_TOKEN environment variable is required')
    process.exit(1)
  }
  
  await removeFlows()
  console.log('✅ Flow removal complete!')
}

if (require.main === module) {
  main()
}