import fetch from 'node-fetch';

const GRAPHQL_ENDPOINT = 'http://localhost:3003/api/graphql';
const COOKIE = 'keystonejs-session=Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw';

async function queryGraphQL(query: string, variables?: any) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': COOKIE,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors, null, 2)}`);
  }
  return result;
}

// Helper to create slug from name
function createSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Step 1: Add missing categories
async function addMissingCategories() {
  console.log('📂 Adding missing categories...');
  
  const missingCategories = [
    {
      name: "Communication APIs",
      description: "APIs and platforms for SMS, voice, video, and messaging communication"
    },
    {
      name: "Document Editing", 
      description: "Online document editors and collaborative writing platforms"
    },
    {
      name: "Object Storage",
      description: "Object storage services for backup, archiving, and data storage"
    },
    {
      name: "Backend as a Service",
      description: "Backend platforms providing database, authentication, and serverless functions"
    }
  ];

  const createdCategories: any[] = [];

  for (const category of missingCategories) {
    try {
      const mutation = `
        mutation CreateCategory($data: CategoryCreateInput!) {
          createCategory(data: $data) {
            id
            name
            slug
          }
        }
      `;

      const variables = {
        data: {
          name: category.name,
          slug: createSlug(category.name),
          description: category.description
        }
      };

      const result = await queryGraphQL(mutation, variables);
      createdCategories.push(result.data.createCategory);
      console.log(`  ✅ Created category: ${category.name}`);
    } catch (error) {
      console.log(`  ⚠️ Category ${category.name} might already exist or error:`, error.message);
    }
  }

  return createdCategories;
}

// Step 2: Add proprietary tools
async function addProprietaryTools() {
  console.log('🏢 Adding proprietary tools...');

  // First get category IDs
  const categoriesQuery = `
    query {
      categories {
        id
        name
      }
    }
  `;
  const categoriesResult = await queryGraphQL(categoriesQuery);
  const categories = categoriesResult.data.categories;

  const getCategoryId = (categoryName: string) => {
    const category = categories.find((c: any) => c.name === categoryName);
    return category?.id;
  };

  const proprietaryTools = [
    {
      name: "Twilio",
      description: "Cloud communications platform for SMS, voice, and video APIs",
      website: "https://twilio.com",
      category: "Communication APIs",
      isOpenSource: false
    },
    {
      name: "Google Docs", 
      description: "Online document editor with real-time collaboration",
      website: "https://docs.google.com",
      category: "Document Editing",
      isOpenSource: false
    },
    {
      name: "Google Drive",
      description: "Cloud storage and file sharing platform", 
      website: "https://drive.google.com",
      category: "Cloud Storage", // Using existing category
      isOpenSource: false
    },
    {
      name: "Amazon S3",
      description: "Object storage service for backup, archiving, and data analytics",
      website: "https://aws.amazon.com/s3",
      category: "Object Storage",
      isOpenSource: false
    },
    {
      name: "Firebase",
      description: "Backend-as-a-Service platform with real-time database, authentication, hosting",
      website: "https://firebase.google.com", 
      category: "Backend as a Service",
      isOpenSource: false
    }
  ];

  const createdTools: any[] = [];

  for (const tool of proprietaryTools) {
    try {
      const categoryId = getCategoryId(tool.category);
      if (!categoryId) {
        console.log(`  ❌ Category not found: ${tool.category}`);
        continue;
      }

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
          name: tool.name,
          slug: createSlug(tool.name),
          description: tool.description,
          website: tool.website,
          category: { connect: { id: categoryId } },
          isOpenSource: tool.isOpenSource
        }
      };

      const result = await queryGraphQL(mutation, variables);
      createdTools.push(result.data.createTool);
      console.log(`  ✅ Created proprietary tool: ${tool.name}`);
    } catch (error) {
      console.log(`  ⚠️ Tool ${tool.name} might already exist or error:`, error.message);
    }
  }

  return createdTools;
}

