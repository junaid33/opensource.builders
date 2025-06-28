#!/usr/bin/env tsx

import { GraphQLClient } from 'graphql-request';

const KEYSTONE_SESSION = 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    'authorization': `Bearer ${KEYSTONE_SESSION}`,
    'cookie': `keystonejs-session=${KEYSTONE_SESSION}`
  }
});

// Priority 2 Development Features from deepresearch.md
const developmentFeatures = [
  // Development Platform Features
  { name: 'Version Control', featureType: 'Core', description: 'Git-based version control system for code management' },
  { name: 'Issue Tracking', featureType: 'Core', description: 'Track bugs, features, and project issues' },
  { name: 'CI/CD Integration', featureType: 'Integration', description: 'Continuous integration and deployment pipelines' },
  { name: 'Code Review', featureType: 'Core', description: 'Collaborative code review and approval process' },
  { name: 'Project Management', featureType: 'Core', description: 'Project planning, milestones, and progress tracking' },
  { name: 'Team Collaboration', featureType: 'Core', description: 'Team communication and collaboration features' },

  // API Testing Features
  { name: 'Request Builder', featureType: 'Core', description: 'Build and configure HTTP requests with various methods' },
  { name: 'Environment Management', featureType: 'Core', description: 'Manage different environments and variables' },
  { name: 'Test Automation', featureType: 'Advanced', description: 'Automated testing scripts and test suites' },
  { name: 'Mock Servers', featureType: 'Advanced', description: 'Create mock API servers for testing' },
  { name: 'API Documentation', featureType: 'Core', description: 'Generate and maintain API documentation' },

  // Monitoring Features
  { name: 'Real-time Monitoring', featureType: 'Core', description: 'Live monitoring of system metrics and performance' },
  { name: 'Custom Dashboards', featureType: 'Core', description: 'Create customizable monitoring dashboards' },
  { name: 'Alerting System', featureType: 'Core', description: 'Configure alerts and notifications for issues' },
  { name: 'Data Visualization', featureType: 'Core', description: 'Charts, graphs, and visual data representation' },
  { name: 'Log Analysis', featureType: 'Advanced', description: 'Analyze and search through system logs' },
  { name: 'Performance Metrics', featureType: 'Analytics', description: 'Collect and analyze performance metrics' },
];

// Priority 2 Development Tools from deepresearch.md
const developmentTools = [
  // Development Platforms
  { slug: 'github', category: 'Development Platforms' },
  { slug: 'flutter', category: 'Development Platforms' },
  { slug: 'capacitor', category: 'Development Platforms' },

  // API Testing
  { slug: 'postman', category: 'API Testing' },
  { slug: 'hoppscotch', category: 'API Testing' },

  // Monitoring
  { slug: 'grafana', category: 'Monitoring' },
  { slug: 'prometheus', category: 'Monitoring' },
  { slug: 'datadog', category: 'Monitoring' },
];

// Feature mapping for each tool category
const featureMappings = {
  'Development Platforms': [
    'Version Control',
    'Issue Tracking',
    'CI/CD Integration',
    'Code Review',
    'Project Management',
    'Team Collaboration'
  ],
  'API Testing': [
    'Request Builder',
    'Environment Management',
    'Test Automation',
    'Mock Servers',
    'API Documentation',
    'Team Collaboration'
  ],
  'Monitoring': [
    'Real-time Monitoring',
    'Custom Dashboards',
    'Alerting System',
    'Data Visualization',
    'Log Analysis',
    'Performance Metrics'
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

async function addPriority2DevelopmentFeatures() {
  console.log('🛠️ Adding Priority 2 Development Features...\n');

  let featuresCreated = 0;
  let relationshipsCreated = 0;
  let toolsNotFound = 0;

  // Step 1: Create all features
  console.log('📝 Creating features...');
  const createdFeatures = new Map();
  
  for (const feature of developmentFeatures) {
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
  
  for (const tool of developmentTools) {
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

  console.log('\n🎉 Priority 2 Development Features completed!');
  console.log(`✅ Features created: ${featuresCreated}`);
  console.log(`✅ Tool-feature relationships: ${relationshipsCreated}`);
  console.log(`❌ Tools not found: ${toolsNotFound}`);
}

async function main() {
  await addPriority2DevelopmentFeatures();
}

main().catch(console.error);