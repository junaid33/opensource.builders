#!/usr/bin/env tsx

/**
 * Complete feature connections for e-commerce platforms that were missed
 */

import { GraphQLClient } from 'graphql-request'

const KEYSTONE_SESSION = 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'

const client = new GraphQLClient('http://localhost:3000/api/graphql', {
  headers: {
    'authorization': `Bearer ${KEYSTONE_SESSION}`,
    'cookie': `keystonejs-session=${KEYSTONE_SESSION}`
  }
})

// Feature support matrix based on your comprehensive analysis
const platformFeatureSupport = {
  'Medusa': {
    // Missing: Multi-language, Customer segmentation, Multi-vendor/marketplace, Loyalty programs  
    excludedFeatures: [
      'Multi-language support',
      'Customer segmentation', 
      'Multi-vendor/marketplace',
      'Loyalty programs'
    ]
  },
  'Saleor': {
    // Missing: Loyalty programs (partial support)
    excludedFeatures: [
      'Loyalty programs'
    ]
  },
  'Sylius': {
    // Missing: Loyalty programs (partial support)
    excludedFeatures: [
      'Loyalty programs'
    ]
  },
  'Vue Storefront': {
    // Frontend only - missing backend features
    excludedFeatures: [
      'Product catalog management',
      'Inventory tracking',
      'Order management', 
      'Payment processing',
      'Shipping & logistics',
      'Tax management',
      'Multi-language support',
      'Subscription/recurring billing',
      'Digital product support',
      'B2B functionality',
      'Multi-vendor/marketplace',
      'Advanced analytics',
      'Marketing automation',
      'Customer segmentation',
      'Discount/coupon system',
      'Loyalty programs',
      'Abandoned cart recovery',
      'Wishlist functionality',
      'Product reviews/ratings',
      'Email marketing'
    ]
  }
}

async function completeFeatureConnections() {
  console.log('🔗 Completing feature connections for e-commerce platforms...\n')
  
  // Get all features and tools
  const getAllQuery = `
    query GetAllFeaturesAndTools {
      features(where: {
        OR: [
          { featureType: { equals: "core" } },
          { featureType: { equals: "integration" } },
          { featureType: { equals: "analytics" } },
          { featureType: { equals: "ui_ux" } },
          { featureType: { equals: "performance" } },
          { featureType: { equals: "security" } },
          { featureType: { equals: "customization" } }
        ]
      }) {
        id
        name
        featureType
      }
      tools(where: {
        category: {
          OR: [
            { name: { contains: "E-commerce" } }
          ]
        }
      }) {
        id
        name
        slug
        features {
          feature {
            name
          }
        }
      }
    }
  `
  
  const { features, tools } = await client.request(getAllQuery)
  
  console.log(`Found ${features.length} features and ${tools.length} e-commerce tools\n`)
  
  // Process each platform
  for (const tool of tools) {
    const platformSupport = platformFeatureSupport[tool.name as keyof typeof platformFeatureSupport]
    const excludedFeatures = platformSupport?.excludedFeatures || []
    
    // Get features this tool should have but doesn't
    const currentFeatureNames = tool.features.map((f: any) => f.feature.name)
    const missingFeatures = features.filter((feature: any) => 
      !currentFeatureNames.includes(feature.name) && 
      !excludedFeatures.includes(feature.name)
    )
    
    console.log(`\n🔧 Processing ${tool.name}:`)
    console.log(`   Current features: ${currentFeatureNames.length}`)
    console.log(`   Missing features: ${missingFeatures.length}`)
    console.log(`   Excluded features: ${excludedFeatures.length}`)
    
    if (missingFeatures.length === 0) {
      console.log(`   ✅ ${tool.name} already has all required features`)
      continue
    }
    
    // Connect missing features
    let connected = 0
    for (const feature of missingFeatures) {
      try {
        const connectFeatureQuery = `
          mutation ConnectFeature($data: ToolFeatureCreateInput!) {
            createToolFeature(data: $data) {
              id
              tool {
                name
              }
              feature {
                name
              }
            }
          }
        `
        
        await client.request(connectFeatureQuery, {
          data: {
            tool: { connect: { id: tool.id } },
            feature: { connect: { id: feature.id } },
            verified: true,
            qualityScore: tool.name === 'Shopify' ? 10 : 8
          }
        })
        
        connected++
        if (connected % 5 === 0) {
          console.log(`   ✅ Connected ${connected}/${missingFeatures.length} features...`)
        }
      } catch (error: any) {
        if (error.message.includes('Unique constraint failed')) {
          // Already connected, skip
        } else {
          console.error(`   ❌ Error connecting ${feature.name}:`, error.message)
        }
      }
    }
    
    console.log(`   ✅ Connected ${connected} new features to ${tool.name}`)
  }
  
  // Final verification
  console.log('\n📊 FINAL FEATURE COUNTS:')
  for (const tool of tools) {
    const platformSupport = platformFeatureSupport[tool.name as keyof typeof platformFeatureSupport]
    const excludedCount = platformSupport?.excludedFeatures?.length || 0
    const expectedFeatures = features.length - excludedCount
    
    // Re-fetch to get updated count
    const verifyQuery = `
      query VerifyTool($id: ID!) {
        tool(where: { id: $id }) {
          name
          features {
            feature {
              name
            }
          }
        }
      }
    `
    
    const { tool: updatedTool } = await client.request(verifyQuery, { id: tool.id })
    const actualFeatures = updatedTool.features.length
    const compatibility = Math.round((actualFeatures / 32) * 100)
    
    console.log(`• ${tool.name}: ${actualFeatures}/${expectedFeatures} features (${compatibility}% compatibility)`)
  }
  
  console.log('\n✅ Feature connections complete!')
}

completeFeatureConnections().catch(console.error)