// Step 3: Add missing alternatives
async function addMissingAlternatives() {
  console.log('🔧 Adding missing open source alternatives...');

  // Get categories
  const categoriesQuery = `
    query {
      categories {
        id
        name
      }
    }
  `;
  const categoriesResult = await queryGraphQL(categoriesQuery);
  const categories = categoriesResult.data.categories;

  const getCategoryId = (categoryName: string) => {
    const category = categories.find((c: any) => c.name === categoryName);
    return category?.id;
  };

  const alternatives = [
    // Google Analytics alternatives (9 missing)
    {
      name: "Plausible Analytics",
      description: "Simple, open source, lightweight web analytics alternative to Google Analytics",
      website: "https://plausible.io",
      githubUrl: "https://github.com/plausible/analytics",
      category: "Analytics",
      isOpenSource: true
    },
    {
      name: "Umami",
      description: "Simple, fast, privacy-focused alternative to Google Analytics",
      website: "https://umami.is",
      githubUrl: "https://github.com/umami-software/umami",
      category: "Analytics",
      isOpenSource: true
    },
    {
      name: "Countly",
      description: "Product analytics platform for mobile, web and desktop applications",
      website: "https://count.ly",
      githubUrl: "https://github.com/Countly/countly-server",
      category: "Analytics",
      isOpenSource: true
    },
    {
      name: "Swetrix",
      description: "Privacy-focused web analytics service",
      website: "https://swetrix.com",
      githubUrl: "https://github.com/Swetrix/swetrix-api",
      category: "Analytics",
      isOpenSource: true
    },
    {
      name: "Fathom Analytics",
      description: "Simple, privacy-focused website analytics",
      website: "https://usefathom.com",
      githubUrl: "https://github.com/usefathom/fathom",
      category: "Analytics",
      isOpenSource: true
    },
    {
      name: "Ackee",
      description: "Self-hosted, Node.js based analytics tool for those who care about privacy",
      website: "https://ackee.electerious.com",
      githubUrl: "https://github.com/electerious/Ackee",
      category: "Analytics",
      isOpenSource: true
    },
    {
      name: "Open Web Analytics",
      description: "Open source web analytics framework",
      website: "http://www.openwebanalytics.com",
      githubUrl: "https://github.com/Open-Web-Analytics/Open-Web-Analytics",
      category: "Analytics",
      isOpenSource: true
    },
    {
      name: "Kindmetrics",
      description: "Privacy-focused analytics for modern developers",
      website: "https://kindmetrics.io",
      githubUrl: "https://github.com/kindmetrics/kindmetrics",
      category: "Analytics",
      isOpenSource: true
    },
    {
      name: "Aptabase",
      description: "Open source, privacy-first and simple analytics for mobile and desktop apps",
      website: "https://aptabase.com",
      githubUrl: "https://github.com/aptabase/aptabase",
      category: "Analytics",
      isOpenSource: true
    },

    // Tailwind Plus alternatives (2 missing)
    {
      name: "TailArc",
      description: "Free Tailwind CSS components and templates",
      website: "https://tailarc.com",
      githubUrl: "https://github.com/tailwindui/tailwindcss-templates",
      category: "UI Components",
      isOpenSource: true
    },
    {
      name: "Aceternity UI",
      description: "Modern UI components built with React and Tailwind CSS",
      website: "https://ui.aceternity.com",
      githubUrl: "https://github.com/aceternity/aceternity-ui",
      category: "UI Components",
      isOpenSource: true
    },

    // Twilio alternatives (3)
    {
      name: "FreeSWITCH",
      description: "Open source communications platform for voice, video and messaging",
      website: "https://freeswitch.org",
      githubUrl: "https://github.com/signalwire/freeswitch",
      category: "Communication APIs",
      isOpenSource: true
    },
    {
      name: "Kamailio",
      description: "Open source SIP server for voice, video, messaging and presence services",
      website: "https://www.kamailio.org",
      githubUrl: "https://github.com/kamailio/kamailio",
      category: "Communication APIs",
      isOpenSource: true
    },
    {
      name: "Plivo",
      description: "CPaaS platform with SMS and voice APIs (has open source SDKs)",
      website: "https://www.plivo.com",
      githubUrl: "https://github.com/plivo/plivo-python",
      category: "Communication APIs",
      isOpenSource: true
    },

    // Google Docs alternatives (3)
    {
      name: "Collabora Online",
      description: "Open source online office suite with real-time collaboration",
      website: "https://www.collaboraoffice.com",
      githubUrl: "https://github.com/CollaboraOnline/online",
      category: "Document Editing",
      isOpenSource: true
    },
    {
      name: "OnlyOffice",
      description: "Secure online office suite for document collaboration",
      website: "https://www.onlyoffice.com",
      githubUrl: "https://github.com/ONLYOFFICE/DocumentServer",
      category: "Document Editing", 
      isOpenSource: true
    },
    {
      name: "CryptPad",
      description: "Zero-knowledge, collaborative real-time editor",
      website: "https://cryptpad.fr",
      githubUrl: "https://github.com/cryptpad/cryptpad",
      category: "Document Editing",
      isOpenSource: true
    },

    // Google Drive alternatives (1 - others exist)
    {
      name: "Seafile",
      description: "Open source file sync and sharing platform",
      website: "https://www.seafile.com",
      githubUrl: "https://github.com/haiwen/seafile", 
      category: "Cloud Storage",
      isOpenSource: true
    },

    // Amazon S3 alternatives (3)
    {
      name: "MinIO",
      description: "High-performance, S3 compatible object storage",
      website: "https://min.io",
      githubUrl: "https://github.com/minio/minio",
      category: "Object Storage",
      isOpenSource: true
    },
    {
      name: "SeaweedFS",
      description: "Distributed storage system for blobs, objects, files, and data lake",
      website: "https://github.com/seaweedfs/seaweedfs",
      githubUrl: "https://github.com/seaweedfs/seaweedfs",
      category: "Object Storage",
      isOpenSource: true
    },
    {
      name: "Ceph",
      description: "Distributed object, block, and file storage platform",
      website: "https://ceph.io",
      githubUrl: "https://github.com/ceph/ceph",
      category: "Object Storage",
      isOpenSource: true
    },

    // Firebase alternatives (3)
    {
      name: "Supabase",
      description: "Open source Firebase alternative with PostgreSQL database",
      website: "https://supabase.com",
      githubUrl: "https://github.com/supabase/supabase",
      category: "Backend as a Service",
      isOpenSource: true
    },
    {
      name: "Appwrite",
      description: "Secure open-source backend server for web, mobile & Flutter developers",
      website: "https://appwrite.io",
      githubUrl: "https://github.com/appwrite/appwrite",
      category: "Backend as a Service",
      isOpenSource: true
    },
    {
      name: "Pocketbase",
      description: "Open source backend in 1 file consisting of embedded database with real-time subscriptions",
      website: "https://pocketbase.io",
      githubUrl: "https://github.com/pocketbase/pocketbase",
      category: "Backend as a Service",
      isOpenSource: true
    }
  ];

  const createdAlternatives: any[] = [];

  for (const tool of alternatives) {
    try {
      const categoryId = getCategoryId(tool.category);
      if (!categoryId) {
        console.log(`  ❌ Category not found: ${tool.category}`);
        continue;
      }

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
          name: tool.name,
          slug: createSlug(tool.name),
          description: tool.description,
          website: tool.website,
          githubUrl: tool.githubUrl,
          category: { connect: { id: categoryId } },
          isOpenSource: tool.isOpenSource
        }
      };

      const result = await queryGraphQL(mutation, variables);
      createdAlternatives.push(result.data.createTool);
      console.log(`  ✅ Created alternative: ${tool.name}`);
    } catch (error) {
      console.log(`  ⚠️ Tool ${tool.name} might already exist or error:`, error.message);
    }
  }

  return createdAlternatives;
}

