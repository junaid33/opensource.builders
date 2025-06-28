#!/usr/bin/env npx tsx

/**
 * GitHub Repository Data Sync Script
 * 
 * Fetches and updates GitHub repository data (stars, forks, issues, last commit)
 * for all open source tools in the database.
 * 
 * Usage:
 *   npx tsx scripts/sync-github-data.ts [--dry-run] [--tool-slug=tool-name]
 * 
 * Environment Variables:
 *   GITHUB_TOKEN - GitHub personal access token for API access
 *   KEYSTONE_SESSION - Keystone session cookie for API authentication
 */

import { GraphQLClient } from 'graphql-request';

// Configuration
const GITHUB_API_BASE = 'https://api.github.com';
const DELAY_BETWEEN_REQUESTS = 1000; // 1 second to respect rate limits
const MAX_RETRIES = 3;

// Initialize clients
const keystoneClient = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION || 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'}`
  }
});

// Types
interface GitHubRepoData {
  stars: number;
  forks: number;
  openIssues: number;
  lastCommit: string;
  description?: string;
  license?: string;
  language?: string;
}

interface Tool {
  id: string;
  name: string;
  slug: string;
  repositoryUrl: string | null;
  githubStars: number | null;
  githubForks: number | null;
  githubIssues: number | null;
  githubLastCommit: string | null;
}

// GraphQL Queries
const GET_TOOLS_QUERY = `
  query GetToolsForGitHubSync($toolSlug: String) {
    tools(where: { 
      AND: [
        { isOpenSource: { equals: true } }
        { repositoryUrl: { not: { equals: null } } }
        $toolSlug ? { slug: { equals: $toolSlug } } : {}
      ]
    }) {
      id
      name
      slug
      repositoryUrl
      githubStars
      githubForks
      githubIssues
      githubLastCommit
    }
  }
`;

const UPDATE_TOOL_MUTATION = `
  mutation UpdateToolGitHubData($id: ID!, $data: ToolUpdateInput!) {
    updateTool(where: { id: $id }, data: $data) {
      id
      name
      githubStars
      githubForks
      githubIssues
      githubLastCommit
    }
  }
`;

// GitHub API Functions
async function fetchGitHubData(repoUrl: string): Promise<GitHubRepoData | null> {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    console.warn(`Invalid GitHub URL format: ${repoUrl}`);
    return null;
  }
  
  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '').replace(/\/$/, '');
  
  const headers: Record<string, string> = {
    'User-Agent': 'OpenSourceBuilders-DataSync/1.0',
    'Accept': 'application/vnd.github.v3+json'
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${cleanRepo}`, {
        headers
      });
      
      if (response.status === 404) {
        console.warn(`Repository not found: ${owner}/${cleanRepo}`);
        return null;
      }
      
      if (response.status === 403) {
        const resetTime = response.headers.get('x-ratelimit-reset');
        console.warn(`Rate limit exceeded. Reset time: ${resetTime ? new Date(parseInt(resetTime) * 1000) : 'unknown'}`);
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`GitHub API responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        stars: data.stargazers_count || 0,
        forks: data.forks_count || 0,
        openIssues: data.open_issues_count || 0,
        lastCommit: data.pushed_at || new Date().toISOString(),
        description: data.description,
        license: data.license?.name,
        language: data.language
      };
      
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed for ${owner}/${cleanRepo}: ${error}`);
      
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS * attempt));
      }
    }
  }
  
  console.error(`Failed to fetch data for ${owner}/${cleanRepo} after ${MAX_RETRIES} attempts:`, lastError);
  return null;
}

async function updateToolInDatabase(tool: Tool, githubData: GitHubRepoData, dryRun: boolean): Promise<boolean> {
  const updateData = {
    githubStars: githubData.stars,
    githubForks: githubData.forks,
    githubIssues: githubData.openIssues,
    githubLastCommit: githubData.lastCommit
  };
  
  if (dryRun) {
    console.log(`[DRY RUN] Would update ${tool.name}:`, updateData);
    return true;
  }
  
  try {
    const result = await keystoneClient.request(UPDATE_TOOL_MUTATION, {
      id: tool.id,
      data: updateData
    });
    
    console.log(`✅ Updated ${tool.name}: ${githubData.stars} stars, ${githubData.forks} forks`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to update ${tool.name}:`, error);
    return false;
  }
}

// Main Function
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const toolSlugArg = args.find(arg => arg.startsWith('--tool-slug='));
  const toolSlug = toolSlugArg ? toolSlugArg.split('=')[1] : null;
  
  console.log('🚀 Starting GitHub data sync...');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Scope: ${toolSlug ? `Single tool (${toolSlug})` : 'All open source tools'}`);
  
  if (!process.env.GITHUB_TOKEN) {
    console.warn('⚠️  No GITHUB_TOKEN found. Rate limited to 60 requests/hour.');
  }
  
  try {
    // Fetch tools from database
    console.log('\n📥 Fetching tools from database...');
    const variables = toolSlug ? { toolSlug } : {};
    const result = await keystoneClient.request(GET_TOOLS_QUERY, variables);
    const tools: Tool[] = result.tools;
    
    console.log(`Found ${tools.length} tools with repository URLs`);
    
    if (tools.length === 0) {
      console.log('No tools found to process.');
      return;
    }
    
    // Process each tool
    let processed = 0;
    let updated = 0;
    let errors = 0;
    
    for (const tool of tools) {
      console.log(`\n[${processed + 1}/${tools.length}] Processing ${tool.name}...`);
      
      if (!tool.repositoryUrl) {
        console.log(`  ⏭️  Skipping ${tool.name} - no repository URL`);
        processed++;
        continue;
      }
      
      // Check if we need to update (skip if all data is recent)
      const hasRecentData = tool.githubStars !== null && 
                           tool.githubForks !== null && 
                           tool.githubLastCommit !== null;
      
      if (hasRecentData && !toolSlug) {
        const lastUpdate = new Date(tool.githubLastCommit!);
        const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceUpdate < 7) { // Skip if updated less than a week ago
          console.log(`  ⏭️  Skipping ${tool.name} - recently updated (${Math.round(daysSinceUpdate)} days ago)`);
          processed++;
          continue;
        }
      }
      
      // Fetch GitHub data
      console.log(`  🔍 Fetching GitHub data for: ${tool.repositoryUrl}`);
      const githubData = await fetchGitHubData(tool.repositoryUrl);
      
      if (!githubData) {
        console.log(`  ❌ Could not fetch GitHub data for ${tool.name}`);
        errors++;
      } else {
        // Update database
        const success = await updateToolInDatabase(tool, githubData, dryRun);
        if (success) {
          updated++;
        } else {
          errors++;
        }
      }
      
      processed++;
      
      // Rate limiting delay
      if (processed < tools.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
      }
    }
    
    // Summary
    console.log('\n🎉 GitHub data sync completed!');
    console.log(`📊 Summary:`);
    console.log(`  - Processed: ${processed} tools`);
    console.log(`  - Updated: ${updated} tools`);
    console.log(`  - Errors: ${errors} tools`);
    
    if (dryRun) {
      console.log('\n💡 This was a dry run. Use without --dry-run to apply changes.');
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}