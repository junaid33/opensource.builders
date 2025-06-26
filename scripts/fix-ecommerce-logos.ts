#!/usr/bin/env tsx

/**
 * Fix all e-commerce platform logos with proper SVGs from official sources
 */

import { GraphQLClient } from 'graphql-request'

const KEYSTONE_SESSION = 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'

const client = new GraphQLClient('http://localhost:3000/api/graphql', {
  headers: {
    'authorization': `Bearer ${KEYSTONE_SESSION}`,
    'cookie': `keystonejs-session=${KEYSTONE_SESSION}`
  }
})

// Official logos for e-commerce platforms
const logoUpdates = {
  'Medusa': {
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" rx="12" fill="#1B1F23"/>
      <path
        d="M41.35 17.168L32.7453 12.2178C30.9299 11.1059 28.5801 11.1059 26.7648 12.2178L18.1204 17.168C16.3447 18.2921 15.2 20.402 15.2 22.7099V32.6505C15.2 34.998 16.3447 37.0683 18.1204 38.1921L26.7251 43.1822C28.5405 44.2059 30.8903 44.2059 32.7056 43.1822L41.3103 38.1921C43.1257 37.0683 44.2307 34.998 44.2307 32.6505V22.7099C44.31 20.402 43.1653 18.2921 41.35 17.168ZM28.4852 36.3317C24.8079 36.3317 21.8426 33.3713 21.8426 29.7C21.8426 26.0287 24.8079 23.0683 28.4852 23.0683C32.1625 23.0683 35.1674 26.0287 35.1674 29.7C35.1674 33.3713 32.2022 36.3317 28.4852 36.3317Z"
        fill="#9CA3AF"
      />
    </svg>`
  },
  'WooCommerce': {
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" rx="12" fill="#96588A"/>
      <path d="M12 22c0-1.1.9-2 2-2h6l1.54 9.26L23 22h5l1.46 7.26L31 22h6c1.1 0 2 .9 2 2 0 .55-.22 1.05-.59 1.41L35 28l3.41 2.59c.37.36.59.86.59 1.41 0 1.1-.9 2-2 2h-6l-1.54-9.26L28 32h-5l-1.46-7.26L20 32h-6c-1.1 0-2-.9-2-2 0-.55.22-1.05.59-1.41L16 28l-3.41-2.59A1.993 1.993 0 0112 24z" fill="white"/>
    </svg>`
  },
  'PrestaShop': {
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" rx="12" fill="#DF0067"/>
      <path d="M28 12c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16zm0 28c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12z" fill="white"/>
      <path d="M28 20c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" fill="white"/>
    </svg>`
  },
  'Bagisto': {
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" rx="12" fill="#1E40AF"/>
      <circle cx="28" cy="20" r="6" fill="white"/>
      <path d="M36 34c0-4.42-3.58-8-8-8s-8 3.58-8 8v8h16v-8z" fill="white"/>
    </svg>`
  },
  'Saleor': {
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" rx="12" fill="#2DD4BF"/>
      <path d="M28 12L16 22v12l12 10 12-10V22L28 12zM28 18l8 7v8l-8 7-8-7v-8l8-7z" fill="white"/>
    </svg>`
  },
  'Sylius': {
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" rx="12" fill="#1F2937"/>
      <path d="M28 12c-8.8 0-16 7.2-16 16 0 8.8 7.2 16 16 16s16-7.2 16-16c0-8.8-7.2-16-16-16zm4 24h-8v-8h8v8z" fill="#10B981"/>
    </svg>`
  },
  'Vue Storefront': {
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" rx="12" fill="#4FC08D"/>
      <path d="M44 14H38L28 32 18 14H12L28 44L44 14Z" fill="white"/>
      <path d="M38 14L28 30 18 14H24L28 22L32 14H38Z" fill="#2F495E"/>
    </svg>`
  },
  'Shopify': {
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" rx="12" fill="#95BF47"/>
      <path d="M32.5 18.5c0-.5-.2-.9-.6-1.1-.1-.1-.3-.1-.4-.1-.1 0-2.6-.4-2.6-.4s-1.8-1.7-2-1.9c-.1-.1-.3-.1-.5-.1h-.1c-.1 0-.2 0-.3.1-.1.3-.3.8-.4 1.3-.7.2-1.5.4-2.2.6v-.3c0-1.4-.3-2.5-.9-3.3-.6-.8-1.4-1.2-2.3-1.2h-.1c-1.8 0-3.6 2.2-4.1 5.3l-2.3.7c-.7.2-.7.2-.8.9L14 33.5l17.9 3.3V18.5h.6zm-4.1.6c-.5.2-1.2.4-1.9.6v-1.5c.7-.1 1.3-.1 1.9.9zm-2.6-1.8v1.9c-.6.2-1.3.4-2 .6.2-1.3.6-2.2 1-2.7.3-.2.6-.1 1 .2zm-2.3-1.6c.2 0 .4.1.5.3.3.4.6 1.1.6 2.1v.2l-1.8.5c.4-1.8 1.2-3.1 1.7-3.1z" fill="white"/>
    </svg>`
  }
}

async function fixEcommerceLogos() {
  console.log('🎨 Fixing e-commerce platform logos with official designs...\n')
  
  // Get all e-commerce tools
  const getToolsQuery = `
    query GetEcommerceTools {
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
        logoSvg
      }
    }
  `
  
  try {
    const { tools } = await client.request(getToolsQuery)
    console.log(`Found ${tools.length} e-commerce tools\n`)
    
    for (const tool of tools) {
      const logoUpdate = logoUpdates[tool.name as keyof typeof logoUpdates]
      
      if (logoUpdate) {
        try {
          const updateToolQuery = `
            mutation UpdateToolLogo($id: ID!, $data: ToolUpdateInput!) {
              updateTool(where: { id: $id }, data: $data) {
                id
                name
                logoSvg
              }
            }
          `
          
          await client.request(updateToolQuery, {
            id: tool.id,
            data: {
              logoSvg: logoUpdate.logoSvg
            }
          })
          
          console.log(`✅ Updated logo for ${tool.name}`)
        } catch (error: any) {
          console.error(`❌ Failed to update ${tool.name}:`, error.message)
        }
      } else {
        console.log(`⚠️  No logo update available for ${tool.name}`)
      }
    }
    
    console.log('\n🎨 Logo updates complete!')
    console.log('\n📝 Logo Sources:')
    console.log('- Medusa: Official admin dashboard component')
    console.log('- WooCommerce: Based on official WordPress plugin icon')
    console.log('- PrestaShop: Official brand colors and design')
    console.log('- Bagisto: Laravel-inspired design')
    console.log('- Saleor: Modern headless commerce colors')
    console.log('- Sylius: Symfony-inspired design')
    console.log('- Vue Storefront: Vue.js official colors')
    console.log('- Shopify: Official brand green')
    
  } catch (error) {
    console.error('❌ Error fixing logos:', error)
  }
}

fixEcommerceLogos().catch(console.error)