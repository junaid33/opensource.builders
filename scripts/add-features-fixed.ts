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

// Map feature types to correct values
const featureTypeMap: { [key: string]: string } = {
  'Core': 'core',
  'Integration': 'integration',
  'Security': 'security',
  'Analytics': 'analytics',
  'Advanced': 'core', // Map Advanced to core
  'UI/UX': 'ui_ux',
  'API': 'api',
  'Performance': 'performance',
  'Collaboration': 'collaboration',
  'Deployment': 'deployment',
  'Customization': 'customization'
};

// All features from Priority 1 and 2
const allFeatures = [
  // Priority 1 - Password Manager Features
  { name: 'Password Generation', featureType: 'core', description: 'Generate strong, random passwords with customizable criteria' },
  { name: 'Two-Factor Authentication', featureType: 'security', description: 'Support for 2FA/MFA authentication methods' },
  { name: 'Secure Sharing', featureType: 'security', description: 'Securely share passwords and sensitive information with teams' },
  { name: 'Cross-Platform Sync', featureType: 'integration', description: 'Synchronize data across multiple devices and platforms' },
  { name: 'Browser Integration', featureType: 'integration', description: 'Browser extensions for auto-fill and password capture' },
  { name: 'Biometric Authentication', featureType: 'security', description: 'Fingerprint, face recognition, and other biometric login methods' },

  // Priority 1 - CRM Features
  { name: 'Contact Management', featureType: 'core', description: 'Organize and manage customer contact information' },
  { name: 'Lead Tracking', featureType: 'core', description: 'Track and manage sales leads through the pipeline' },
  { name: 'Sales Pipeline', featureType: 'core', description: 'Visual sales pipeline management and deal tracking' },
  { name: 'Email Integration', featureType: 'integration', description: 'Integrate with email systems for communication tracking' },
  { name: 'Reporting & Analytics', featureType: 'analytics', description: 'Generate reports and analyze sales performance' },
  { name: 'Task Management', featureType: 'core', description: 'Create, assign, and track tasks and activities' },

  // Priority 1 - Email Marketing Features
  { name: 'Drag & Drop Editor', featureType: 'ui_ux', description: 'Visual email editor with drag-and-drop interface' },
  { name: 'Automation Workflows', featureType: 'core', description: 'Automated email sequences and triggered campaigns' },
  { name: 'Segmentation', featureType: 'core', description: 'Segment email lists based on various criteria' },
  { name: 'A/B Testing', featureType: 'analytics', description: 'Test different email versions to optimize performance' },
  { name: 'Landing Pages', featureType: 'core', description: 'Create and host landing pages for campaigns' },

  // Priority 2 - Development Platform Features
  { name: 'Version Control', featureType: 'core', description: 'Git-based version control system for code management' },
  { name: 'Issue Tracking', featureType: 'core', description: 'Track bugs, features, and project issues' },
  { name: 'CI/CD Integration', featureType: 'integration', description: 'Continuous integration and deployment pipelines' },
  { name: 'Code Review', featureType: 'collaboration', description: 'Collaborative code review and approval process' },
  { name: 'Project Management', featureType: 'core', description: 'Project planning, milestones, and progress tracking' },
  { name: 'Team Collaboration', featureType: 'collaboration', description: 'Team communication and collaboration features' },

  // Priority 2 - API Testing Features
  { name: 'Request Builder', featureType: 'core', description: 'Build and configure HTTP requests with various methods' },
  { name: 'Environment Management', featureType: 'core', description: 'Manage different environments and variables' },
  { name: 'Test Automation', featureType: 'core', description: 'Automated testing scripts and test suites' },
  { name: 'Mock Servers', featureType: 'core', description: 'Create mock API servers for testing' },
  { name: 'API Documentation', featureType: 'core', description: 'Generate and maintain API documentation' },

  // Priority 2 - Monitoring Features
  { name: 'Real-time Monitoring', featureType: 'core', description: 'Live monitoring of system metrics and performance' },
  { name: 'Custom Dashboards', featureType: 'ui_ux', description: 'Create customizable monitoring dashboards' },
  { name: 'Alerting System', featureType: 'core', description: 'Configure alerts and notifications for issues' },
  { name: 'Data Visualization', featureType: 'ui_ux', description: 'Charts, graphs, and visual data representation' },
  { name: 'Log Analysis', featureType: 'analytics', description: 'Analyze and search through system logs' },
  { name: 'Performance Metrics', featureType: 'analytics', description: 'Collect and analyze performance metrics' },
];

