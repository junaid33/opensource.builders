#!/usr/bin/env npx tsx

/**
 * Script to analyze which open source tools are missing repository URLs
 */

import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION || 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'}`
  }
});

const GET_ALL_OPEN_SOURCE_TOOLS = `
  query {
    tools(where: { isOpenSource: { equals: true } }) {
      id
      name
      slug
      description
      repositoryUrl
      githubStars
    }
  }
`;

async function main() {
  try {
    console.log('📊 Analyzing open source tools repository data...\n');
    
    const result = await client.request(GET_ALL_OPEN_SOURCE_TOOLS);
    const tools = result.tools;
    
    // Categorize tools
    const missingRepoUrl = tools.filter((tool: any) => !tool.repositoryUrl || tool.repositoryUrl.trim() === '');
    const missingStars = tools.filter((tool: any) => tool.repositoryUrl && tool.githubStars === null);
    const hasComplete = tools.filter((tool: any) => tool.repositoryUrl && tool.githubStars !== null);
    
    console.log(`🔍 Total open source tools: ${tools.length}`);
    console.log(`✅ Complete data (repo + stars): ${hasComplete.length}`);
    console.log(`❌ Missing repository URL: ${missingRepoUrl.length}`);
    console.log(`⭐ Missing GitHub stars: ${missingStars.length}\n`);
    
    if (missingRepoUrl.length > 0) {
      console.log('🚨 Tools missing repository URLs:');
      console.log('=====================================');
      missingRepoUrl.forEach((tool: any, index: number) => {
        console.log(`${index + 1}. ${tool.name} (${tool.slug})`);
        console.log(`   Description: ${tool.description || 'No description'}`);
        console.log('');
      });
    }
    
    if (missingStars.length > 0) {
      console.log('⭐ Tools with repos but missing GitHub stars:');
      console.log('============================================');
      missingStars.slice(0, 10).forEach((tool: any, index: number) => {
        console.log(`${index + 1}. ${tool.name} (${tool.slug})`);
        console.log(`   Repository: ${tool.repositoryUrl}`);
        console.log('');
      });
      
      if (missingStars.length > 10) {
        console.log(`... and ${missingStars.length - 10} more tools`);
      }
    }
    
    // Generate report
    console.log('\n📈 Data Completion Report:');
    console.log('==========================');
    console.log(`Repository URL completion: ${((tools.length - missingRepoUrl.length) / tools.length * 100).toFixed(1)}%`);
    console.log(`GitHub stars completion: ${((tools.length - missingStars.length - missingRepoUrl.length) / tools.length * 100).toFixed(1)}%`);
    
    console.log('\n💡 Next Actions:');
    console.log('================');
    if (missingRepoUrl.length > 0) {
      console.log('1. Research and add repository URLs for tools missing them');
    }
    if (missingStars.length > 0) {
      console.log('2. Run GitHub data sync: npx tsx scripts/sync-github-data.ts');
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}