#!/usr/bin/env tsx

import { GraphQLClient } from 'graphql-request';

const KEYSTONE_SESSION = 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    'authorization': `Bearer ${KEYSTONE_SESSION}`,
    'cookie': `keystonejs-session=${KEYSTONE_SESSION}`
  }
});

// Simple Icons JSON URL
const SIMPLE_ICONS_URL = 'https://unpkg.com/simple-icons@15.3.0/data/simple-icons.json';

interface SimpleIcon {
  title: string;
  hex: string;
  source?: string;
  aliases?: {
    aka?: string[];
    loc?: { [key: string]: string };
  };
}

interface Tool {
  id: string;
  name: string;
  slug: string;
  simpleIconSlug: string;
  simpleIconColor: string;
}

// Fetch Simple Icons data
async function fetchSimpleIcons(): Promise<SimpleIcon[]> {
  try {
    const response = await fetch(SIMPLE_ICONS_URL);
    const icons: SimpleIcon[] = await response.json();
    console.log(`📥 Fetched ${icons.length} Simple Icons`);
    return icons;
  } catch (error) {
    console.error('❌ Failed to fetch Simple Icons:', error);
    return [];
  }
}

// Create a searchable index of icons
function createIconIndex(icons: SimpleIcon[]): Map<string, SimpleIcon> {
  const index = new Map<string, SimpleIcon>();
  
  for (const icon of icons) {
    // Primary title
    const slug = icon.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    index.set(slug, icon);
    
    // Aliases
    if (icon.aliases?.aka) {
      for (const alias of icon.aliases.aka) {
        const aliasSlug = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
        index.set(aliasSlug, icon);
      }
    }
    
    // Common variations
    const variations = [
      icon.title.toLowerCase().replace(/\s+/g, ''),
      icon.title.toLowerCase().replace(/\s+/g, '-'),
      icon.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      icon.title.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    ];
    
    for (const variation of variations) {
      if (variation && !index.has(variation)) {
        index.set(variation, icon);
      }
    }
  }
  
  return index;
}

// Advanced matching logic
function findBestMatch(toolName: string, toolSlug: string, iconIndex: Map<string, SimpleIcon>): SimpleIcon | null {
  const searchTerms = [
    // Original slug
    toolSlug.toLowerCase(),
    
    // Tool name variations
    toolName.toLowerCase().replace(/[^a-z0-9]/g, ''),
    toolName.toLowerCase().replace(/\s+/g, ''),
    toolName.toLowerCase().replace(/\s+/g, '-'),
    
    // Remove common suffixes
    toolName.replace(/\s+(App|Software|Platform|Tools?|Inc|LLC|Ltd)$/i, '').toLowerCase().replace(/[^a-z0-9]/g, ''),
    
    // Handle common patterns
    toolName.replace(/^Apache\s+/i, '').toLowerCase().replace(/[^a-z0-9]/g, ''),
    toolName.replace(/\s+Chat$/i, '').toLowerCase().replace(/[^a-z0-9]/g, ''),
    toolName.replace(/\s+Meet$/i, '').toLowerCase().replace(/[^a-z0-9]/g, ''),
    
    // Special cases
    toolSlug.replace(/-/g, ''),
    toolSlug.replace(/-/g, '_'),
  ];
  
  // Try exact matches first
  for (const term of searchTerms) {
    if (iconIndex.has(term)) {
      return iconIndex.get(term)!;
    }
  }
  
  // Try partial matches
  for (const term of searchTerms) {
    for (const [key, icon] of iconIndex) {
      if (key.includes(term) || term.includes(key)) {
        return icon;
      }
    }
  }
  
  return null;
}

// Convert Simple Icons title to slug format
function titleToSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Fetch tools missing Simple Icons
async function getToolsMissingIcons(): Promise<Tool[]> {
  const query = `
    query GetToolsMissingIcons {
      tools(where: { simpleIconSlug: { equals: "" } }, take: 100) {
        id
        name
        slug
        simpleIconSlug
        simpleIconColor
      }
    }
  `;
  
  try {
    const result = await client.request(query);
    return result.tools || [];
  } catch (error) {
    console.error('❌ Failed to fetch tools:', error);
    return [];
  }
}

