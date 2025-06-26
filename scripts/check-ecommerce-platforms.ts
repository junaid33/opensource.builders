#!/usr/bin/env tsx

/**
 * Check which e-commerce platforms exist in the database
 */

import { GraphQLClient } from 'graphql-request'

const KEYSTONE_SESSION = 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'

const client = new GraphQLClient('http://localhost:3000/api/graphql', {
  headers: {
    'authorization': `Bearer ${KEYSTONE_SESSION}`,
    'cookie': `keystonejs-session=${KEYSTONE_SESSION}`
  }
})

async function checkEcommercePlatforms() {
  console.log('🔍 Checking e-commerce platforms in database...\n')
  
  const platforms = [
    'Shopify',
    'WooCommerce', 
    'PrestaShop',
    'Bagisto',
    'Medusa',
    'Saleor',
    'Sylius',
    'Vue Storefront'
  ]
  
  const query = `
    query CheckEcommercePlatforms {
      tools(where: { 
        OR: [
          ${platforms.map(name => `{ name: { contains: "${name}" } }`).join(', ')}
        ]
      }) {
        id
        name
        slug
        description
        isOpenSource
        logoSvg
        category {
          name
        }
        proprietaryAlternatives {
          id
          openSourceTool {
            name
          }
          proprietaryTool {
            name
          }
        }
        features {
          feature {
            name
            featureType
          }
        }
      }
      
      # Also query alternatives where these tools are the open source alternative
      alternatives(where: {
        openSourceTool: {
          OR: [
            ${platforms.map(name => `{ name: { contains: "${name}" } }`).join(', ')}
          ]
        }
      }) {
        proprietaryTool {
          name
        }
        openSourceTool {
          name
        }
      }
    }
  `
  
  try {
    const response = await client.request(query)
    const { tools, alternatives } = response
    
    console.log(`📊 Found ${tools.length} e-commerce platforms:\n`)
    
    platforms.forEach(platformName => {
      const found = tools.find((tool: any) => 
        tool.name.toLowerCase().includes(platformName.toLowerCase())
      )
      
      if (found) {
        console.log(`✅ ${platformName}:`)
        console.log(`   - Name: ${found.name}`)
        console.log(`   - Slug: ${found.slug}`)
        console.log(`   - Open Source: ${found.isOpenSource}`)
        console.log(`   - Category: ${found.category?.name || 'None'}`)
        console.log(`   - Features: ${found.features.length}`)
        console.log(`   - Proprietary Alternatives: ${found.proprietaryAlternatives.length}`)
        console.log(`   - Has Logo: ${found.logoSvg ? 'Yes' : 'No'}`)
        
        // Show which proprietary tools this is an alternative to
        const asAlternative = alternatives.filter((alt: any) => 
          alt.openSourceTool?.name === found.name
        )
        if (asAlternative.length > 0) {
          console.log(`   - Alternative to: ${asAlternative.map((alt: any) => alt.proprietaryTool?.name).join(', ')}`)
        }
        console.log('')
      } else {
        console.log(`❌ ${platformName}: Not found`)
        console.log('')
      }
    })
    
    // Check Shopify alternatives specifically
    const shopifyAlternatives = alternatives.filter((alt: any) => 
      alt.proprietaryTool?.name?.toLowerCase().includes('shopify')
    )
    
    console.log(`🔗 Open source alternatives to Shopify: ${shopifyAlternatives.length}`)
    shopifyAlternatives.forEach((alt: any) => {
      console.log(`   - ${alt.openSourceTool?.name}`)
    })
    
  } catch (error) {
    console.error('❌ Error checking platforms:', error)
  }
}

checkEcommercePlatforms().catch(console.error)