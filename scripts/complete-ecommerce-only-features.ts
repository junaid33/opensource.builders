#!/usr/bin/env tsx

/**
 * Complete feature connections ONLY for the 32 e-commerce features we added
 */

import { GraphQLClient } from 'graphql-request'

const KEYSTONE_SESSION = 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'

const client = new GraphQLClient('http://localhost:3000/api/graphql', {
  headers: {
    'authorization': `Bearer ${KEYSTONE_SESSION}`,
    'cookie': `keystonejs-session=${KEYSTONE_SESSION}`
  }
})

// The 32 e-commerce features we specifically added
const ecommerceFeatureNames = [
  'Product catalog management',
  'Inventory tracking', 
  'Order management',
  'Payment processing',
  'Shipping & logistics',
  'Tax management',
  'Multi-currency support',
  'Multi-language support',
  'Subscription/recurring billing',
  'Digital product support',
  'B2B functionality',
  'Multi-vendor/marketplace',
  'Advanced analytics',
  'SEO optimization',
  'Marketing automation',
  'Customer segmentation',
  'Discount/coupon system',
  'Loyalty programs',
  'Abandoned cart recovery',
  'Email marketing',
  'API capabilities (REST/GraphQL)',
  'Headless/decoupled architecture',
  'Mobile responsiveness',
  'Performance optimization',
  'Security features',
  'Third-party integrations',
  'Plugin/extension system',
  'Theme customization',
  'Wishlist functionality',
  'Product reviews/ratings',
  'Live chat integration',
  'Social media integration'
]

// Platform support based on your analysis
const platformSupport = {
  'Medusa': {
    excludedFeatures: ['Multi-language support', 'Customer segmentation', 'Multi-vendor/marketplace', 'Loyalty programs']
  },
  'Saleor': {
    excludedFeatures: ['Loyalty programs']
  },
  'Sylius': {
    excludedFeatures: ['Loyalty programs']
  },
  'Vue Storefront': {
    // Frontend only
    excludedFeatures: [
      'Product catalog management', 'Inventory tracking', 'Order management', 'Payment processing',
      'Shipping & logistics', 'Tax management', 'Multi-language support', 'Subscription/recurring billing',
      'Digital product support', 'B2B functionality', 'Multi-vendor/marketplace', 'Advanced analytics',
      'Marketing automation', 'Customer segmentation', 'Discount/coupon system', 'Loyalty programs',
      'Abandoned cart recovery', 'Wishlist functionality', 'Product reviews/ratings', 'Email marketing'
    ]
  }
}

async function completeEcommerceFeatures() {
  console.log('🛒 Completing e-commerce feature connections...\n')
  
  // Get only e-commerce features and tools
  const query = `
    query GetEcommerceData {
      features(where: {
        OR: [
          ${ecommerceFeatureNames.map(name => `{ name: { equals: "${name}" } }`).join(', ')}
        ]
      }) {
        id
        name
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
        features {
          feature {
            name
          }
        }
      }
    }
  `
  
  const { features, tools } = await client.request(query)
  
  console.log(`Found ${features.length} e-commerce features and ${tools.length} tools\n`)
  
  for (const tool of tools) {
    const toolSupport = platformSupport[tool.name as keyof typeof platformSupport]
    const excludedFeatures = toolSupport?.excludedFeatures || []
    
    const currentFeatureNames = tool.features.map((f: any) => f.feature.name)
    const missingFeatures = features.filter((feature: any) => 
      !currentFeatureNames.includes(feature.name) && 
      !excludedFeatures.includes(feature.name)
    )
    
    console.log(`\n🔧 ${tool.name}:`)
    console.log(`   Current: ${currentFeatureNames.length} features`)
    console.log(`   Missing: ${missingFeatures.length} features`)
    console.log(`   Excluded: ${excludedFeatures.length} features`)
    
    let connected = 0
    for (const feature of missingFeatures) {
      try {
        const connectQuery = `
          mutation ConnectEcommerceFeature($data: ToolFeatureCreateInput!) {
            createToolFeature(data: $data) {
              id
              tool { name }
              feature { name }
            }
          }
        `
        
        await client.request(connectQuery, {
          data: {
            tool: { connect: { id: tool.id } },
            feature: { connect: { id: feature.id } },
            verified: true,
            qualityScore: tool.name === 'Shopify' ? 10 : 8
          }
        })
        
        connected++
      } catch (error: any) {
        if (!error.message.includes('Unique constraint failed')) {
          console.error(`   ❌ Error connecting ${feature.name}: ${error.message}`)
        }
      }
    }
    
    console.log(`   ✅ Connected ${connected} new features`)
    
    // Calculate final score
    const expectedFeatures = ecommerceFeatureNames.length - excludedFeatures.length
    const finalFeatures = currentFeatureNames.length + connected
    const compatibility = Math.round((finalFeatures / 32) * 100)
    
    console.log(`   📊 Final: ${finalFeatures}/${expectedFeatures} features (${compatibility}% compatibility)`)
  }
  
  console.log('\n✅ E-commerce feature connections complete!')
}

completeEcommerceFeatures().catch(console.error)