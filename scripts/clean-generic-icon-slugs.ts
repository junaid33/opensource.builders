#!/usr/bin/env npx tsx

/**
 * Script to clean up generic single-letter Simple Icon slugs while keeping colors
 * This removes slugs like "e", "d", "r" but preserves the colors for background use
 */

import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION || 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'}`
  }
});

const GET_GENERIC_ICONS = `
  query {
    tools(where: { 
      simpleIconSlug: { 
        in: ["e", "r", "c", "k", "a", "b", "d", "f", "g", "h", "i", "j", "l", "m", "n", "o", "p", "q", "s", "t", "u", "v", "w", "x", "y", "z"] 
      } 
    }) {
      id
      name
      slug
      simpleIconSlug
      simpleIconColor
    }
  }
`;

const CLEAR_ICON_SLUG = `
  mutation ClearIconSlug($id: ID!) {
    updateTool(where: { id: $id }, data: { 
      simpleIconSlug: ""
    }) {
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
    console.log('🧹 Cleaning up generic single-letter icon slugs (keeping colors)...\n');
    
    const result = await client.request(GET_GENERIC_ICONS);
    const tools = result.tools;
    
    console.log(`Found ${tools.length} tools with generic single-letter icon slugs\n`);
    
    let cleaned = 0;
    let failed = 0;
    
    for (const tool of tools) {
      try {
        console.log(`🧹 Clearing "${tool.simpleIconSlug}" slug from ${tool.name} (keeping color: ${tool.simpleIconColor})...`);
        
        const updateResult = await client.request(CLEAR_ICON_SLUG, { id: tool.id });
        
        console.log(`  ✅ Cleared slug for ${tool.name} - color preserved for background use`);
        cleaned++;
        
      } catch (error) {
        console.error(`  ❌ Failed to clear slug for ${tool.name}:`, error);
        failed++;
      }
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`\n🎉 Generic icon slug cleanup completed!`);
    console.log(`📊 Summary:`);
    console.log(`  - Cleaned slugs: ${cleaned} tools`);
    console.log(`  - Failed: ${failed} tools`);
    console.log(`  - Colors preserved: ${cleaned} tools`);
    console.log(`\n💡 Frontend will now display fallback icons with preserved brand colors`);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}