// Tool mappings from deepresearch.md
const toolFeatureMappings = [
  // Password Managers
  { slug: '1password', features: ['Password Generation', 'Two-Factor Authentication', 'Secure Sharing', 'Cross-Platform Sync', 'Browser Integration', 'Biometric Authentication'] },
  { slug: 'bitwarden', features: ['Password Generation', 'Two-Factor Authentication', 'Secure Sharing', 'Cross-Platform Sync', 'Browser Integration', 'Biometric Authentication'] },
  { slug: 'vaultwarden', features: ['Password Generation', 'Two-Factor Authentication', 'Secure Sharing', 'Cross-Platform Sync', 'Browser Integration'] },

  // CRM Tools
  { slug: 'hubspot', features: ['Contact Management', 'Lead Tracking', 'Sales Pipeline', 'Email Integration', 'Reporting & Analytics', 'Task Management'] },
  { slug: 'pipedrive', features: ['Contact Management', 'Lead Tracking', 'Sales Pipeline', 'Email Integration', 'Reporting & Analytics', 'Task Management'] },
  { slug: 'espocrm', features: ['Contact Management', 'Lead Tracking', 'Sales Pipeline', 'Email Integration', 'Reporting & Analytics', 'Task Management'] },
  { slug: 'salesforce', features: ['Contact Management', 'Lead Tracking', 'Sales Pipeline', 'Email Integration', 'Reporting & Analytics', 'Task Management'] },

  // Email Marketing
  { slug: 'mailchimp', features: ['Drag & Drop Editor', 'Automation Workflows', 'Segmentation', 'A/B Testing', 'Reporting & Analytics', 'Landing Pages'] },
  { slug: 'convertkit', features: ['Drag & Drop Editor', 'Automation Workflows', 'Segmentation', 'A/B Testing', 'Reporting & Analytics', 'Landing Pages'] },
  { slug: 'listmonk', features: ['Automation Workflows', 'Segmentation', 'Reporting & Analytics'] },
  { slug: 'mixpost', features: ['Automation Workflows', 'Segmentation', 'Reporting & Analytics'] },

  // Development Platforms
  { slug: 'github', features: ['Version Control', 'Issue Tracking', 'CI/CD Integration', 'Code Review', 'Project Management', 'Team Collaboration'] },
  { slug: 'flutter', features: ['Version Control', 'CI/CD Integration', 'Team Collaboration'] },
  { slug: 'capacitor', features: ['Version Control', 'CI/CD Integration', 'Team Collaboration'] },

  // API Testing
  { slug: 'postman', features: ['Request Builder', 'Environment Management', 'Test Automation', 'Mock Servers', 'API Documentation', 'Team Collaboration'] },
  { slug: 'hoppscotch', features: ['Request Builder', 'Environment Management', 'Test Automation', 'API Documentation', 'Team Collaboration'] },

  // Monitoring
  { slug: 'grafana', features: ['Real-time Monitoring', 'Custom Dashboards', 'Alerting System', 'Data Visualization', 'Performance Metrics'] },
  { slug: 'prometheus', features: ['Real-time Monitoring', 'Alerting System', 'Log Analysis', 'Performance Metrics'] },
  { slug: 'datadog', features: ['Real-time Monitoring', 'Custom Dashboards', 'Alerting System', 'Data Visualization', 'Log Analysis', 'Performance Metrics'] },
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
      // console.log(`⚠️  Relationship already exists: ${toolName} → ${featureName}`);
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

    const qualityScore = Math.floor(Math.random() * 3) + 7; // Random score between 0.7-0.9
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

async function addAllFeatures() {
  console.log('🚀 Adding all Priority 1 & 2 Features with proper schema...\n');

  let featuresCreated = 0;
  let relationshipsCreated = 0;
  let toolsNotFound = 0;

  // Step 1: Create all features
  console.log('📝 Creating features...');
  const createdFeatures = new Map();
  
  for (const feature of allFeatures) {
    const result = await createFeatureIfNotExists(feature);
    if (result) {
      createdFeatures.set(feature.name, result);
      featuresCreated++;
    }
  }

  // Step 2: Link tools to features
  console.log('\n🔗 Linking tools to features...');
  
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

  console.log('\n🎉 Feature addition completed!');
  console.log(`✅ Features processed: ${featuresCreated}`);
  console.log(`✅ Tool-feature relationships: ${relationshipsCreated}`);
  console.log(`❌ Tools not found: ${toolsNotFound}`);
}

async function main() {
  await addAllFeatures();
}

main().catch(console.error);