#!/usr/bin/env tsx

/**
 * Verify comprehensive e-commerce data in the database
 */

import { GraphQLClient } from 'graphql-request'

const KEYSTONE_SESSION = 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'

const client = new GraphQLClient('http://localhost:3000/api/graphql', {
  headers: {
    'authorization': `Bearer ${KEYSTONE_SESSION}`,
    'cookie': `keystonejs-session=${KEYSTONE_SESSION}`
  }
})

async function verifyEcommerceData() {
  console.log('🔍 Verifying e-commerce data in GraphQL API...\n')
  
  // Query all e-commerce related data
  const query = `
    query VerifyEcommerceData {
      # Get all e-commerce platforms
      ecommercePlatforms: tools(where: {
        category: {
          OR: [
            { name: { contains: "E-commerce" } }
          ]
        }
      }) {
        id
        name
        slug
        description
        isOpenSource
        logoSvg
        githubStars
        category {
          name
        }
        features {
          id
          feature {
            id
            name
            slug
            description
            featureType
          }
          qualityScore
          verified
        }
        proprietaryAlternatives {
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
      
      # Get all e-commerce features
      ecommerceFeatures: features(where: {
        OR: [
          { name: { contains: "catalog" } },
          { name: { contains: "inventory" } },
          { name: { contains: "payment" } },
          { name: { contains: "shipping" } },
          { name: { contains: "tax" } },
          { name: { contains: "currency" } },
          { name: { contains: "language" } },
          { name: { contains: "subscription" } },
          { name: { contains: "B2B" } },
          { name: { contains: "marketplace" } },
          { name: { contains: "analytics" } },
          { name: { contains: "SEO" } },
          { name: { contains: "marketing" } },
          { name: { contains: "segmentation" } },
          { name: { contains: "API" } },
          { name: { contains: "headless" } },
          { name: { contains: "mobile" } },
          { name: { contains: "security" } },
          { name: { contains: "plugin" } },
          { name: { contains: "theme" } },
          { name: { contains: "wishlist" } },
          { name: { contains: "reviews" } },
          { name: { contains: "chat" } },
          { name: { contains: "social" } },
          { name: { contains: "email" } },
          { name: { contains: "discount" } },
          { name: { contains: "loyalty" } },
          { name: { contains: "cart" } },
          { name: { contains: "digital" } }
        ]
      }) {
        id
        name
        slug
        description
        featureType
        tools {
          tool {
            name
          }
          qualityScore
          verified
        }
      }
      
      # Get Shopify alternatives
      shopifyAlternatives: alternatives(where: {
        proprietaryTool: {
          name: { contains: "Shopify" }
        }
      }) {
        id
        proprietaryTool {
          name
        }
        openSourceTool {
          name
          isOpenSource
        }
        similarityScore
        matchType
      }
    }
  `
  
  try {
    const response = await client.request(query)
    const { ecommercePlatforms, ecommerceFeatures, shopifyAlternatives } = response
    
    console.log('📊 E-COMMERCE PLATFORMS VERIFICATION')
    console.log('=====================================\n')
    
    const platforms = ['Shopify', 'WooCommerce', 'PrestaShop', 'Bagisto', 'Medusa', 'Saleor', 'Sylius', 'Vue Storefront']
    
    platforms.forEach(platformName => {
      const platform = ecommercePlatforms.find((p: any) => p.name === platformName)
      if (platform) {
        console.log(`✅ ${platformName}:`)
        console.log(`   - ID: ${platform.id}`)
        console.log(`   - Slug: ${platform.slug}`)
        console.log(`   - Open Source: ${platform.isOpenSource}`)
        console.log(`   - Category: ${platform.category?.name}`)
        console.log(`   - Features Connected: ${platform.features.length}`)
        console.log(`   - GitHub Stars: ${platform.githubStars || 'N/A'}`)
        console.log(`   - Has Logo: ${platform.logoSvg ? 'Yes' : 'No'}`)
        console.log(`   - Description: ${platform.description?.substring(0, 80)}...`)
        
        // Show some key features
        const keyFeatures = platform.features
          .filter((f: any) => ['Product catalog management', 'Payment processing', 'Multi-currency support', 'API capabilities (REST/GraphQL)'].includes(f.feature.name))
          .slice(0, 3)
        
        if (keyFeatures.length > 0) {
          console.log(`   - Sample Features:`)
          keyFeatures.forEach((f: any) => {
            console.log(`     • ${f.feature.name} (Score: ${f.qualityScore})`)
          })
        }
        console.log('')
      } else {
        console.log(`❌ ${platformName}: NOT FOUND\n`)
      }
    })
    
    console.log('🎯 E-COMMERCE FEATURES VERIFICATION')
    console.log('===================================\n')
    
    const keyFeatureNames = [
      'Product catalog management',
      'Inventory tracking', 
      'Payment processing',
      'Multi-currency support',
      'API capabilities (REST/GraphQL)',
      'Headless/decoupled architecture',
      'B2B functionality',
      'Multi-vendor/marketplace',
      'SEO optimization',
      'Marketing automation'
    ]
    
    console.log(`Total E-commerce Features Found: ${ecommerceFeatures.length}\n`)
    
    keyFeatureNames.forEach(featureName => {
      const feature = ecommerceFeatures.find((f: any) => f.name === featureName)
      if (feature) {
        console.log(`✅ ${featureName}:`)
        console.log(`   - ID: ${feature.id}`)
        console.log(`   - Slug: ${feature.slug}`)
        console.log(`   - Type: ${feature.featureType}`)
        console.log(`   - Connected to ${feature.tools.length} tools`)
        console.log(`   - Description: ${feature.description?.substring(0, 60)}...`)
        
        // Show which platforms have this feature
        const toolsWithFeature = feature.tools
          .slice(0, 4)
          .map((t: any) => t.tool?.name)
          .filter(Boolean)
          .join(', ')
        if (toolsWithFeature) {
          console.log(`   - Used by: ${toolsWithFeature}${feature.tools.length > 4 ? '...' : ''}`)
        }
        console.log('')
      } else {
        console.log(`❌ ${featureName}: NOT FOUND\n`)
      }
    })
    
    console.log('🔗 SHOPIFY ALTERNATIVES VERIFICATION')
    console.log('====================================\n')
    
    console.log(`Total Shopify Alternatives: ${shopifyAlternatives.length}\n`)
    
    shopifyAlternatives.forEach((alt: any) => {
      console.log(`✅ ${alt.openSourceTool.name}:`)
      console.log(`   - ID: ${alt.id}`)
      console.log(`   - Open Source: ${alt.openSourceTool.isOpenSource}`)
      console.log(`   - Similarity Score: ${alt.similarityScore || 'N/A'}`)
      console.log(`   - Match Type: ${alt.matchType || 'N/A'}`)
      console.log('')
    })
    
    // Summary statistics
    console.log('📈 SUMMARY STATISTICS')
    console.log('====================\n')
    
    const totalPlatforms = ecommercePlatforms.length
    const openSourcePlatforms = ecommercePlatforms.filter((p: any) => p.isOpenSource).length
    const totalFeatures = ecommerceFeatures.length
    const totalAlternatives = shopifyAlternatives.length
    
    console.log(`• Total E-commerce Platforms: ${totalPlatforms}`)
    console.log(`• Open Source Platforms: ${openSourcePlatforms}`)
    console.log(`• Proprietary Platforms: ${totalPlatforms - openSourcePlatforms}`)
    console.log(`• Total E-commerce Features: ${totalFeatures}`)
    console.log(`• Shopify Alternatives: ${totalAlternatives}`)
    
    // Calculate average features per platform
    const avgFeatures = Math.round(ecommercePlatforms.reduce((sum: number, p: any) => sum + p.features.length, 0) / totalPlatforms)
    console.log(`• Average Features per Platform: ${avgFeatures}`)
    
    // Feature type breakdown
    const featureTypes = ecommerceFeatures.reduce((acc: any, f: any) => {
      acc[f.featureType] = (acc[f.featureType] || 0) + 1
      return acc
    }, {})
    
    console.log(`• Feature Types:`)
    Object.entries(featureTypes).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`)
    })
    
    console.log('\n✅ E-commerce data verification complete!')
    
  } catch (error) {
    console.error('❌ Error verifying e-commerce data:', error)
  }
}

verifyEcommerceData().catch(console.error)