#!/usr/bin/env npx tsx

/**
 * Connects tools to existing features only (no new feature creation)
 */

const API_URL = 'http://localhost:3000/api/graphql';
const COOKIE = 'keystonejs-session=Fe26.2**8a2fcd4c2d9bc939b3cc28542a639b12c3eed0dec1b526e75b32e45de1ba2d8b*X3g_cQT7ez1wbclLVAB39g*gaS3FK0DuGfWV42jt1Pa8ujisYL9EritA00LfPcDTECHbR5JxxO26FmZZoL7MOfEZeIn5AkZx4W7rwS56cTZ_g*1782354848471*ae958af088017c959dac0dfe5bdf20cce674a03e769439915752092*TYzuBn3xln_F7Sk4YAtb_2Qi5yakckgcb5AalHb8Ho0';

interface ToolFeatureMapping {
  toolSlug: string;
  features: {
    name: string;
    qualityScore: number; // Integer 1-10
    implementationNotes: string;
  }[];
}

// Tools and their features to connect (using existing features only)
const TOOL_FEATURE_MAPPINGS: ToolFeatureMapping[] = [
  {
    toolSlug: 'cursor',
    features: [
      { name: 'Code Editing', qualityScore: 9, implementationNotes: 'VS Code-based editor with enhanced AI capabilities' },
      { name: 'Version Control', qualityScore: 8, implementationNotes: 'Built-in Git integration with AI-assisted commit messages' }
    ]
  },
  {
    toolSlug: 'datadog',
    features: [
      { name: 'Application Monitoring', qualityScore: 9, implementationNotes: 'Comprehensive application performance monitoring and alerting' },
      { name: 'Alerting', qualityScore: 8, implementationNotes: 'Intelligent alerting with customizable thresholds and notifications' }
    ]
  },
  {
    toolSlug: 'firebase',
    features: [
      { name: 'Real-time Database', qualityScore: 9, implementationNotes: 'NoSQL cloud database with real-time synchronization' },
      { name: 'Authentication', qualityScore: 8, implementationNotes: 'User authentication with multiple providers (Google, Facebook, etc.)' },
      { name: 'Cloud Storage', qualityScore: 8, implementationNotes: 'File storage and serving with Google Cloud integration' },
      { name: 'Analytics', qualityScore: 7, implementationNotes: 'App usage analytics and user behavior tracking' }
    ]
  },
  {
    toolSlug: 'github-actions',
    features: [
      { name: 'Workflow Automation', qualityScore: 8, implementationNotes: 'Event-driven automation for repository activities' },
      { name: 'Matrix Builds', qualityScore: 7, implementationNotes: 'Test across multiple OS and runtime versions' }
    ]
  },
  {
    toolSlug: 'google-analytics',
    features: [
      { name: 'Analytics', qualityScore: 9, implementationNotes: 'Comprehensive website traffic and user behavior analysis' },
      { name: 'Real-time Reporting', qualityScore: 8, implementationNotes: 'Live visitor tracking and activity monitoring' }
    ]
  },
  {
    toolSlug: 'google-docs',
    features: [
      { name: 'Real-time Collaboration', qualityScore: 9, implementationNotes: 'Simultaneous multi-user document editing with live cursors' },
      { name: 'Version History', qualityScore: 8, implementationNotes: 'Automatic version tracking with restore capabilities' }
    ]
  },
  {
    toolSlug: 'hootsuite',
    features: [
      { name: 'Team Collaboration', qualityScore: 7, implementationNotes: 'Multi-user account management with role-based permissions' }
    ]
  },
  {
    toolSlug: 'adobe-photoshop',
    features: [
      { name: 'Image Editing', qualityScore: 10, implementationNotes: 'Industry-leading raster graphics editing capabilities' }
    ]
  },
  {
    toolSlug: 'amazon-s3',
    features: [
      { name: 'Cloud Storage', qualityScore: 9, implementationNotes: 'Scalable object storage with 99.999999999% durability' },
      { name: 'Data Encryption', qualityScore: 8, implementationNotes: 'Server-side and client-side encryption options' }
    ]
  },
  {
    toolSlug: 'asana',
    features: [
      { name: 'Project Management', qualityScore: 9, implementationNotes: 'Comprehensive project planning and task management' },
      { name: 'Team Collaboration', qualityScore: 8, implementationNotes: 'Real-time team coordination and communication tools' }
    ]
  },
  {
    toolSlug: 'mailchimp',
    features: [
      { name: 'Email Marketing', qualityScore: 9, implementationNotes: 'Advanced email campaign management and automation' },
      { name: 'Analytics', qualityScore: 7, implementationNotes: 'Email performance tracking and audience insights' }
    ]
  },
  {
    toolSlug: 'tailwind-plus',
    features: [
      { name: 'UI Components', qualityScore: 8, implementationNotes: 'Premium Tailwind CSS component library' }
    ]
  },
  {
    toolSlug: 'twilio',
    features: [
      { name: 'API Integration', qualityScore: 9, implementationNotes: 'Comprehensive communication APIs for SMS, voice, and video' }
    ]
  },
  {
    toolSlug: 'v0',
    features: [
      { name: 'Code Generation', qualityScore: 8, implementationNotes: 'AI-powered React component generation from prompts' }
    ]
  },
  {
    toolSlug: 'wordpress-com',
    features: [
      { name: 'Content Management', qualityScore: 8, implementationNotes: 'Hosted WordPress platform with managed infrastructure' },
      { name: 'SEO Optimization', qualityScore: 7, implementationNotes: 'Built-in SEO tools and optimization features' }
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

async function findFeature(featureName: string) {
  const data = await makeGraphQLRequest(`
    query FindFeature($name: String!) {
      features(where: { name: { equals: $name } }) {
        id
        name
      }
    }
  `, { name: featureName });

  return data.features[0] || null;
}

async function createToolFeature(toolId: string, featureId: string, qualityScore: number, implementationNotes: string) {
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

async function connectExistingFeatures() {
  console.log('🔗 Connecting tools to existing features...\n');

  let createdToolFeatures = 0;
  let skippedFeatures = 0;

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
          // Find the existing feature
          const feature = await findFeature(featureData.name);
          
          if (!feature) {
            console.log(`  ⚠️  Feature "${featureData.name}" not found in database`);
            skippedFeatures++;
            continue;
          }

          console.log(`  ✅ Found existing feature: ${feature.name}`);

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
  console.log(`   Created ${createdToolFeatures} new tool-feature relationships`);
  console.log(`   Skipped ${skippedFeatures} features (not found in database)`);

  if (skippedFeatures > 0) {
    console.log(`\n💡 Note: ${skippedFeatures} features were not found. They may need to be created separately.`);
  }
}

// Run the script
connectExistingFeatures();