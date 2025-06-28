#!/usr/bin/env npx tsx

/**
 * Script to analyze tools without alternative relationships
 * Usage: npx tsx scripts/analyze-unconnected-tools.ts
 */

import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION || 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'}`
  }
});

const GET_ALL_TOOLS_QUERY = `
  query {
    tools {
      id
      name
      slug
      isOpenSource
      description
      websiteUrl
      repositoryUrl
      category {
        id
        name
      }
      proprietaryAlternatives {
        id
      }
      openSourceAlternatives {
        id
      }
    }
  }
`;

const GET_ALL_ALTERNATIVES_QUERY = `
  query {
    alternatives {
      id
      proprietaryTool {
        id
        name
        slug
      }
      openSourceTool {
        id
        name
        slug
      }
    }
  }
`;

async function main() {
  try {
    console.log('🔍 Analyzing tools without alternative relationships...\n');

    // Get all tools
    const toolsResult = await client.request(GET_ALL_TOOLS_QUERY);
    const allTools = toolsResult.tools;

    // Get all alternatives to understand relationships
    const alternativesResult = await client.request(GET_ALL_ALTERNATIVES_QUERY);
    const allAlternatives = alternativesResult.alternatives;

    console.log(`📊 Database Overview:`);
    console.log(`   Total tools: ${allTools.length}`);
    console.log(`   Total alternatives: ${allAlternatives.length}`);
    console.log(`   Proprietary tools: ${allTools.filter(t => !t.isOpenSource).length}`);
    console.log(`   Open source tools: ${allTools.filter(t => t.isOpenSource).length}\n`);

    // Analyze which tools have no alternative relationships
    const toolsWithoutAlternatives = [];
    const proprietaryToolsWithoutAlternatives = [];
    const openSourceToolsWithoutAlternatives = [];

    for (const tool of allTools) {
      const hasProprietaryAlternatives = tool.proprietaryAlternatives && tool.proprietaryAlternatives.length > 0;
      const hasOpenSourceAlternatives = tool.openSourceAlternatives && tool.openSourceAlternatives.length > 0;

      if (!hasProprietaryAlternatives && !hasOpenSourceAlternatives) {
        toolsWithoutAlternatives.push(tool);
        
        if (tool.isOpenSource) {
          openSourceToolsWithoutAlternatives.push(tool);
        } else {
          proprietaryToolsWithoutAlternatives.push(tool);
        }
      }
    }

    console.log('🔗 Alternative Relationships Analysis:\n');
    
    console.log(`❌ Tools without ANY alternatives: ${toolsWithoutAlternatives.length}`);
    console.log(`   - Proprietary tools without alternatives: ${proprietaryToolsWithoutAlternatives.length}`);
    console.log(`   - Open source tools without alternatives: ${openSourceToolsWithoutAlternatives.length}\n`);

    // Group by category for better analysis
    const toolsByCategory = {};
    for (const tool of toolsWithoutAlternatives) {
      const categoryName = tool.category?.name || 'Uncategorized';
      if (!toolsByCategory[categoryName]) {
        toolsByCategory[categoryName] = [];
      }
      toolsByCategory[categoryName].push(tool);
    }

    console.log('📋 PROPRIETARY TOOLS WITHOUT ALTERNATIVES:\n');
    if (proprietaryToolsWithoutAlternatives.length === 0) {
      console.log('   ✅ All proprietary tools have alternatives!\n');
    } else {
      for (const tool of proprietaryToolsWithoutAlternatives) {
        console.log(`   🏢 ${tool.name} (${tool.slug})`);
        console.log(`      Category: ${tool.category?.name || 'Uncategorized'}`);
        console.log(`      Description: ${tool.description || 'No description'}`);
        console.log(`      Website: ${tool.websiteUrl || 'Not specified'}\n`);
      }
    }

    console.log('📋 OPEN SOURCE TOOLS WITHOUT ALTERNATIVES:\n');
    if (openSourceToolsWithoutAlternatives.length === 0) {
      console.log('   ✅ All open source tools are connected!\n');
    } else {
      for (const tool of openSourceToolsWithoutAlternatives) {
        console.log(`   🔓 ${tool.name} (${tool.slug})`);
        console.log(`      Category: ${tool.category?.name || 'Uncategorized'}`);
        console.log(`      Description: ${tool.description || 'No description'}`);
        console.log(`      Repository: ${tool.repositoryUrl || 'Not specified'}\n`);
      }
    }

    console.log('📊 BREAKDOWN BY CATEGORY:\n');
    for (const [category, tools] of Object.entries(toolsByCategory)) {
      console.log(`   📁 ${category}: ${tools.length} tools without alternatives`);
      for (const tool of tools) {
        const type = tool.isOpenSource ? '🔓' : '🏢';
        console.log(`      ${type} ${tool.name} (${tool.slug})`);
      }
      console.log('');
    }

    // Identify potential candidates for alternatives
    console.log('🎯 PRIORITY RECOMMENDATIONS:\n');
    
    const highPriorityCategories = ['Development Tools', 'Analytics', 'Communication APIs', 'UI Components'];
    const priorityTools = proprietaryToolsWithoutAlternatives.filter(tool => 
      highPriorityCategories.includes(tool.category?.name)
    );

    if (priorityTools.length > 0) {
      console.log('   🔥 High Priority - Popular proprietary tools that need alternatives:');
      for (const tool of priorityTools) {
        console.log(`      • ${tool.name} (${tool.category?.name})`);
      }
      console.log('');
    }

    // Summary statistics
    console.log('📈 COVERAGE STATISTICS:\n');
    const proprietaryToolsCount = allTools.filter(t => !t.isOpenSource).length;
    const proprietaryWithAlternatives = proprietaryToolsCount - proprietaryToolsWithoutAlternatives.length;
    const coveragePercentage = proprietaryToolsCount > 0 ? 
      Math.round((proprietaryWithAlternatives / proprietaryToolsCount) * 100) : 0;

    console.log(`   Alternative Coverage: ${coveragePercentage}% (${proprietaryWithAlternatives}/${proprietaryToolsCount} proprietary tools have alternatives)`);
    console.log(`   Tools needing attention: ${toolsWithoutAlternatives.length}`);
    console.log(`   Categories represented: ${Object.keys(toolsByCategory).length}`);

  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}