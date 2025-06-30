#!/usr/bin/env npx tsx

/**
 * Add Workout.cool using existing categories and create fitness tool alternatives
 */

const API_URL = 'http://localhost:3000/api/graphql';
const COOKIE = 'keystonejs-session=Fe26.2**8a2fcd4c2d9bc939b3cc28542a639b12c3eed0dec1b526e75b32e45de1ba2d8b*X3g_cQT7ez1wbclLVAB39g*gaS3FK0DuGfWV42jt1Pa8ujisYL9EritA00LfPcDTECHbR5JxxO26FmZZoL7MOfEZeIn5AkZx4W7rwS56cTZ_g*1782354848471*ae958af088017c959dac0dfe5bdf20cce674a03e729e836ce769415752092*TYzuBn3xln_F7Sk4YAtb_2Qi5yakckgcb5AalHb8Ho0';

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

async function addWorkoutCoolAndFitnessAlternatives() {
  console.log('💪 Adding Workout.cool and fitness tool alternatives...\n');

  try {
    // Step 1: Check if Workout.cool already exists
    const existingWorkout = await makeGraphQLRequest(`
      query {
        tools(where: { slug: { equals: "workout-cool" } }) {
          id
          name
        }
      }
    `);

    let workoutCoolId = null;

    if (existingWorkout.tools.length > 0) {
      console.log(`✅ Workout.cool already exists: ${existingWorkout.tools[0].name}`);
      workoutCoolId = existingWorkout.tools[0].id;
    } else {
      // Find a suitable category (try Development Tools as fallback)
      const categories = await makeGraphQLRequest(`
        query {
          categories(orderBy: { name: asc }) {
            id
            name
          }
        }
      `);

      console.log('Available categories:', categories.categories.map((c: any) => c.name).join(', '));
      
      // Use first available category as fallback
      const categoryId = categories.categories[0].id;
      console.log(`Using category: ${categories.categories[0].name}`);

      // Create Workout.cool
      console.log('➕ Creating Workout.cool...');
      const workoutResult = await makeGraphQLRequest(`
        mutation {
          createTool(data: {
            name: "Workout.cool"
            slug: "workout-cool"
            description: "Comprehensive fitness coaching platform with 1000+ exercises, personalized workouts, and progress tracking"
            isOpenSource: true
            repositoryUrl: "https://github.com/Snouzy/workout-cool"
            websiteUrl: "https://workout.cool"
            githubStars: 3600
            category: { connect: { id: "${categoryId}" } }
          }) {
            id
            name
          }
        }
      `);

      workoutCoolId = workoutResult.createTool.id;
      console.log(`✅ Created Workout.cool: ${workoutResult.createTool.name}`);
    }

    // Step 2: Create proprietary fitness tools if they don't exist
    const fitnessTools = [
      {
        name: 'Nike Training Club',
        slug: 'nike-training-club',
        description: 'Nike\'s fitness app offering workouts, training programs, and wellness guidance',
        websiteUrl: 'https://www.nike.com/ntc-app',
        simpleIconSlug: 'nike',
        simpleIconColor: '#FF6900'
      },
      {
        name: 'Apple Fitness+',
        slug: 'apple-fitness-plus',
        description: 'Apple\'s subscription fitness service with workout videos and Apple Watch integration',
        websiteUrl: 'https://fitness.apple.com',
        simpleIconSlug: 'apple',
        simpleIconColor: '#000000'
      },
      {
        name: 'Peloton Digital',
        slug: 'peloton-digital',
        description: 'Peloton\'s digital fitness platform with live and on-demand workout classes',
        websiteUrl: 'https://www.onepeloton.com/digital'
      },
      {
        name: 'MyFitnessPal',
        slug: 'myfitnesspal',
        description: 'Comprehensive nutrition and fitness tracking app with calorie counting and exercise logging',
        websiteUrl: 'https://www.myfitnesspal.com'
      }
    ];

    const fitnessToolIds: { [key: string]: string } = {};

    for (const tool of fitnessTools) {
      const existingTool = await makeGraphQLRequest(`
        query {
          tools(where: { slug: { equals: "${tool.slug}" } }) {
            id
            name
          }
        }
      `);

      if (existingTool.tools.length > 0) {
        console.log(`✅ ${tool.name} already exists`);
        fitnessToolIds[tool.slug] = existingTool.tools[0].id;
      } else {
        // Use same category as workout.cool
        const categories = await makeGraphQLRequest(`
          query {
            categories(orderBy: { name: asc }) {
              id
              name
            }
          }
        `);
        const categoryId = categories.categories[0].id;

        console.log(`➕ Creating ${tool.name}...`);
        const result = await makeGraphQLRequest(`
          mutation {
            createTool(data: {
              name: "${tool.name}"
              slug: "${tool.slug}"
              description: "${tool.description}"
              isOpenSource: false
              websiteUrl: "${tool.websiteUrl}"
              ${tool.simpleIconSlug ? `simpleIconSlug: "${tool.simpleIconSlug}"` : ''}
              ${tool.simpleIconColor ? `simpleIconColor: "${tool.simpleIconColor}"` : ''}
              category: { connect: { id: "${categoryId}" } }
            }) {
              id
              name
            }
          }
        `);

        fitnessToolIds[tool.slug] = result.createTool.id;
        console.log(`✅ Created: ${result.createTool.name}`);
      }

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Step 3: Create alternative relationships
    const alternatives = [
      { prop: 'nike-training-club', score: '0.85', notes: 'Comprehensive workout platform with larger exercise database and no subscription required' },
      { prop: 'apple-fitness-plus', score: '0.80', notes: 'Free alternative with personalized workouts and progress tracking without device lock-in' },
      { prop: 'peloton-digital', score: '0.75', notes: 'Open source fitness platform with community-driven content and self-hosting option' },
      { prop: 'myfitnesspal', score: '0.70', notes: 'Focuses on workout planning and exercise database rather than nutrition tracking' }
    ];

    console.log('\n🔗 Creating alternative relationships...');
    let createdAlternatives = 0;

    for (const alt of alternatives) {
      try {
        const propToolId = fitnessToolIds[alt.prop];
        
        if (!propToolId || !workoutCoolId) {
          console.log(`❌ Missing tool IDs for ${alt.prop}`);
          continue;
        }

        // Check if alternative already exists
        const existingAlt = await makeGraphQLRequest(`
          query {
            alternatives(where: {
              AND: [
                { proprietaryTool: { id: { equals: "${propToolId}" } } }
                { openSourceTool: { id: { equals: "${workoutCoolId}" } } }
              ]
            }) { id }
          }
        `);

        if (existingAlt.alternatives.length > 0) {
          console.log(`✅ Alternative already exists for ${alt.prop}`);
          continue;
        }

        console.log(`🔗 Creating alternative for ${alt.prop}...`);
        const result = await makeGraphQLRequest(`
          mutation {
            createAlternative(data: {
              proprietaryTool: { connect: { id: "${propToolId}" } }
              openSourceTool: { connect: { id: "${workoutCoolId}" } }
              similarityScore: "${alt.score}"
              comparisonNotes: "${alt.notes}"
            }) {
              id
              proprietaryTool { name }
              openSourceTool { name }
              similarityScore
            }
          }
        `);

        console.log(`✅ Created: ${result.createAlternative.proprietaryTool.name} ↔ ${result.createAlternative.openSourceTool.name} (${result.createAlternative.similarityScore})`);
        createdAlternatives++;

      } catch (error) {
        console.log(`❌ Failed to create alternative for ${alt.prop}:`, error);
      }

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n🎉 Summary:`);
    console.log(`   ✅ Workout.cool ready in database`);
    console.log(`   ✅ All fitness tools created/verified`);
    console.log(`   ✅ Created ${createdAlternatives} new alternative relationships`);

    // Verification
    const verification = await makeGraphQLRequest(`
      query {
        workoutTool: tools(where: { slug: { equals: "workout-cool" } }) {
          name
          repositoryUrl
          githubStars
        }
        workoutAlts: alternatives(where: { openSourceTool: { slug: { equals: "workout-cool" } } }) {
          proprietaryTool { name }
          similarityScore
        }
      }
    `);

    console.log(`\n📋 Verification:`);
    if (verification.workoutTool.length > 0) {
      console.log(`   Workout.cool: ${verification.workoutTool[0].name} (${verification.workoutTool[0].githubStars} stars)`);
      console.log(`   Alternatives created: ${verification.workoutAlts.length}`);
      verification.workoutAlts.forEach((alt: any) => {
        console.log(`   • ${alt.proprietaryTool.name} (${alt.similarityScore})`);
      });
    }

  } catch (error) {
    console.error('❌ Error adding workout tools:', error);
  }
}

// Run the script
addWorkoutCoolAndFitnessAlternatives();