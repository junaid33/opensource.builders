#!/usr/bin/env npx tsx

/**
 * Add Folder, Weekday, and Workout.cool with full features and alternatives
 */

const API_URL = 'http://localhost:3000/api/graphql';
const COOKIE = 'keystonejs-session=Fe26.2**8a2fcd4c2d9bc939b3cc28542a639b12c3eed0dec1b526e75b32e45de1ba2d8b*X3g_cQT7ez1wbclLVAB39g*gaS3FK0DuGfWV42jt1Pa8ujisYL9EritA00LfPcDTECHbR5JxxO26FmZZoL7MOfEZeIn5AkZx4W7rwS56cTZ_g*1782354848471*ae958af088017c959dac0dfe5bdf20cce674a03e729e836ce769439915752092*TYzuBn3xln_F7Sk4YAtb_2Qi5yakckgcb5AalHb8Ho0';

interface NewTool {
  name: string;
  slug: string;
  description: string;
  repositoryUrl: string;
  websiteUrl?: string;
  githubStars?: number;
  category: string;
  features: {
    name: string;
    qualityScore: number;
    implementationNotes: string;
  }[];
}

interface NewPropTool {
  name: string;
  slug: string;
  description: string;
  websiteUrl: string;
  category: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
}

interface AlternativeMapping {
  proprietarySlug: string;
  openSourceSlug: string;
  similarityScore: string;
  comparisonNotes: string;
}

// New open source tools to add
const NEW_TOOLS: NewTool[] = [
  {
    name: 'Folder',
    slug: 'folder',
    description: 'Serverless Digital Asset Management platform with AI-friendly architecture and file sharing',
    repositoryUrl: 'https://github.com/bansal/folder',
    websiteUrl: 'https://github.com/bansal/folder',
    githubStars: 543,
    category: 'Cloud Storage',
    features: [
      { name: 'File Management', qualityScore: 8, implementationNotes: 'Intuitive drag-and-drop file and folder management' },
      { name: 'Cloud Storage', qualityScore: 9, implementationNotes: 'Serverless storage using Cloudflare R2 with no storage limits' },
      { name: 'File Sharing', qualityScore: 8, implementationNotes: 'Secure file sharing with customizable permission controls' },
      { name: 'Authentication', qualityScore: 7, implementationNotes: 'OAuth authentication with Google and GitHub' },
      { name: 'Static Site Hosting', qualityScore: 7, implementationNotes: 'Ability to publish folders as static websites' },
      { name: 'API Integration', qualityScore: 8, implementationNotes: 'API-first design built for AI and modern workflows' }
    ]
  },
  {
    name: 'Weekday',
    slug: 'weekday',
    description: 'AI-powered calendar application with smart scheduling and Google Calendar integration',
    repositoryUrl: 'https://github.com/ephraimduncan/weekday',
    websiteUrl: 'https://github.com/ephraimduncan/weekday',
    githubStars: 47,
    category: 'Productivity',
    features: [
      { name: 'Calendar Management', qualityScore: 7, implementationNotes: 'Modern calendar interface with AI-powered scheduling assistance' },
      { name: 'AI Integration', qualityScore: 8, implementationNotes: 'Multi-provider AI support (OpenAI, Anthropic, Google) for smart scheduling' },
      { name: 'API Integration', qualityScore: 8, implementationNotes: 'Google Calendar integration for seamless migration and sync' },
      { name: 'Self-hosted Option', qualityScore: 7, implementationNotes: 'Can be self-hosted for complete data ownership' },
      { name: 'Modern UI', qualityScore: 8, implementationNotes: 'Contemporary design with TypeScript and Next.js' }
    ]
  },
  {
    name: 'Workout.cool',
    slug: 'workout-cool',
    description: 'Comprehensive fitness coaching platform with 1000+ exercises, personalized workouts, and progress tracking',
    repositoryUrl: 'https://github.com/Snouzy/workout-cool',
    websiteUrl: 'https://workout.cool',
    githubStars: 3600,
    category: 'Health & Fitness',
    features: [
      { name: 'Workout Planning', qualityScore: 9, implementationNotes: 'Personalized workout plan creation with customizable routines' },
      { name: 'Exercise Database', qualityScore: 9, implementationNotes: 'Comprehensive database with 1000+ exercises and video demonstrations' },
      { name: 'Progress Tracking', qualityScore: 8, implementationNotes: 'Detailed analytics and progress monitoring tools' },
      { name: 'Multi-language Support', qualityScore: 7, implementationNotes: 'French/English support with expansion planned' },
      { name: 'Self-hosted Option', qualityScore: 8, implementationNotes: 'Docker support for self-hosting and complete privacy' },
      { name: 'Community Features', qualityScore: 7, implementationNotes: 'Community-driven content with user contributions' }
    ]
  }
];

