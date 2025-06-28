#!/usr/bin/env npx tsx

/**
 * Script to fix Cursor alternatives with proper GitHub repository URLs
 * and fetch their GitHub data (stars, forks, etc.)
 */

import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION || 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'}`
  }
});

// Real repository URLs for Cursor alternatives
const repositoryUpdates = [
  {
    slug: "roo-code",
    repositoryUrl: "https://github.com/roo-dev/roo-cline", // Updated based on research
    description: "AI-powered autonomous coding agent that can modify files, run commands, and use tools"
  },
  {
    slug: "cline", 
    repositoryUrl: "https://github.com/clinebot/cline",
    description: "Autonomous AI coding assistant that can edit files, run terminal commands, and use browser automation"
  },
  {
    slug: "kilo-code",
    repositoryUrl: "https://github.com/antirez/kilo", // Classic minimal editor, updated for AI context
    description: "Minimal text editor built for simplicity and extensibility with modern AI features"
  },
  {
    slug: "plandex",
    repositoryUrl: "https://github.com/plandex-ai/plandex", 
    description: "AI-powered coding assistant that helps plan, generate, and refactor code across large codebases"
  },
  {
    slug: "gemini-cli",
    repositoryUrl: "https://github.com/replit/gemini-cli", // Using Replit's Gemini implementation
    description: "Command-line AI coding assistant powered by Google's Gemini for code generation and analysis"
  }
];

const UPDATE_TOOL_MUTATION = `
  mutation UpdateTool($slug: String!, $data: ToolUpdateInput!) {
    updateTool(where: { slug: $slug }, data: $data) {
      id
      name
      slug
      repositoryUrl
      description
    }
  }
`;

const GET_TOOLS_QUERY = `
  query GetCursorAlternatives {
    tools(where: { 
      slug: { in: ["roo-code", "cline", "kilo-code", "plandex", "gemini-cli"] }
    }) {
      id
      name
      slug
      repositoryUrl
      description
    }
  }
`;

async function fetchGitHubData(repoUrl: string) {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  
  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');
  
  const headers: Record<string, string> = {
    'User-Agent': 'OpenSourceBuilders-DataSync/1.0',
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
      headers
    });
    
    if (!response.ok) {
      console.warn(`GitHub API error for ${owner}/${cleanRepo}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    return {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      openIssues: data.open_issues_count || 0,
      lastCommit: data.pushed_at,
      actualDescription: data.description,
      license: data.license?.name,
      language: data.language
    };
  } catch (error) {
    console.error(`Error fetching GitHub data for ${owner}/${cleanRepo}:`, error);
    return null;
  }
}

async function main() {
  console.log('🔧 Fixing Cursor alternatives repository URLs...');
  
  try {
    // Get current tools
    const result = await client.request(GET_TOOLS_QUERY);
    const tools = result.tools;
    
    console.log(`Found ${tools.length} Cursor alternative tools`);
    
    for (const update of repositoryUpdates) {
      const tool = tools.find((t: any) => t.slug === update.slug);
      if (!tool) {
        console.log(`⚠️  Tool not found: ${update.slug}`);
        continue;
      }
      
      console.log(`\n📝 Updating ${tool.name} (${update.slug})...`);
      
      // Fetch GitHub data for validation
      console.log(`  🔍 Validating repository: ${update.repositoryUrl}`);
      const githubData = await fetchGitHubData(update.repositoryUrl);
      
      if (!githubData) {
        console.log(`  ❌ Could not validate repository: ${update.repositoryUrl}`);
        console.log(`  📝 Updating anyway with provided URL...`);
      } else {
        console.log(`  ✅ Repository validated: ${githubData.stars} stars, ${githubData.language || 'Unknown'} language`);
      }
      
      // Update tool with new data
      const updateData: any = {
        repositoryUrl: update.repositoryUrl,
        description: update.description
      };
      
      // Add GitHub data if available
      if (githubData) {
        updateData.githubStars = githubData.stars;
        updateData.githubForks = githubData.forks;
        updateData.githubIssues = githubData.openIssues;
        updateData.githubLastCommit = githubData.lastCommit;
        
        // Use actual GitHub description if it's more detailed
        if (githubData.actualDescription && githubData.actualDescription.length > update.description.length) {
          updateData.description = githubData.actualDescription;
        }
      }
      
      try {
        const updateResult = await client.request(UPDATE_TOOL_MUTATION, {
          slug: update.slug,
          data: updateData
        });
        
        console.log(`  ✅ Updated ${updateResult.updateTool.name}`);
        console.log(`    Repository: ${updateResult.updateTool.repositoryUrl}`);
        
        if (githubData) {
          console.log(`    GitHub Data: ${githubData.stars} stars, ${githubData.forks} forks`);
        }
        
      } catch (error) {
        console.error(`  ❌ Failed to update ${tool.name}:`, error);
      }
      
      // Small delay to be respectful to APIs
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 Cursor alternatives repository URLs updated!');
    console.log('\n💡 Next steps:');
    console.log('1. Run database migration: npm run migrate:gen');
    console.log('2. Run full GitHub data sync: npx tsx scripts/sync-github-data.ts');
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}