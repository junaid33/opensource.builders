#!/usr/bin/env npx tsx

/**
 * Script to update GitHub stars by web searching the repository URLs
 */

import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION || 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'}`
  }
});

const GET_TOOLS_MISSING_STARS = `
  query {
    tools(where: { 
      AND: [
        { isOpenSource: { equals: true } }
        { repositoryUrl: { not: { equals: null } } }
        { githubStars: { equals: null } }
      ]
    }) {
      id
      name
      slug
      repositoryUrl
    }
  }
`;

const UPDATE_TOOL_STARS = `
  mutation UpdateToolStars($id: ID!, $stars: Int!) {
    updateTool(where: { id: $id }, data: { 
      githubStars: $stars
    }) {
      id
      name
      githubStars
    }
  }
`;

async function getStarsFromWeb(repoUrl: string, toolName: string): Promise<number | null> {
  try {
    console.log(`  🔍 Web searching: ${repoUrl}`);
    
    // Web search for the repository URL to get stars
    const searchQuery = `${repoUrl} stars site:github.com`;
    const response = await fetch(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const html = await response.text();
    
    // Look for star count patterns in the HTML
    const starPatterns = [
      /(\d+(?:,\d+)*)\s*stars?/i,
      /(\d+(?:,\d+)*)\s*star/i,
      /⭐\s*(\d+(?:,\d+)*)/i,
      /★\s*(\d+(?:,\d+)*)/i
    ];
    
    for (const pattern of starPatterns) {
      const match = html.match(pattern);
      if (match) {
        const starCount = parseInt(match[1].replace(/,/g, ''));
        if (starCount > 0 && starCount < 1000000) { // Reasonable bounds
          console.log(`  ⭐ Found ${starCount} stars`);
          return starCount;
        }
      }
    }
    
    // Fallback: Try to extract from specific GitHub patterns
    const githubPattern = new RegExp(`${repoUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?(\\d+(?:,\\d+)*)\\s*stars?`, 'i');
    const githubMatch = html.match(githubPattern);
    if (githubMatch) {
      const starCount = parseInt(githubMatch[1].replace(/,/g, ''));
      if (starCount > 0) {
        console.log(`  ⭐ Found ${starCount} stars (GitHub pattern)`);
        return starCount;
      }
    }
    
    console.log(`  ❓ Could not extract star count for ${toolName}`);
    return null;
    
  } catch (error) {
    console.error(`  ❌ Web search failed for ${toolName}:`, error);
    return null;
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  
  try {
    console.log('🌟 Updating GitHub stars via web search...\n');
    console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}\n`);
    
    const result = await client.request(GET_TOOLS_MISSING_STARS);
    const tools = result.tools;
    
    console.log(`Found ${tools.length} tools missing GitHub stars\n`);
    
    let updated = 0;
    let failed = 0;
    
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      console.log(`[${i + 1}/${tools.length}] Processing ${tool.name}...`);
      
      const stars = await getStarsFromWeb(tool.repositoryUrl, tool.name);
      
      if (stars !== null) {
        if (dryRun) {
          console.log(`  [DRY RUN] Would update ${tool.name} with ${stars} stars`);
          updated++;
        } else {
          try {
            await client.request(UPDATE_TOOL_STARS, {
              id: tool.id,
              stars: stars
            });
            console.log(`  ✅ Updated ${tool.name} with ${stars} stars`);
            updated++;
          } catch (error) {
            console.error(`  ❌ Failed to update database for ${tool.name}:`, error);
            failed++;
          }
        }
      } else {
        failed++;
      }
      
      console.log('');
      
      // Delay to be respectful to search engines
      if (i < tools.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`🎉 GitHub stars update completed!`);
    console.log(`📊 Summary:`);
    console.log(`  - Updated: ${updated} tools`);
    console.log(`  - Failed: ${failed} tools`);
    
    if (dryRun) {
      console.log('\n💡 This was a dry run. Use without --dry-run to apply changes.');
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}