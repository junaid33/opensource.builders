#!/usr/bin/env npx tsx

/**
 * Test script for CONTRIBUTING.md workflow
 * This script tests adding a tool using the contributing format
 */

import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION || 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'}`
  }
});

// Test using CONTRIBUTING.md format:
// Add open source tool: n8n
// - Repository: https://github.com/n8n-io/n8n
// - Description: Free and source-available fair-code licensed workflow automation tool
// - Category: Development Tools
// - Features: Visual workflow editor, 400+ integrations, Self-hostable, REST API

interface GitHubData {
  stars: number;
  description: string;
  license: string;
}

async function fetchGitHubData(repoUrl: string): Promise<GitHubData | null> {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  
  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');
  
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
      headers: {
        'User-Agent': 'OpenSourceBuilders-Test'
      }
    });
    
    if (!response.ok) return null;
    const data = await response.json();
    
    return {
      stars: data.stargazers_count || 0,
      description: data.description || '',
      license: data.license?.name || ''
    };
  } catch (error) {
    console.warn('Failed to fetch GitHub data:', error);
    return null;
  }
}

async function findCategory(categoryName: string) {
  const query = `
    query {
      categories(where: { name: { equals: "${categoryName}" } }) {
        id
        name
      }
    }
  `;
  
  const result = await client.request(query);
  return result.categories[0] || null;
}

async function createTestTool() {
  console.log('🧪 Testing CONTRIBUTING.md workflow...');
  
  const toolData = {
    name: 'n8n',
    slug: 'n8n-test',
    description: 'Free and source-available fair-code licensed workflow automation tool',
    isOpenSource: true,
    repositoryUrl: 'https://github.com/n8n-io/n8n'
  };
  
  // Fetch GitHub data
  console.log('📡 Fetching GitHub data...');
  const githubData = await fetchGitHubData(toolData.repositoryUrl);
  
  if (githubData) {
    console.log(`✅ GitHub data: ${githubData.stars} stars, License: ${githubData.license}`);
  }
  
  // Find category
  console.log('📂 Finding category...');
  const category = await findCategory('Development Tools');
  
  if (!category) {
    console.log('❌ Category not found');
    return false;
  }
  
  console.log(`✅ Found category: ${category.name}`);
  
  // Create tool
  const mutation = `
    mutation CreateTool($data: ToolCreateInput!) {
      createTool(data: $data) {
        id
        name
        slug
        githubStars
      }
    }
  `;
  
  const createData = {
    ...toolData,
    githubStars: githubData?.stars,
    license: githubData?.license,
    category: {
      connect: { id: category.id }
    }
  };
  
  try {
    const result = await client.request(mutation, { data: createData });
    console.log('✅ Tool created successfully:', result.createTool);
    
    // Clean up - delete the test tool
    const deleteMutation = `
      mutation DeleteTool($id: ID!) {
        deleteTool(where: { id: $id }) {
          id
        }
      }
    `;
    
    await client.request(deleteMutation, { id: result.createTool.id });
    console.log('🧹 Test tool cleaned up');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to create tool:', error);
    return false;
  }
}

async function main() {
  const success = await createTestTool();
  
  if (success) {
    console.log('🎉 CONTRIBUTING.md workflow test PASSED!');
    console.log('✅ The workflow is ready for users');
  } else {
    console.log('❌ CONTRIBUTING.md workflow test FAILED');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}