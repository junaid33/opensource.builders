#!/usr/bin/env npx tsx

/**
 * Script to fix Cursor alternative relationships with correct schema fields
 * Usage: npx tsx scripts/fix-cursor-alternatives.ts
 */

import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION || 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'}`
  }
});

const CREATE_ALTERNATIVE_MUTATION = `
  mutation CreateAlternative($data: AlternativeCreateInput!) {
    createAlternative(data: $data) {
      id
      proprietaryTool { name }
      openSourceTool { name }
    }
  }
`;

const GET_TOOLS_QUERY = `
  query {
    cursor: tools(where: { slug: { equals: "cursor" } }) {
      id name slug
    }
    alternatives: tools(where: { 
      slug: { in: ["roo-code", "cline", "kilo-code", "plandex", "gemini-cli"] }
    }) {
      id name slug
    }
  }
`;

async function main() {
  try {
    console.log('🔗 Creating Cursor alternative relationships...');

    // Get tools
    const result = await client.request(GET_TOOLS_QUERY);
    const cursorTool = result.cursor[0];
    const alternativeTools = result.alternatives;
    
    if (!cursorTool) {
      throw new Error('Cursor tool not found');
    }
    
    console.log(`✅ Found Cursor: ${cursorTool.name}`);
    console.log(`✅ Found ${alternativeTools.length} alternatives`);

    // Create alternative relationships
    for (const tool of alternativeTools) {
      try {
        console.log(`📝 Linking ${tool.name} as alternative to Cursor...`);
        
        const alternativeData = {
          proprietaryTool: { connect: { id: cursorTool.id } },
          openSourceTool: { connect: { id: tool.id } },
          similarityScore: "85.0", // Use string for Decimal type
          matchType: "functionality",
          comparisonNotes: `Open source alternative to Cursor with AI-powered coding features`
        };

        const result = await client.request(CREATE_ALTERNATIVE_MUTATION, { data: alternativeData });
        console.log(`✅ Created: ${result.createAlternative.proprietaryTool.name} ↔ ${result.createAlternative.openSourceTool.name}`);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Failed to create alternative for ${tool.name}:`, error);
      }
    }

    console.log('\n🎉 Alternative relationships created successfully!');

  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}