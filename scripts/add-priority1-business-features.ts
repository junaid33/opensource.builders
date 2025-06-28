#!/usr/bin/env tsx

import { GraphQLClient } from 'graphql-request';

const KEYSTONE_SESSION = 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    'authorization': `Bearer ${KEYSTONE_SESSION}`,
    'cookie': `keystonejs-session=${KEYSTONE_SESSION}`
  }
});

// Priority 1 Business Critical Features from deepresearch.md
const businessFeatures = [
  // Password Manager Features
  { name: 'Password Generation', featureType: 'Core', description: 'Generate strong, random passwords with customizable criteria' },
  { name: 'Two-Factor Authentication', featureType: 'Security', description: 'Support for 2FA/MFA authentication methods' },
  { name: 'Secure Sharing', featureType: 'Core', description: 'Securely share passwords and sensitive information with teams' },
  { name: 'Cross-Platform Sync', featureType: 'Integration', description: 'Synchronize data across multiple devices and platforms' },
  { name: 'Browser Integration', featureType: 'Integration', description: 'Browser extensions for auto-fill and password capture' },
  { name: 'Biometric Authentication', featureType: 'Security', description: 'Fingerprint, face recognition, and other biometric login methods' },

  // CRM Features
  { name: 'Contact Management', featureType: 'Core', description: 'Organize and manage customer contact information' },
  { name: 'Lead Tracking', featureType: 'Core', description: 'Track and manage sales leads through the pipeline' },
  { name: 'Sales Pipeline', featureType: 'Core', description: 'Visual sales pipeline management and deal tracking' },
  { name: 'Email Integration', featureType: 'Integration', description: 'Integrate with email systems for communication tracking' },
  { name: 'Reporting & Analytics', featureType: 'Analytics', description: 'Generate reports and analyze sales performance' },
  { name: 'Task Management', featureType: 'Core', description: 'Create, assign, and track tasks and activities' },

  // Email Marketing Features
  { name: 'Drag & Drop Editor', featureType: 'Core', description: 'Visual email editor with drag-and-drop interface' },
  { name: 'Automation Workflows', featureType: 'Advanced', description: 'Automated email sequences and triggered campaigns' },
  { name: 'Segmentation', featureType: 'Core', description: 'Segment email lists based on various criteria' },
  { name: 'A/B Testing', featureType: 'Analytics', description: 'Test different email versions to optimize performance' },
  { name: 'Landing Pages', featureType: 'Core', description: 'Create and host landing pages for campaigns' },
];

// Priority 1 Business Tools from deepresearch.md
const businessTools = [
  // Password Managers
  { slug: '1password', category: 'Password Managers' },
  { slug: 'bitwarden', category: 'Password Managers' },
  { slug: 'vaultwarden', category: 'Password Managers' },

  // CRM Tools
  { slug: 'hubspot', category: 'CRM' },
  { slug: 'pipedrive', category: 'CRM' },
  { slug: 'espocrm', category: 'CRM' },
  { slug: 'salesforce', category: 'CRM' },

  // Email Marketing
  { slug: 'mailchimp', category: 'Email Marketing' },
  { slug: 'convertkit', category: 'Email Marketing' },
  { slug: 'listmonk', category: 'Email Marketing' },
  { slug: 'mixpost', category: 'Email Marketing' },
];

// Feature mapping for each tool category
const featureMappings = {
  'Password Managers': [
    'Password Generation',
    'Two-Factor Authentication', 
    'Secure Sharing',
    'Cross-Platform Sync',
    'Browser Integration',
    'Biometric Authentication'
  ],
  'CRM': [
    'Contact Management',
    'Lead Tracking',
    'Sales Pipeline',
    'Email Integration',
    'Reporting & Analytics',
    'Task Management'
  ],
  'Email Marketing': [
    'Drag & Drop Editor',
    'Automation Workflows',
    'Segmentation',
    'A/B Testing',
    'Reporting & Analytics',
    'Landing Pages'
  ]
};

async function createFeatureIfNotExists(feature: any) {
  try {
    // Check if feature exists
    const getFeatureQuery = `
      query GetFeature($name: String!) {
        features(where: { name: { equals: $name } }) {
          id
          name
        }
      }
    `;

    const result = await client.request(getFeatureQuery, { name: feature.name });
    
    if (result.features.length > 0) {
      return result.features[0];
    }

    // Create new feature
    const createFeatureMutation = `
      mutation CreateFeature($data: FeatureCreateInput!) {
        createFeature(data: $data) {
          id
          name
          featureType
          description
        }
      }
    `;

    const newFeature = await client.request(createFeatureMutation, { data: feature });
    console.log(`✅ Created feature: ${feature.name}`);
    return newFeature.createFeature;
  } catch (error) {
    console.error(`❌ Failed to create feature ${feature.name}:`, error);
    return null;
  }
}

async function linkToolToFeature(toolId: string, featureId: string, toolName: string, featureName: string) {
  try {
    const createToolFeatureMutation = `
      mutation CreateToolFeature($data: ToolFeatureCreateInput!) {
        createToolFeature(data: $data) {
          id
          tool { name }
          feature { name }
        }
      }
    `;

    const qualityScore = Math.random() * 0.2 + 0.7; // Random score between 0.7-0.9
    const implementationNotes = `Implementation of ${featureName} in ${toolName}`;

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

async function addPriority1BusinessFeatures() {
  console.log('🚀 Adding Priority 1 Business Critical Features...\n');

  let featuresCreated = 0;
  let relationshipsCreated = 0;
  let toolsNotFound = 0;

  // Step 1: Create all features
  console.log('📝 Creating features...');
  const createdFeatures = new Map();
  
  for (const feature of businessFeatures) {
    const result = await createFeatureIfNotExists(feature);
    if (result) {
      createdFeatures.set(feature.name, result);
      if (result.name === feature.name && !result.id.includes('existing')) {
        featuresCreated++;
      }
    }
  }

  // Step 2: Link tools to features
  console.log('\n🔗 Linking tools to features...');
  
  for (const tool of businessTools) {
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

      const toolResult = await client.request(getToolQuery, { slug: tool.slug });
      const toolData = toolResult.tools[0];

      if (!toolData) {
        console.log(`❌ Tool not found: ${tool.slug}`);
        toolsNotFound++;
        continue;
      }

      // Get features for this tool category
      const features = featureMappings[tool.category] || [];
      
      for (const featureName of features) {
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
      console.error(`❌ Failed to process tool ${tool.slug}:`, error);
      toolsNotFound++;
    }
  }

  console.log('\n🎉 Priority 1 Business Features completed!');
  console.log(`✅ Features created: ${featuresCreated}`);
  console.log(`✅ Tool-feature relationships: ${relationshipsCreated}`);
  console.log(`❌ Tools not found: ${toolsNotFound}`);
}

async function main() {
  await addPriority1BusinessFeatures();
}

main().catch(console.error);