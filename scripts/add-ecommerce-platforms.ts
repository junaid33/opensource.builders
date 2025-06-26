#!/usr/bin/env tsx

import { GraphQLClient } from 'graphql-request';

const KEYSTONE_SESSION = 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw';

const client = new GraphQLClient('http://localhost:3000/api/graphql', {
  headers: {
    'authorization': `Bearer ${KEYSTONE_SESSION}`,
    'cookie': `keystonejs-session=${KEYSTONE_SESSION}`
  }
});

const ecommercePlatforms = [
  {
    name: 'PrestaShop',
    slug: 'prestashop',
    description: 'Free, open source and fully customizable e-commerce solution with powerful features for creating online stores.',
    websiteUrl: 'https://prestashop.com',
    repositoryUrl: 'https://github.com/PrestaShop/PrestaShop',
    githubStars: 7800,
    license: 'OSL-3.0',
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="28" fill="#DF0067"/>
                <text x="28" y="28" dy="0.35em" text-anchor="middle" 
                      fill="white" font-family="system-ui, sans-serif" 
                      font-size="28" font-weight="600">P</text>
              </svg>`
  },
  {
    name: 'Bagisto',
    slug: 'bagisto',
    description: 'Free & Opensource Laravel eCommerce framework built for all to build and scale your business.',
    websiteUrl: 'https://bagisto.com',
    repositoryUrl: 'https://github.com/bagisto/bagisto',
    githubStars: 10400,
    license: 'MIT',
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="28" fill="#FF6B35"/>
                <text x="28" y="28" dy="0.35em" text-anchor="middle" 
                      fill="white" font-family="system-ui, sans-serif" 
                      font-size="28" font-weight="600">B</text>
              </svg>`
  },
  {
    name: 'Medusa',
    slug: 'medusa',
    description: 'The open-source Shopify alternative. A modular commerce stack built with Node.js.',
    websiteUrl: 'https://medusajs.com',
    repositoryUrl: 'https://github.com/medusajs/medusa',
    githubStars: 22000,
    license: 'MIT',
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="28" fill="#7C3AED"/>
                <text x="28" y="28" dy="0.35em" text-anchor="middle" 
                      fill="white" font-family="system-ui, sans-serif" 
                      font-size="28" font-weight="600">M</text>
              </svg>`
  },
  {
    name: 'Sylius',
    slug: 'sylius',
    description: 'Open Source eCommerce Platform on Symfony. Modern PHP e-commerce solution for sophisticated applications.',
    websiteUrl: 'https://sylius.com',
    repositoryUrl: 'https://github.com/Sylius/Sylius',
    githubStars: 7800,
    license: 'MIT',
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="28" fill="#1ABC9C"/>
                <text x="28" y="28" dy="0.35em" text-anchor="middle" 
                      fill="white" font-family="system-ui, sans-serif" 
                      font-size="28" font-weight="600">S</text>
              </svg>`
  },
  {
    name: 'Vue Storefront',
    slug: 'vue-storefront',
    description: 'Frontend as a Service for eCommerce. Build blazing-fast storefronts that convert better.',
    websiteUrl: 'https://vuestorefront.io',
    repositoryUrl: 'https://github.com/vuestorefront/vue-storefront',
    githubStars: 10400,
    license: 'MIT',
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="28" fill="#4FC08D"/>
                <text x="28" y="28" dy="0.35em" text-anchor="middle" 
                      fill="white" font-family="system-ui, sans-serif" 
                      font-size="28" font-weight="600">V</text>
              </svg>`
  },
  {
    name: 'Saleor',
    slug: 'saleor',
    description: 'Headless, GraphQL commerce platform delivering ultra-fast, dynamic, personalized shopping experiences.',
    websiteUrl: 'https://saleor.io',
    repositoryUrl: 'https://github.com/saleor/saleor',
    githubStars: 20000,
    license: 'BSD-3-Clause',
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="28" fill="#06B6D4"/>
                <text x="28" y="28" dy="0.35em" text-anchor="middle" 
                      fill="white" font-family="system-ui, sans-serif" 
                      font-size="28" font-weight="600">S</text>
              </svg>`
  }
];

