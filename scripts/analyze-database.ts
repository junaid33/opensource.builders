#!/usr/bin/env npx tsx

/**
 * Analyzes the current database state to understand what tools, features, and alternatives exist
 */

interface Tool {
  id: string;
  name: string;
  slug: string;
  isOpenSource: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Feature {
  id: string;
  name: string;
}

interface Alternative {
  id: string;
  proprietaryTool: { name: string; slug: string };
  openSourceTool: { name: string; slug: string };
}

const API_URL = 'http://localhost:3000/api/graphql';
const COOKIE = 'keystonejs-session=Fe26.2**8a2fcd4c2d9bc939b3cc28542a639b12c3eed0dec1b526e75b32e45de1ba2d8b*X3g_cQT7ez1wbclLVAB39g*gaS3FK0DuGfWV42jt1Pa8ujisYL9EritA00LfPcDTECHbR5JxxO26FmZZoL7MOfEZeIn5AkZx4W7rwS56cTZ_g*1782354848471*ae958af088017c959dac0dfe5bdf20cce674a03e729e836ce769439915752092*TYzuBn3xln_F7Sk4YAtb_2Qi5yakckgcb5AalHb8Ho0';

async function makeGraphQLRequest(query: string) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': COOKIE,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

async function analyzeDatabase() {
  console.log('🔍 Analyzing current database state...\n');

  try {
    // Get all tools
    const toolsData = await makeGraphQLRequest(`
      query {
        tools {
          id
          name
          slug
          isOpenSource
        }
      }
    `);

    // Get categories
    const categoriesData = await makeGraphQLRequest(`
      query {
        categories {
          id
          name
        }
      }
    `);

    // Get features
    const featuresData = await makeGraphQLRequest(`
      query {
        features {
          id
          name
        }
      }
    `);

    // Get alternatives
    const alternativesData = await makeGraphQLRequest(`
      query {
        alternatives {
          id
          proprietaryTool {
            name
            slug
          }
          openSourceTool {
            name
            slug
          }
        }
      }
    `);

    const tools: Tool[] = toolsData.tools;
    const categories: Category[] = categoriesData.categories;
    const features: Feature[] = featuresData.features;
    const alternatives: Alternative[] = alternativesData.alternatives;

    console.log('📊 DATABASE ANALYSIS RESULTS\n');
    console.log('================================\n');

    // Tool statistics
    const proprietaryTools = tools.filter(t => !t.isOpenSource);
    const openSourceTools = tools.filter(t => t.isOpenSource);
    
    console.log(`📈 TOOL STATISTICS:`);
    console.log(`   Total Tools: ${tools.length}`);
    console.log(`   Proprietary: ${proprietaryTools.length}`);
    console.log(`   Open Source: ${openSourceTools.length}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Features: ${features.length}`);
    console.log(`   Alternatives: ${alternatives.length}\n`);

    // Check what tools we need to add more alternatives for
    const needMoreAlternatives = [
      'chatgpt', 'google-drive', 'freshbooks', 'obsidian', 'postman', 
      'quickbooks', 'teamviewer', 'zoom'
    ];

    console.log('🔍 TOOLS NEEDING MORE ALTERNATIVES:');
    needMoreAlternatives.forEach(slug => {
      const tool = tools.find(t => t.slug === slug);
      if (tool) {
        const existingAlts = alternatives.filter(a => a.proprietaryTool.slug === slug);
        console.log(`   ✅ ${tool.name} (${existingAlts.length} alternatives)`);
      } else {
        console.log(`   ❌ ${slug} - NOT FOUND IN DATABASE`);
      }
    });

    // Check tools that need features added
    const needFeatures = [
      'cursor', 'datadog', 'firebase', 'github', 'github-actions', 'google-analytics',
      'google-docs', 'google-drive', 'hootsuite', 'adobe-photoshop', 'amazon-s3',
      'asana', 'mailchimp', 'tailwind-plus', 'twilio', 'v0', 'wordpress-com'
    ];

    console.log('\n🔧 TOOLS NEEDING FEATURES:');
    needFeatures.forEach(slug => {
      const tool = tools.find(t => t.slug === slug);
      if (tool) {
        console.log(`   ✅ ${tool.name} - EXISTS`);
      } else {
        console.log(`   ❌ ${slug} - NOT FOUND IN DATABASE`);
      }
    });

    // Check tools that need both alternatives and features
    const needBoth = [
      'airtable', 'atom', 'bamboohr', 'carbonite', 'hootsuite', 'hubspot',
      'intellij-idea', 'jenkins', 'jira', 'mongodb-atlas', 'nordvpn',
      'salesforce-sales-cloud', 'sublime-text', 'terraform', 'toggl',
      'typeform', 'zendesk-chat'
    ];

    console.log('\n🔄 TOOLS NEEDING BOTH ALTERNATIVES AND FEATURES:');
    needBoth.forEach(slug => {
      const tool = tools.find(t => t.slug === slug);
      if (tool) {
        const existingAlts = alternatives.filter(a => a.proprietaryTool.slug === slug);
        console.log(`   ✅ ${tool.name} (${existingAlts.length} alternatives)`);
      } else {
        console.log(`   ❌ ${slug} - NOT FOUND IN DATABASE`);
      }
    });

    // Summary of missing tools
    const allNeededSlugs = [...needMoreAlternatives, ...needFeatures, ...needBoth];
    const uniqueNeededSlugs = [...new Set(allNeededSlugs)];
    const missingTools = uniqueNeededSlugs.filter(slug => !tools.find(t => t.slug === slug));

    console.log('\n❌ MISSING TOOLS THAT NEED TO BE CREATED:');
    missingTools.forEach(slug => {
      console.log(`   - ${slug}`);
    });

    console.log('\n✅ EXISTING TOOLS THAT NEED WORK:');
    const existingTools = uniqueNeededSlugs.filter(slug => tools.find(t => t.slug === slug));
    existingTools.forEach(slug => {
      const tool = tools.find(t => t.slug === slug);
      console.log(`   - ${tool?.name} (${slug})`);
    });

    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Create missing proprietary tools');
    console.log('2. Add open source alternatives');
    console.log('3. Connect features to tools');
    console.log('4. Verify all relationships are properly set up');

  } catch (error) {
    console.error('❌ Error analyzing database:', error);
    process.exit(1);
  }
}

// Run the analysis
analyzeDatabase();