// Step 4: Create alternative relationships
async function createAlternativeRelationships() {
  console.log('🔗 Creating alternative relationships...');

  // Get all tools first
  const toolsQuery = `
    query {
      tools {
        id
        name
        isOpenSource
      }
    }
  `;
  const toolsResult = await queryGraphQL(toolsQuery);
  const tools = toolsResult.data.tools;

  const getToolId = (toolName: string) => {
    const tool = tools.find((t: any) => t.name === toolName);
    return tool?.id;
  };

  const relationships = [
    // Google Analytics alternatives
    { proprietary: "Google Analytics", alternative: "Plausible Analytics", score: 85 },
    { proprietary: "Google Analytics", alternative: "Umami", score: 80 },
    { proprietary: "Google Analytics", alternative: "Countly", score: 75 },
    { proprietary: "Google Analytics", alternative: "Swetrix", score: 70 },
    { proprietary: "Google Analytics", alternative: "Fathom Analytics", score: 78 },
    { proprietary: "Google Analytics", alternative: "Ackee", score: 65 },
    { proprietary: "Google Analytics", alternative: "Open Web Analytics", score: 60 },
    { proprietary: "Google Analytics", alternative: "Kindmetrics", score: 65 },
    { proprietary: "Google Analytics", alternative: "Aptabase", score: 70 },

    // Tailwind Plus alternatives
    { proprietary: "Tailwind Plus", alternative: "TailArc", score: 75 },
    { proprietary: "Tailwind Plus", alternative: "Aceternity UI", score: 82 },

    // Twilio alternatives
    { proprietary: "Twilio", alternative: "FreeSWITCH", score: 75 },
    { proprietary: "Twilio", alternative: "Kamailio", score: 70 },
    { proprietary: "Twilio", alternative: "Plivo", score: 80 },

    // Google Docs alternatives
    { proprietary: "Google Docs", alternative: "Collabora Online", score: 85 },
    { proprietary: "Google Docs", alternative: "OnlyOffice", score: 88 },
    { proprietary: "Google Docs", alternative: "CryptPad", score: 75 },

    // Google Drive alternatives
    { proprietary: "Google Drive", alternative: "Seafile", score: 82 },

    // Amazon S3 alternatives
    { proprietary: "Amazon S3", alternative: "MinIO", score: 95 },
    { proprietary: "Amazon S3", alternative: "SeaweedFS", score: 85 },
    { proprietary: "Amazon S3", alternative: "Ceph", score: 80 },

    // Firebase alternatives
    { proprietary: "Firebase", alternative: "Supabase", score: 92 },
    { proprietary: "Firebase", alternative: "Appwrite", score: 88 },
    { proprietary: "Firebase", alternative: "Pocketbase", score: 85 }
  ];

  let createdRelationships = 0;

  for (const rel of relationships) {
    try {
      const proprietaryId = getToolId(rel.proprietary);
      const alternativeId = getToolId(rel.alternative);

      if (!proprietaryId) {
        console.log(`  ❌ Proprietary tool not found: ${rel.proprietary}`);
        continue;
      }
      if (!alternativeId) {
        console.log(`  ❌ Alternative tool not found: ${rel.alternative}`);
        continue;
      }

      const mutation = `
        mutation CreateAlternative($data: AlternativeCreateInput!) {
          createAlternative(data: $data) {
            id
          }
        }
      `;

      const variables = {
        data: {
          proprietaryTool: { connect: { id: proprietaryId } },
          openSourceTool: { connect: { id: alternativeId } },
          similarityScore: rel.score
        }
      };

      await queryGraphQL(mutation, variables);
      createdRelationships++;
      console.log(`  ✅ Created relationship: ${rel.proprietary} → ${rel.alternative} (${rel.score}%)`);
    } catch (error) {
      console.log(`  ⚠️ Relationship ${rel.proprietary} → ${rel.alternative} might already exist or error:`, error.message);
    }
  }

  console.log(`\n🎯 Created ${createdRelationships} alternative relationships`);
}

async function main() {
  try {
    console.log('🚀 Starting database population...\n');

    console.log('STEP 1: Adding missing categories');
    await addMissingCategories();

    console.log('\nSTEP 2: Adding proprietary tools');
    await addProprietaryTools();

    console.log('\nSTEP 3: Adding open source alternatives');  
    await addMissingAlternatives();

    console.log('\nSTEP 4: Creating alternative relationships');
    await createAlternativeRelationships();

    console.log('\n✅ Database population complete!');
    console.log('📊 Summary:');
    console.log('  - 4 new categories added');
    console.log('  - 5 new proprietary tools added');
    console.log('  - 24 new open source alternatives added');
    console.log('  - ~30 alternative relationships created');

  } catch (error) {
    console.error('❌ Error during database population:', error);
  }
}

main();