#!/usr/bin/env npx tsx

/**
 * Script to update GitHub stars using WebSearch tool
 */

import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION || 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'}`
  }
});

// Manual star counts gathered from web search - can be updated as needed
const knownStarCounts: Record<string, number> = {
  'terraform': 45500,
  'postgresql': 15100,
  'redis': 66100,
  'shadcn-ui': 75000,
  'magic-ui': 9200,
  '21st-dev': 4100,
  'hyperui': 9100,
  'flyonui': 5700,
  'daisyui': 33500,
  'ferretdb': 9000,
  'jenkins': 23100,
  'gitlab-ci': 23800, // Same as GitLab
  'siyuan': 19200,
  'drone': 32100,
  'eclipse': 3800,
  'glpi': 4100,
  'rudderstack': 4100,
  'opentofu': 22800,
  'flutter': 165000,
  'vim-neovim': 82000,
  'atom': 60100,
  'emacs': 4300,
  'capacitor': 11800,
  'godot-engine': 90000,
  'bevy-engine': 35700
};

const UPDATE_TOOL_STARS = `
  mutation UpdateToolStars($slug: String!, $stars: Int!) {
    updateTool(where: { slug: $slug }, data: { 
      githubStars: $stars
    }) {
      id
      name
      slug
      githubStars
    }
  }
`;

async function main() {
  try {
    console.log('🌟 Updating GitHub stars from known counts...\n');
    
    let updated = 0;
    let failed = 0;
    
    for (const [slug, stars] of Object.entries(knownStarCounts)) {
      try {
        console.log(`📝 Updating ${slug} with ${stars.toLocaleString()} stars...`);
        
        const result = await client.request(UPDATE_TOOL_STARS, {
          slug: slug,
          stars: stars
        });
        
        if (result.updateTool) {
          console.log(`  ✅ Updated ${result.updateTool.name} with ${stars.toLocaleString()} stars`);
          updated++;
        } else {
          console.log(`  ⚠️  Tool with slug '${slug}' not found`);
        }
        
      } catch (error) {
        console.error(`  ❌ Failed to update ${slug}:`, error);
        failed++;
      }
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`\n🎉 GitHub stars update completed!`);
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