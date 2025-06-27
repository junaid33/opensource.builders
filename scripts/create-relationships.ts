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

async function createAlternativeRelationships() {
  console.log('🔗 Creating alternative relationships with correct decimal format...');

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
    { proprietary: "Google Analytics", alternative: "Plausible Analytics", score: "85" },
    { proprietary: "Google Analytics", alternative: "Umami", score: "80" },
    { proprietary: "Google Analytics", alternative: "Countly", score: "75" },
    { proprietary: "Google Analytics", alternative: "Swetrix", score: "70" },
    { proprietary: "Google Analytics", alternative: "Fathom Analytics", score: "78" },
    { proprietary: "Google Analytics", alternative: "Ackee", score: "65" },
    { proprietary: "Google Analytics", alternative: "Open Web Analytics", score: "60" },
    { proprietary: "Google Analytics", alternative: "Kindmetrics", score: "65" },
    { proprietary: "Google Analytics", alternative: "Aptabase", score: "70" },

    // Tailwind Plus alternatives
    { proprietary: "Tailwind Plus", alternative: "TailArc", score: "75" },
    { proprietary: "Tailwind Plus", alternative: "Aceternity UI", score: "82" },

    // Twilio alternatives
    { proprietary: "Twilio", alternative: "FreeSWITCH", score: "75" },
    { proprietary: "Twilio", alternative: "Kamailio", score: "70" },
    { proprietary: "Twilio", alternative: "Plivo", score: "80" },

    // Google Docs alternatives
    { proprietary: "Google Docs", alternative: "Collabora Online", score: "85" },
    { proprietary: "Google Docs", alternative: "OnlyOffice", score: "88" },
    { proprietary: "Google Docs", alternative: "CryptPad", score: "75" },

    // Google Drive alternatives
    { proprietary: "Google Drive", alternative: "Seafile", score: "82" },

    // Amazon S3 alternatives
    { proprietary: "Amazon S3", alternative: "MinIO", score: "95" },
    { proprietary: "Amazon S3", alternative: "SeaweedFS", score: "85" },
    { proprietary: "Amazon S3", alternative: "Ceph", score: "80" },

    // Firebase alternatives
    { proprietary: "Firebase", alternative: "Supabase", score: "92" },
    { proprietary: "Firebase", alternative: "Appwrite", score: "88" },
    { proprietary: "Firebase", alternative: "Pocketbase", score: "85" }
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
    console.log('🚀 Creating alternative relationships...\n');
    await createAlternativeRelationships();
    console.log('\n✅ Relationships creation complete!');
  } catch (error) {
    console.error('❌ Error during relationships creation:', error);
  }
}

main();