// Update tool with Simple Icon
async function updateToolIcon(toolId: string, iconSlug: string, iconColor: string, toolName: string): Promise<boolean> {
  const mutation = `
    mutation UpdateToolIcon($id: ID!, $data: ToolUpdateInput!) {
      updateTool(where: { id: $id }, data: $data) {
        id
        name
        simpleIconSlug
        simpleIconColor
      }
    }
  `;
  
  try {
    await client.request(mutation, {
      id: toolId,
      data: {
        simpleIconSlug: iconSlug,
        simpleIconColor: `#${iconColor}`
      }
    });
    console.log(`✅ Updated ${toolName}: ${iconSlug} (#${iconColor})`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to update ${toolName}:`, error);
    return false;
  }
}

// Main processing function
async function autoApplySimpleIcons() {
  console.log('🔍 Auto-applying Simple Icons to tools...\n');
  
  // Fetch data
  const [simpleIcons, toolsMissing] = await Promise.all([
    fetchSimpleIcons(),
    getToolsMissingIcons()
  ]);
  
  if (simpleIcons.length === 0 || toolsMissing.length === 0) {
    console.log('❌ No data to process');
    return;
  }
  
  console.log(`📊 Found ${toolsMissing.length} tools missing icons`);
  console.log(`📊 Processing with ${simpleIcons.length} available icons\n`);
  
  // Create searchable index
  const iconIndex = createIconIndex(simpleIcons);
  console.log(`📚 Created searchable index with ${iconIndex.size} entries\n`);
  
  // Process each tool
  let matched = 0;
  let updated = 0;
  
  for (const tool of toolsMissing) {
    const match = findBestMatch(tool.name, tool.slug, iconIndex);
    
    if (match) {
      matched++;
      const iconSlug = titleToSlug(match.title);
      const success = await updateToolIcon(tool.id, iconSlug, match.hex, tool.name);
      if (success) {
        updated++;
      }
    } else {
      console.log(`⚠️  No icon found for: ${tool.name} (${tool.slug})`);
    }
  }
  
  console.log('\n🎉 Auto-apply Simple Icons completed!');
  console.log(`📊 Tools processed: ${toolsMissing.length}`);
  console.log(`🎯 Matches found: ${matched}`);
  console.log(`✅ Successfully updated: ${updated}`);
  console.log(`❌ Failed to update: ${matched - updated}`);
  console.log(`⚠️  No matches: ${toolsMissing.length - matched}`);
}

// Manual icon mapping for difficult cases
const manualMappings: { [slug: string]: { iconSlug: string; iconColor: string } } = {
  // Add specific mappings that automation might miss
  'apache-superset': { iconSlug: 'apachesuperset', iconColor: '20A6C9' },
  'standard-notes': { iconSlug: 'standardnotes', iconColor: '2E2E2E' },
  'rocket-chat': { iconSlug: 'rocketchat', iconColor: 'F5455C' },
  'jitsi-meet': { iconSlug: 'jitsi', iconColor: '1D76BA' },
  'google-analytics': { iconSlug: 'googleanalytics', iconColor: 'E37400' },
  // Add more as needed
};

// Apply manual mappings
async function applyManualMappings() {
  console.log('\n🔧 Applying manual icon mappings...\n');
  
  for (const [toolSlug, iconData] of Object.entries(manualMappings)) {
    try {
      // Get tool by slug
      const getToolQuery = `
        query GetTool($slug: String!) {
          tools(where: { slug: { equals: $slug } }) {
            id
            name
            simpleIconSlug
          }
        }
      `;
      
      const result = await client.request(getToolQuery, { slug: toolSlug });
      const tool = result.tools[0];
      
      if (tool && (!tool.simpleIconSlug || tool.simpleIconSlug === '')) {
        await updateToolIcon(tool.id, iconData.iconSlug, iconData.iconColor, tool.name);
      }
    } catch (error) {
      console.error(`❌ Failed to apply manual mapping for ${toolSlug}:`, error);
    }
  }
}

async function main() {
  await autoApplySimpleIcons();
  await applyManualMappings();
}

main().catch(console.error);