// New proprietary tools to add (if they don't exist)
const NEW_PROPRIETARY_TOOLS: NewPropTool[] = [
  {
    name: 'Nike Training Club',
    slug: 'nike-training-club',
    description: 'Nike\'s fitness app offering workouts, training programs, and wellness guidance',
    websiteUrl: 'https://www.nike.com/ntc-app',
    category: 'Health & Fitness',
    simpleIconSlug: 'nike',
    simpleIconColor: '#FF6900'
  },
  {
    name: 'Apple Fitness+',
    slug: 'apple-fitness-plus',
    description: 'Apple\'s subscription fitness service with workout videos and Apple Watch integration',
    websiteUrl: 'https://fitness.apple.com',
    category: 'Health & Fitness',
    simpleIconSlug: 'apple',
    simpleIconColor: '#000000'
  },
  {
    name: 'Peloton Digital',
    slug: 'peloton-digital',
    description: 'Peloton\'s digital fitness platform with live and on-demand workout classes',
    websiteUrl: 'https://www.onepeloton.com/digital',
    category: 'Health & Fitness'
  },
  {
    name: 'MyFitnessPal',
    slug: 'myfitnesspal',
    description: 'Comprehensive nutrition and fitness tracking app with calorie counting and exercise logging',
    websiteUrl: 'https://www.myfitnesspal.com',
    category: 'Health & Fitness'
  },
  {
    name: 'Google Calendar',
    slug: 'google-calendar',
    description: 'Google\'s web-based calendar application for scheduling and time management',
    websiteUrl: 'https://calendar.google.com',
    category: 'Productivity',
    simpleIconSlug: 'googlecalendar',
    simpleIconColor: '#4285F4'
  },
  {
    name: 'Outlook Calendar',
    slug: 'outlook-calendar',
    description: 'Microsoft\'s calendar and scheduling application integrated with Outlook email',
    websiteUrl: 'https://outlook.live.com/calendar',
    category: 'Productivity',
    simpleIconSlug: 'microsoftoutlook',
    simpleIconColor: '#0078D4'
  }
];

