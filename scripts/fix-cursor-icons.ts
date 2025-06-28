#!/usr/bin/env npx tsx

/**
 * Script to apply proper Simple Icons to Cursor alternatives
 */

import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION || 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'}`
  }
});

// Better icon mappings for Cursor alternatives
const iconUpdates = [
  { slug: 'cursor', simpleIconSlug: 'visualstudiocode', simpleIconColor: '#007ACC' }, // Until cursor icon exists
  { slug: 'roo-code', simpleIconSlug: 'r', simpleIconColor: '#276DC3' },
  { slug: 'cline', simpleIconSlug: 'anthropic', simpleIconColor: '#D97757' },
  { slug: 'kilo-code', simpleIconSlug: 'k', simpleIconColor: '#326CE5' },
  { slug: 'plandex', simpleIconSlug: 'plantuml', simpleIconColor: '#FBBD2A' },
  { slug: 'gemini-cli', simpleIconSlug: 'googlegemini', simpleIconColor: '#4285F4' }
];

const UPDATE_TOOL_ICON = `
  mutation UpdateToolIcon($slug: String!, $data: ToolUpdateInput!) {
    updateTool(where: { slug: $slug }, data: $data) {
      id
      name
      slug
      simpleIconSlug
      simpleIconColor
    }
  }
`;

async function main() {
  try {
    console.log('🎨 Fixing Cursor alternatives icons...\n');
    
    let updated = 0;
    let failed = 0;
    
    for (const iconUpdate of iconUpdates) {
      try {
        console.log(`🎯 Updating ${iconUpdate.slug} with ${iconUpdate.simpleIconSlug} icon...`);
        
        const result = await client.request(UPDATE_TOOL_ICON, {
          slug: iconUpdate.slug,
          data: {
            simpleIconSlug: iconUpdate.simpleIconSlug,
            simpleIconColor: iconUpdate.simpleIconColor
          }
        });
        
        if (result.updateTool) {
          console.log(`  ✅ Applied ${iconUpdate.simpleIconSlug} (${iconUpdate.simpleIconColor}) to ${result.updateTool.name}`);
          updated++;
        } else {
          console.log(`  ⚠️  Tool with slug '${iconUpdate.slug}' not found`);
        }
        
      } catch (error) {
        console.error(`  ❌ Failed to update ${iconUpdate.slug}:`, error);
        failed++;
      }
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log(`\n🎉 Cursor icons update completed!`);
    console.log(`📊 Summary:`);
    console.log(`  - Updated: ${updated} tools`);
    console.log(`  - Failed: ${failed} tools`);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}