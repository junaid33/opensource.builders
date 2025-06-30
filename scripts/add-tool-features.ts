#!/usr/bin/env npx tsx

/**
 * Adds features to tools that are missing feature relationships
 */

const API_URL = 'http://localhost:3000/api/graphql';
const COOKIE = 'keystonejs-session=Fe26.2**8a2fcd4c2d9bc939b3cc28542a639b12c3eed0dec1b526e75b32e45de1ba2d8b*X3g_cQT7ez1wbclLVAB39g*gaS3FK0DuGfWV42jt1Pa8ujisYL9EritA00LfPcDTECHbR5JxxO26FmZZoL7MOfEZeIn5AkZx4W7rwS56cTZ_g*1782354848471*ae958af088017c959dac0dfe5bdf20cce674a03e769439915752092*TYzuBn3xln_F7Sk4YAtb_2Qi5yakckgcb5AalHb8Ho0';

interface ToolFeatureMapping {
  toolSlug: string;
  features: {
    name: string;
    qualityScore: string;
    implementationNotes: string;
  }[];
}

// Tools and their features to add
const TOOL_FEATURE_MAPPINGS: ToolFeatureMapping[] = [
  {
    toolSlug: 'cursor',
    features: [
      { name: 'AI Code Completion', qualityScore: '0.95', implementationNotes: 'Advanced AI-powered code suggestions and completions' },
      { name: 'Code Editing', qualityScore: '0.90', implementationNotes: 'VS Code-based editor with enhanced AI capabilities' },
      { name: 'Git Integration', qualityScore: '0.85', implementationNotes: 'Built-in version control with AI-assisted commit messages' },
      { name: 'Multi-language Support', qualityScore: '0.90', implementationNotes: 'Support for dozens of programming languages' }
    ]
  },
  {
    toolSlug: 'datadog',
    features: [
      { name: 'Application Monitoring', qualityScore: '0.95', implementationNotes: 'Comprehensive application performance monitoring and alerting' },
      { name: 'Log Management', qualityScore: '0.90', implementationNotes: 'Centralized logging with advanced search and analysis' },
      { name: 'Infrastructure Monitoring', qualityScore: '0.90', implementationNotes: 'Server, container, and cloud infrastructure monitoring' },
      { name: 'Alerting', qualityScore: '0.85', implementationNotes: 'Intelligent alerting with customizable thresholds and notifications' }
    ]
  },
  {
    toolSlug: 'firebase',
    features: [
      { name: 'Real-time Database', qualityScore: '0.90', implementationNotes: 'NoSQL cloud database with real-time synchronization' },
      { name: 'Authentication', qualityScore: '0.85', implementationNotes: 'User authentication with multiple providers (Google, Facebook, etc.)' },
      { name: 'Cloud Storage', qualityScore: '0.85', implementationNotes: 'File storage and serving with Google Cloud integration' },
      { name: 'Analytics', qualityScore: '0.80', implementationNotes: 'App usage analytics and user behavior tracking' }
    ]
  },
  {
    toolSlug: 'github',
    features: [
      { name: 'Version Control', qualityScore: '0.95', implementationNotes: 'Git-based version control with web interface' },
      { name: 'Code Review', qualityScore: '0.90', implementationNotes: 'Pull request system with collaborative code review' },
      { name: 'Issue Tracking', qualityScore: '0.85', implementationNotes: 'Bug tracking and project management with GitHub Issues' },
      { name: 'CI/CD Pipeline', qualityScore: '0.80', implementationNotes: 'GitHub Actions for automated workflows and deployment' }
    ]
  },
  {
    toolSlug: 'github-actions',
    features: [
      { name: 'CI/CD Pipeline', qualityScore: '0.90', implementationNotes: 'Automated build, test, and deployment workflows' },
      { name: 'Workflow Automation', qualityScore: '0.85', implementationNotes: 'Event-driven automation for repository activities' },
      { name: 'Matrix Builds', qualityScore: '0.80', implementationNotes: 'Test across multiple OS and runtime versions' }
    ]
  },
  {
    toolSlug: 'google-analytics',
    features: [
      { name: 'Web Analytics', qualityScore: '0.90', implementationNotes: 'Comprehensive website traffic and user behavior analysis' },
      { name: 'Real-time Reporting', qualityScore: '0.85', implementationNotes: 'Live visitor tracking and activity monitoring' },
      { name: 'Conversion Tracking', qualityScore: '0.80', implementationNotes: 'Goal tracking and e-commerce conversion analytics' },
      { name: 'Custom Reports', qualityScore: '0.75', implementationNotes: 'Customizable dashboards and reporting tools' }
    ]
  },
  {
    toolSlug: 'google-docs',
    features: [
      { name: 'Real-time Collaboration', qualityScore: '0.95', implementationNotes: 'Simultaneous multi-user document editing with live cursors' },
      { name: 'Document Editing', qualityScore: '0.90', implementationNotes: 'Rich text editing with formatting, images, and tables' },
      { name: 'Version History', qualityScore: '0.85', implementationNotes: 'Automatic version tracking with restore capabilities' },
      { name: 'Commenting System', qualityScore: '0.80', implementationNotes: 'In-document comments and suggestions for collaboration' }
    ]
  },
  {
    toolSlug: 'hootsuite',
    features: [
      { name: 'Social Media Management', qualityScore: '0.90', implementationNotes: 'Multi-platform social media posting and scheduling' },
      { name: 'Content Scheduling', qualityScore: '0.85', implementationNotes: 'Bulk scheduling and automated posting across platforms' },
      { name: 'Analytics Dashboard', qualityScore: '0.80', implementationNotes: 'Social media performance analytics and reporting' },
      { name: 'Team Collaboration', qualityScore: '0.75', implementationNotes: 'Multi-user account management with role-based permissions' }
    ]
  },
  {
    toolSlug: 'adobe-photoshop',
    features: [
      { name: 'Image Editing', qualityScore: '0.95', implementationNotes: 'Professional raster graphics editing with advanced tools' },
      { name: 'Layer Management', qualityScore: '0.90', implementationNotes: 'Non-destructive editing with layer-based workflow' },
      { name: 'AI-powered Tools', qualityScore: '0.85', implementationNotes: 'Content-aware fill, sky replacement, and neural filters' },
      { name: 'Brush System', qualityScore: '0.90', implementationNotes: 'Extensive brush library with pressure sensitivity support' }
    ]
  },
  {
    toolSlug: 'amazon-s3',
    features: [
      { name: 'Cloud Storage', qualityScore: '0.95', implementationNotes: 'Scalable object storage with 99.999999999% durability' },
      { name: 'Access Control', qualityScore: '0.90', implementationNotes: 'Fine-grained IAM policies and bucket-level permissions' },
      { name: 'Data Encryption', qualityScore: '0.85', implementationNotes: 'Server-side and client-side encryption options' },
      { name: 'CDN Integration', qualityScore: '0.80', implementationNotes: 'CloudFront integration for global content delivery' }
    ]
  }
];

