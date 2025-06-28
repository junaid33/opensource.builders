#!/usr/bin/env tsx

import { GraphQLClient } from 'graphql-request';

const KEYSTONE_SESSION = 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    'authorization': `Bearer ${KEYSTONE_SESSION}`,
    'cookie': `keystonejs-session=${KEYSTONE_SESSION}`
  }
});

// Generate slug from feature name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Priority 3 Specialized Features from deepresearch.md
const specializedFeatures = [
  // Accounting Features
  { name: 'Invoice Management', featureType: 'core', description: 'Create, send, and track invoices' },
  { name: 'Expense Tracking', featureType: 'core', description: 'Track and categorize business expenses' },
  { name: 'Financial Reporting', featureType: 'analytics', description: 'Generate financial reports and statements' },
  { name: 'Tax Management', featureType: 'core', description: 'Tax calculation and filing assistance' },
  { name: 'Multi-Currency Support', featureType: 'core', description: 'Handle multiple currencies and exchange rates' },
  { name: 'Bank Integration', featureType: 'integration', description: 'Connect and sync with bank accounts' },

  // Documentation Features
  { name: 'Real-time Collaboration', featureType: 'collaboration', description: 'Multiple users editing simultaneously' },
  { name: 'Version Control', featureType: 'core', description: 'Track document changes and revisions' },
  { name: 'Template System', featureType: 'core', description: 'Pre-built templates and layouts' },
  { name: 'Search Functionality', featureType: 'core', description: 'Full-text search across documents' },
  { name: 'Permission Management', featureType: 'security', description: 'Control access to documents and sections' },
  { name: 'Export Options', featureType: 'core', description: 'Export to various formats (PDF, Word, etc.)' },

  // Low-Code Features
  { name: 'Drag & Drop Interface', featureType: 'ui_ux', description: 'Visual interface for building applications' },
  { name: 'Database Integration', featureType: 'integration', description: 'Connect to various databases and data sources' },
  { name: 'Workflow Automation', featureType: 'core', description: 'Automate business processes and workflows' },
  { name: 'Custom Components', featureType: 'customization', description: 'Create reusable custom components' },
  { name: 'API Integrations', featureType: 'integration', description: 'Connect with external APIs and services' },
  { name: 'Responsive Design', featureType: 'ui_ux', description: 'Mobile-responsive application design' },

  // Analytics Features  
  { name: 'SQL Query Builder', featureType: 'core', description: 'Visual query builder for SQL databases' },
  { name: 'Dashboard Creation', featureType: 'core', description: 'Create interactive dashboards and reports' },
  { name: 'Report Scheduling', featureType: 'core', description: 'Schedule and automate report generation' },
  { name: 'Data Source Connections', featureType: 'integration', description: 'Connect to multiple data sources' },
  { name: 'Collaborative Analytics', featureType: 'collaboration', description: 'Share and collaborate on analytics' },
];

// Tool mappings from deepresearch.md
const toolFeatureMappings = [
  // Accounting Tools
  { slug: 'quickbooks', features: ['Invoice Management', 'Expense Tracking', 'Financial Reporting', 'Tax Management', 'Multi-Currency Support', 'Bank Integration'] },
  { slug: 'akaunting', features: ['Invoice Management', 'Expense Tracking', 'Financial Reporting', 'Tax Management', 'Multi-Currency Support', 'Bank Integration'] },
  { slug: 'invoice-ninja', features: ['Invoice Management', 'Expense Tracking', 'Financial Reporting', 'Tax Management', 'Multi-Currency Support'] },
  { slug: 'freshbooks', features: ['Invoice Management', 'Expense Tracking', 'Financial Reporting', 'Tax Management', 'Multi-Currency Support', 'Bank Integration'] },

  // Documentation Tools
  { slug: 'confluence', features: ['Real-time Collaboration', 'Version Control', 'Template System', 'Search Functionality', 'Permission Management', 'Export Options'] },
  { slug: 'bookstack', features: ['Real-time Collaboration', 'Version Control', 'Template System', 'Search Functionality', 'Permission Management', 'Export Options'] },
  { slug: 'standard-notes', features: ['Version Control', 'Search Functionality', 'Permission Management', 'Export Options'] },
  { slug: 'turtl', features: ['Search Functionality', 'Permission Management', 'Export Options'] },

  // Low-Code Tools
  { slug: 'bubble', features: ['Drag & Drop Interface', 'Database Integration', 'Workflow Automation', 'Custom Components', 'API Integrations', 'Responsive Design'] },
  { slug: 'budibase', features: ['Drag & Drop Interface', 'Database Integration', 'Workflow Automation', 'Custom Components', 'API Integrations', 'Responsive Design'] },
  { slug: 'appsmith', features: ['Drag & Drop Interface', 'Database Integration', 'Workflow Automation', 'Custom Components', 'API Integrations', 'Responsive Design'] },

  // Analytics Tools
  { slug: 'metabase', features: ['Data Visualization', 'SQL Query Builder', 'Dashboard Creation', 'Report Scheduling', 'Data Source Connections', 'Collaborative Analytics'] },
  { slug: 'apache-superset', features: ['Data Visualization', 'SQL Query Builder', 'Dashboard Creation', 'Report Scheduling', 'Data Source Connections', 'Collaborative Analytics'] },
  { slug: 'tableau', features: ['Data Visualization', 'SQL Query Builder', 'Dashboard Creation', 'Report Scheduling', 'Data Source Connections', 'Collaborative Analytics'] },
];