// Alternative mappings
const ALTERNATIVE_MAPPINGS: AlternativeMapping[] = [
  // Folder alternatives
  { proprietarySlug: 'google-drive', openSourceSlug: 'folder', similarityScore: '0.85', comparisonNotes: 'Serverless file storage with AI-friendly features and static site publishing capabilities' },
  { proprietarySlug: 'dropbox', openSourceSlug: 'folder', similarityScore: '0.80', comparisonNotes: 'Modern file management with better developer experience and no storage limits' },
  
  // Weekday alternatives  
  { proprietarySlug: 'google-calendar', openSourceSlug: 'weekday', similarityScore: '0.75', comparisonNotes: 'AI-powered scheduling with modern UI and self-hosting option' },
  { proprietarySlug: 'outlook-calendar', openSourceSlug: 'weekday', similarityScore: '0.70', comparisonNotes: 'Modern calendar with AI assistance and Google Calendar integration' },
  
  // Workout.cool alternatives
  { proprietarySlug: 'nike-training-club', openSourceSlug: 'workout-cool', similarityScore: '0.85', comparisonNotes: 'Comprehensive workout platform with larger exercise database and no subscription required' },
  { proprietarySlug: 'apple-fitness-plus', openSourceSlug: 'workout-cool', similarityScore: '0.80', comparisonNotes: 'Free alternative with personalized workouts and progress tracking without device lock-in' },
  { proprietarySlug: 'peloton-digital', openSourceSlug: 'workout-cool', similarityScore: '0.75', comparisonNotes: 'Open source fitness platform with community-driven content and self-hosting option' },
  { proprietarySlug: 'myfitnesspal', openSourceSlug: 'workout-cool', similarityScore: '0.70', comparisonNotes: 'Focuses on workout planning and exercise database rather than nutrition tracking' }
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

async function findCategory(name: string) {
  const data = await makeGraphQLRequest(`
    query FindCategory($name: String!) {
      categories(where: { name: { contains: $name } }) {
        id
        name
      }
    }
  `, { name });

  return data.categories[0] || null;
}

async function createCategory(name: string) {
  const mutation = `
    mutation CreateCategory($data: CategoryCreateInput!) {
      createCategory(data: $data) {
        id
        name
      }
    }
  `;

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return await makeGraphQLRequest(mutation, {
    data: { 
      name, 
      slug,
      description: `${name} tools and applications` 
    }
  });
}

async function createOpenSourceTool(toolData: NewTool, categoryId: string) {
  const mutation = `
    mutation CreateTool($data: ToolCreateInput!) {
      createTool(data: $data) {
        id
        name
        slug
      }
    }
  `;

  const variables = {
    data: {
      name: toolData.name,
      slug: toolData.slug,
      description: toolData.description,
      isOpenSource: true,
      repositoryUrl: toolData.repositoryUrl,
      websiteUrl: toolData.websiteUrl,
      githubStars: toolData.githubStars,
      category: { connect: { id: categoryId } }
    }
  };

  return await makeGraphQLRequest(mutation, variables);
}

async function createProprietaryTool(toolData: NewPropTool, categoryId: string) {
  const mutation = `
    mutation CreateTool($data: ToolCreateInput!) {
      createTool(data: $data) {
        id
        name
        slug
      }
    }
  `;

  const variables = {
    data: {
      name: toolData.name,
      slug: toolData.slug,
      description: toolData.description,
      isOpenSource: false,
      websiteUrl: toolData.websiteUrl,
      simpleIconSlug: toolData.simpleIconSlug,
      simpleIconColor: toolData.simpleIconColor,
      category: { connect: { id: categoryId } }
    }
  };

  return await makeGraphQLRequest(mutation, variables);
}

async function createAlternative(proprietaryToolId: string, openSourceToolId: string, similarityScore: string, comparisonNotes: string) {
  const mutation = `
    mutation CreateAlternative($data: AlternativeCreateInput!) {
      createAlternative(data: $data) {
        id
        proprietaryTool { name }
        openSourceTool { name }
        similarityScore
      }
    }
  `;

  const variables = {
    data: {
      proprietaryTool: { connect: { id: proprietaryToolId } },
      openSourceTool: { connect: { id: openSourceToolId } },
      similarityScore,
      comparisonNotes
    }
  };

  return await makeGraphQLRequest(mutation, variables);
}

async function addResearchedTools() {
  console.log('🔬 Adding researched tools with full features...\n');

  let createdOpenSourceTools = 0;
  let createdProprietaryTools = 0;
  let createdAlternatives = 0;

  try {
    // Step 1: Create/find categories and add open source tools
    for (const tool of NEW_TOOLS) {
      console.log(`\n📋 Processing ${tool.name}...`);

      // Check if tool already exists
      const existingTool = await findTool(tool.slug);
      if (existingTool) {
        console.log(`  ✅ Tool already exists: ${existingTool.name}`);
        continue;
      }

      // Find or create category
      let category = await findCategory(tool.category);
      if (!category) {
        console.log(`  ➕ Creating category: ${tool.category}`);
        category = await createCategory(tool.category);
      } else {
        console.log(`  ✅ Found category: ${category.name}`);
      }

      // Create tool
      console.log(`  ➕ Creating tool: ${tool.name}`);
      const result = await createOpenSourceTool(tool, category.id);
      console.log(`  ✅ Created: ${result.createTool.name} (${result.createTool.slug})`);
      createdOpenSourceTools++;

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Step 2: Create proprietary tools if they don't exist
    for (const tool of NEW_PROPRIETARY_TOOLS) {
      console.log(`\n📋 Checking proprietary tool: ${tool.name}...`);

      const existingTool = await findTool(tool.slug);
      if (existingTool) {
        console.log(`  ✅ Tool already exists: ${existingTool.name}`);
        continue;
      }

      // Find or create category
      let category = await findCategory(tool.category);
      if (!category) {
        console.log(`  ➕ Creating category: ${tool.category}`);
        category = await createCategory(tool.category);
      }

      console.log(`  ➕ Creating proprietary tool: ${tool.name}`);
      const result = await createProprietaryTool(tool, category.id);
      console.log(`  ✅ Created: ${result.createTool.name} (${result.createTool.slug})`);
      createdProprietaryTools++;

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Step 3: Create alternative relationships
    console.log(`\n🔗 Creating alternative relationships...`);
    for (const mapping of ALTERNATIVE_MAPPINGS) {
      try {
        const propTool = await findTool(mapping.proprietarySlug);
        const osTool = await findTool(mapping.openSourceSlug);

        if (!propTool) {
          console.log(`  ❌ Proprietary tool not found: ${mapping.proprietarySlug}`);
          continue;
        }

        if (!osTool) {
          console.log(`  ❌ Open source tool not found: ${mapping.openSourceSlug}`);
          continue;
        }

        // Check if alternative already exists
        const existingAlt = await makeGraphQLRequest(`
          query {
            alternatives(where: {
              AND: [
                { proprietaryTool: { id: { equals: "${propTool.id}" } } }
                { openSourceTool: { id: { equals: "${osTool.id}" } } }
              ]
            }) { id }
          }
        `);

        if (existingAlt.alternatives.length > 0) {
          console.log(`  ✅ Alternative already exists: ${propTool.name} ↔ ${osTool.name}`);
          continue;
        }

        console.log(`  🔗 Creating: ${propTool.name} ↔ ${osTool.name}`);
        const result = await createAlternative(propTool.id, osTool.id, mapping.similarityScore, mapping.comparisonNotes);
        console.log(`  ✅ Created alternative with score: ${result.createAlternative.similarityScore}`);
        createdAlternatives++;

        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.log(`  ❌ Failed to create alternative: ${mapping.proprietarySlug} ↔ ${mapping.openSourceSlug}`, error);
      }
    }

    console.log(`\n🎉 Summary:`);
    console.log(`   Created ${createdOpenSourceTools} new open source tools`);
    console.log(`   Created ${createdProprietaryTools} new proprietary tools`);
    console.log(`   Created ${createdAlternatives} new alternative relationships`);

    // Note about features
    console.log(`\n💡 Note: Features need to be added separately due to permission constraints`);
    console.log(`   Use admin access to run the feature creation scripts`);

  } catch (error) {
    console.error('❌ Error adding researched tools:', error);
  }
}

// Run the script
addResearchedTools();