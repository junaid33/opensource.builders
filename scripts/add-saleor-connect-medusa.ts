#!/usr/bin/env tsx

import { GraphQLClient } from 'graphql-request';

const KEYSTONE_SESSION = 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw';

const client = new GraphQLClient('http://localhost:3000/api/graphql', {
  headers: {
    'authorization': `Bearer ${KEYSTONE_SESSION}`,
    'cookie': `keystonejs-session=${KEYSTONE_SESSION}`
  }
});

async function createSaleor() {
  const mutation = `
    mutation CreateSaleor($data: ToolCreateInput!) {
      createTool(data: $data) {
        id
        name
        slug
      }
    }
  `;

  // Saleor brand color is a sophisticated teal/cyan
  const saleorData = {
    name: 'Saleor',
    slug: 'saleor-ecommerce',
    description: 'Headless, GraphQL commerce platform delivering ultra-fast, dynamic, personalized shopping experiences.',
    websiteUrl: 'https://saleor.io',
    repositoryUrl: 'https://github.com/saleor/saleor',
    githubStars: 20600,
    license: 'BSD-3-Clause',
    isOpenSource: true,
    category: {
      connect: {
        slug: 'ecommerce'
      }
    },
    logoSvg: `<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <rect width="56" height="56" rx="12" fill="#0F172A"/>
                <rect x="8" y="8" width="40" height="40" rx="8" fill="#06B6D4"/>
                <text x="28" y="32" text-anchor="middle" 
                      fill="white" font-family="system-ui, sans-serif" 
                      font-size="22" font-weight="700">S</text>
              </svg>`
  };

  try {
    const result = await client.request(mutation, { data: saleorData });
    console.log('✅ Created Saleor:', result.createTool);
    return result.createTool.id;
  } catch (error) {
    console.error('❌ Failed to create Saleor:', error);
    return null;
  }
}

async function updateMedusaWithLogo() {
  const mutation = `
    mutation UpdateMedusa($id: ID!, $data: ToolUpdateInput!) {
      updateTool(where: { id: $id }, data: $data) {
        id
        name
        logoSvg
      }
    }
  `;

  // Medusa brand color is purple/indigo
  const medusaLogo = `<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                        <rect width="56" height="56" rx="12" fill="#1E1B4B"/>
                        <rect x="8" y="8" width="40" height="40" rx="8" fill="#7C3AED"/>
                        <text x="28" y="32" text-anchor="middle" 
                              fill="white" font-family="system-ui, sans-serif" 
                              font-size="22" font-weight="700">M</text>
                      </svg>`;

  try {
    const result = await client.request(mutation, {
      id: 'cmc0pecbq002c8or8oq25m8vn', // Medusa ID from earlier query
      data: { logoSvg: medusaLogo }
    });
    console.log('✅ Updated Medusa logo:', result.updateTool);
    return result.updateTool.id;
  } catch (error) {
    console.error('❌ Failed to update Medusa logo:', error);
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

    // Create alternative relationships for each tool
    for (const toolId of toolIds) {
      if (!toolId) continue;
      
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
  console.log('🚀 Adding Saleor and updating Medusa...\n');

  // Create Saleor
  const saleorId = await createSaleor();
  
  // Update Medusa with logo
  const medusaId = await updateMedusaWithLogo();

  // Create alternative relationships
  const toolIds = [saleorId, medusaId].filter(Boolean);
  if (toolIds.length > 0) {
    await createAlternativeRelationships(toolIds);
  }

  console.log('\n🎉 Completed! Saleor created and Medusa updated with logo.');
  console.log('💡 Now you should have even more Shopify alternatives with proper logos!');
}

main().catch(console.error);