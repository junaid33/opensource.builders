#!/usr/bin/env npx tsx

/**
 * Script to clean up generic single-letter Simple Icons and replace with null
 * so the frontend can handle them appropriately
 */

import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION || 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'}`
  }
});

// Keep these tools with their letter icons as they are appropriate
const keepLetterIcons = new Set([
  'r', // If it's actually for R programming language, etc.
  'c', // If it's actually for C programming language, etc.
  'x', // If it's actually for X/Twitter, etc.
  'k', // If it's actually for Kubernetes, etc.
  'd', // If it's actually for D language, etc.
  'f', // If it's actually for F#, etc.
  'v' // If it's actually for V language, etc.
]);

// However, let's be more specific and only keep ones that make sense
const toolsToKeepLetterIcon = new Set([
  // None of these tools should actually have single letter icons
  // Most single letters in Simple Icons are for programming languages
]);

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

const CLEAR_ICON = `
  mutation ClearIcon($id: ID!) {
    updateTool(where: { id: $id }, data: { 
      simpleIconSlug: ""
      simpleIconColor: ""
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
    console.log('🧹 Cleaning up generic single-letter icons...\n');
    
    const result = await client.request(GET_GENERIC_ICONS);
    const tools = result.tools;
    
    console.log(`Found ${tools.length} tools with generic single-letter icons\n`);
    
    let cleaned = 0;
    let kept = 0;
    
    for (const tool of tools) {
      // Check if this tool should keep its letter icon
      if (toolsToKeepLetterIcon.has(tool.slug)) {
        console.log(`⏭️  Keeping ${tool.name} (${tool.slug}) with "${tool.simpleIconSlug}" icon`);
        kept++;
        continue;
      }
      
      // Clear the generic icon
      try {
        console.log(`🧹 Clearing generic "${tool.simpleIconSlug}" icon from ${tool.name}...`);
        
        await client.request(CLEAR_ICON, { id: tool.id });
        
        console.log(`  ✅ Cleared icon for ${tool.name} - frontend will handle it`);
        cleaned++;
        
      } catch (error) {
        console.error(`  ❌ Failed to clear icon for ${tool.name}:`, error);
      }
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`\n🎉 Generic icon cleanup completed!`);
    console.log(`📊 Summary:`);
    console.log(`  - Cleaned: ${cleaned} tools`);
    console.log(`  - Kept: ${kept} tools`);
    console.log(`  - Total processed: ${tools.length} tools`);
    console.log(`\n💡 Frontend will now display fallback icons for tools without Simple Icons`);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}