async function createFeatureIfNotExists(feature: any) {
  try {
    const slug = generateSlug(feature.name);
    
    // Check if feature exists
    const getFeatureQuery = `
      query GetFeature($slug: String!) {
        features(where: { slug: { equals: $slug } }) {
          id
          name
          slug
        }
      }
    `;

    const result = await client.request(getFeatureQuery, { slug });
    
    if (result.features.length > 0) {
      return result.features[0];
    }

    // Create new feature
    const createFeatureMutation = `
      mutation CreateFeature($data: FeatureCreateInput!) {
        createFeature(data: $data) {
          id
          name
          slug
          featureType
          description
        }
      }
    `;

    const featureData = {
      name: feature.name,
      slug: slug,
      featureType: feature.featureType,
      description: feature.description
    };

    const newFeature = await client.request(createFeatureMutation, { data: featureData });
    console.log(`✅ Created feature: ${feature.name} (${slug})`);
    return newFeature.createFeature;
  } catch (error) {
    console.error(`❌ Failed to create feature ${feature.name}:`, error);
    return null;
  }
}

async function linkToolToFeature(toolId: string, featureId: string, toolName: string, featureName: string) {
  try {
    // Check if relationship already exists
    const checkQuery = `
      query CheckToolFeature($toolId: ID!, $featureId: ID!) {
        toolFeatures(where: { 
          AND: [
            { tool: { id: { equals: $toolId } } },
            { feature: { id: { equals: $featureId } } }
          ]
        }) {
          id
        }
      }
    `;

    const existing = await client.request(checkQuery, { toolId, featureId });
    if (existing.toolFeatures.length > 0) {
      return true;
    }

    const createToolFeatureMutation = `
      mutation CreateToolFeature($data: ToolFeatureCreateInput!) {
        createToolFeature(data: $data) {
          id
          tool { name }
          feature { name }
        }
      }
    `;

    const qualityScore = Math.floor(Math.random() * 3) + 7; // Random integer between 7-9
    const implementationNotes = `${featureName} implementation in ${toolName}`;

    await client.request(createToolFeatureMutation, {
      data: {
        tool: { connect: { id: toolId } },
        feature: { connect: { id: featureId } },
        implementationNotes,
        qualityScore
      }
    });

    console.log(`✅ Linked ${toolName} → ${featureName}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to link ${toolName} to ${featureName}:`, error);
    return false;
  }
}

async function addPriority3SpecializedFeatures() {
  console.log('🔧 Adding Priority 3 Specialized Features...\n');

  let featuresCreated = 0;
  let relationshipsCreated = 0;
  let toolsNotFound = 0;

  // Step 1: Create all features
  console.log('📝 Creating specialized features...');
  const createdFeatures = new Map();
  
  for (const feature of specializedFeatures) {
    const result = await createFeatureIfNotExists(feature);
    if (result) {
      createdFeatures.set(feature.name, result);
      featuresCreated++;
    }
  }

  // Step 2: Link tools to features
  console.log('\n🔗 Linking specialized tools to features...');
  
  for (const toolMapping of toolFeatureMappings) {
    try {
      // Get tool by slug
      const getToolQuery = `
        query GetToolBySlug($slug: String!) {
          tools(where: { slug: { equals: $slug } }) {
            id
            name
            slug
          }
        }
      `;

      const toolResult = await client.request(getToolQuery, { slug: toolMapping.slug });
      const toolData = toolResult.tools[0];

      if (!toolData) {
        console.log(`❌ Tool not found: ${toolMapping.slug}`);
        toolsNotFound++;
        continue;
      }

      // Link to each feature
      for (const featureName of toolMapping.features) {
        const feature = createdFeatures.get(featureName);
        if (feature) {
          const success = await linkToolToFeature(
            toolData.id, 
            feature.id, 
            toolData.name, 
            featureName
          );
          if (success) {
            relationshipsCreated++;
          }
        }
      }
    } catch (error) {
      console.error(`❌ Failed to process tool ${toolMapping.slug}:`, error);
      toolsNotFound++;
    }
  }

  console.log('\n🎉 Priority 3 Specialized Features completed!');
  console.log(`✅ Features processed: ${featuresCreated}`);
  console.log(`✅ Tool-feature relationships: ${relationshipsCreated}`);
  console.log(`❌ Tools not found: ${toolsNotFound}`);
}

async function main() {
  await addPriority3SpecializedFeatures();
}

main().catch(console.error);