async function makeGraphQLRequest(query: string, variables?: any) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': COOKIE,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.log('HTTP Error Response:', text);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    console.log('GraphQL Errors:', JSON.stringify(data.errors, null, 2));
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

async function findTool(slug: string) {
  const data = await makeGraphQLRequest(`
    query FindTool($slug: String!) {
      tools(where: { slug: { equals: $slug } }) {
        id
        name
        slug
      }
    }
  `, { slug });

  return data.tools[0] || null;
}

async function findOrCreateFeature(featureName: string) {
  // First try to find existing feature
  const existingFeature = await makeGraphQLRequest(`
    query FindFeature($name: String!) {
      features(where: { name: { equals: $name } }) {
        id
        name
      }
    }
  `, { name: featureName });

  if (existingFeature.features.length > 0) {
    return existingFeature.features[0];
  }

  // Create new feature if it doesn't exist
  const newFeature = await makeGraphQLRequest(`
    mutation CreateFeature($data: FeatureCreateInput!) {
      createFeature(data: $data) {
        id
        name
      }
    }
  `, {
    data: {
      name: featureName,
      description: `${featureName} capability`
    }
  });

  return newFeature.createFeature;
}

async function createToolFeature(toolId: string, featureId: string, qualityScore: string, implementationNotes: string) {
  const mutation = `
    mutation CreateToolFeature($data: ToolFeatureCreateInput!) {
      createToolFeature(data: $data) {
        id
        tool { name }
        feature { name }
        qualityScore
        implementationNotes
      }
    }
  `;

  const variables = {
    data: {
      tool: { connect: { id: toolId } },
      feature: { connect: { id: featureId } },
      qualityScore,
      implementationNotes
    }
  };

  return await makeGraphQLRequest(mutation, variables);
}

async function checkExistingToolFeature(toolId: string, featureId: string) {
  const data = await makeGraphQLRequest(`
    query CheckToolFeature($toolId: ID!, $featureId: ID!) {
      toolFeatures(where: {
        AND: [
          { tool: { id: { equals: $toolId } } }
          { feature: { id: { equals: $featureId } } }
        ]
      }) {
        id
      }
    }
  `, { toolId, featureId });

  return data.toolFeatures.length > 0;
}

async function addToolFeatures() {
  console.log('🔧 Adding features to tools...\n');

  let createdFeatures = 0;
  let createdToolFeatures = 0;

  for (const mapping of TOOL_FEATURE_MAPPINGS) {
    try {
      console.log(`\n📋 Processing features for ${mapping.toolSlug}...`);

      // Find the tool
      const tool = await findTool(mapping.toolSlug);
      if (!tool) {
        console.log(`❌ Tool "${mapping.toolSlug}" not found`);
        continue;
      }

      console.log(`✅ Found tool: ${tool.name}`);

      // Process each feature
      for (const featureData of mapping.features) {
        try {
          // Find or create the feature
          let feature = await findOrCreateFeature(featureData.name);
          if (!feature.id) {
            console.log(`  ➕ Created new feature: ${featureData.name}`);
            createdFeatures++;
          } else {
            console.log(`  ✅ Found existing feature: ${feature.name}`);
          }

          // Check if tool-feature relationship already exists
          const exists = await checkExistingToolFeature(tool.id, feature.id);
          
          if (!exists) {
            console.log(`  🔗 Connecting ${tool.name} to ${feature.name}...`);
            const result = await createToolFeature(
              tool.id,
              feature.id,
              featureData.qualityScore,
              featureData.implementationNotes
            );
            console.log(`  ✅ Connected with quality score: ${result.createToolFeature.qualityScore}`);
            createdToolFeatures++;
          } else {
            console.log(`  ✅ Tool-feature relationship already exists`);
          }

          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
          console.log(`  ❌ Failed to process feature ${featureData.name}:`, error);
        }
      }

    } catch (error) {
      console.log(`❌ Failed to process ${mapping.toolSlug}:`, error);
    }
  }

  console.log(`\n🎉 Summary:`);
  console.log(`   Created ${createdFeatures} new features`);
  console.log(`   Created ${createdToolFeatures} new tool-feature relationships`);
}

// Run the script
addToolFeatures();