async function createPlatform(platform: typeof ecommercePlatforms[0]) {
  const mutation = `
    mutation CreateTool($data: ToolCreateInput!) {
      createTool(data: $data) {
        id
        name
        slug
      }
    }
  `;

  const data = {
    ...platform,
    isOpenSource: true,
    category: {
      connect: {
        slug: 'ecommerce'
      }
    }
  };

  try {
    const result = await client.request(mutation, { data });
    console.log(`✅ Created ${platform.name}:`, result.createTool);
    return result.createTool;
  } catch (error) {
    console.error(`❌ Failed to create ${platform.name}:`, error);
    return null;
  }
}

async function updateWooCommerceLogo() {
  const mutation = `
    mutation UpdateWooCommerce($id: ID!, $data: ToolUpdateInput!) {
      updateTool(where: { id: $id }, data: $data) {
        id
        name
        logoSvg
      }
    }
  `;

  const woocommerceLogo = `<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                            <rect width="56" height="56" rx="8" fill="#96588A"/>
                            <path d="M14 20h28v16H14z" fill="white"/>
                            <path d="M16 28l10 6 10-6 6 3v10H10V31z" fill="#96588A"/>
                          </svg>`;

  try {
    const result = await client.request(mutation, {
      id: 'cmbjbhoqy002ke6qfd7mtu4jv',
      data: { logoSvg: woocommerceLogo }
    });
    console.log('✅ Updated WooCommerce logo:', result.updateTool);
    return result.updateTool;
  } catch (error) {
    console.error('❌ Failed to update WooCommerce logo:', error);
    return null;
  }
}

async function createAlternativeRelationships(toolIds: string[]) {
  console.log('\n🔗 Creating alternative relationships with Shopify...');
  
  // Get Shopify ID
  const shopifyQuery = `
    query GetShopify {
      tools(where: { name: { equals: "Shopify" } }) {
        id
      }
    }
  `;

  try {
    const shopifyResult = await client.request(shopifyQuery);
    const shopifyId = shopifyResult.tools[0]?.id;

    if (!shopifyId) {
      console.error('❌ Shopify not found in database');
      return;
    }

    // Create alternative relationships for each new tool
    for (const toolId of toolIds) {
      const createAlternativeMutation = `
        mutation CreateAlternative($data: AlternativeCreateInput!) {
          createAlternative(data: $data) {
            id
            openSourceTool { name }
            proprietaryTool { name }
          }
        }
      `;

      try {
        const result = await client.request(createAlternativeMutation, {
          data: {
            openSourceTool: { connect: { id: toolId } },
            proprietaryTool: { connect: { id: shopifyId } }
          }
        });
        console.log(`✅ Created alternative relationship: ${result.createAlternative.openSourceTool.name} ↔ ${result.createAlternative.proprietaryTool.name}`);
      } catch (error) {
        console.error('❌ Failed to create alternative relationship:', error);
      }
    }
  } catch (error) {
    console.error('❌ Failed to get Shopify ID:', error);
  }
}

async function main() {
  console.log('🚀 Adding e-commerce platforms...\n');

  // Update WooCommerce logo first
  await updateWooCommerceLogo();

  // Create all new platforms
  const createdTools: string[] = [];
  for (const platform of ecommercePlatforms) {
    const result = await createPlatform(platform);
    if (result?.id) {
      createdTools.push(result.id);
    }
  }

  // Create alternative relationships
  if (createdTools.length > 0) {
    await createAlternativeRelationships(createdTools);
  }

  console.log(`\n🎉 Completed! Created ${createdTools.length} new e-commerce platforms.`);
  console.log('💡 Now you can test the Shopify alternatives page with more options!');
}

main().catch(console.error);