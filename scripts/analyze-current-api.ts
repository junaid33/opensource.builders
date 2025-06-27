import fetch from 'node-fetch';

const GRAPHQL_ENDPOINT = 'http://localhost:3003/api/graphql';
const COOKIE = 'keystonejs-session=Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw';

async function queryGraphQL(query: string) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': COOKIE,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function main() {
  try {
    console.log('🔍 Analyzing current API data...\n');

    // Get all tools
    const toolsQuery = `
      query {
        tools {
          id
          name
          slug
          description
          isOpenSource
          category {
            id
            name
          }
        }
      }
    `;

    const toolsResult = await queryGraphQL(toolsQuery);
    console.log(`📦 Current Tools (${toolsResult.data?.tools?.length || 0}):`);
    toolsResult.data?.tools?.forEach((tool: any) => {
      console.log(`  - ${tool.name} (${tool.category?.name || 'No Category'})`);
    });

    // Get all categories
    const categoriesQuery = `
      query {
        categories {
          id
          name
          slug
          description
        }
      }
    `;

    const categoriesResult = await queryGraphQL(categoriesQuery);
    console.log(`\n🏷️ Current Categories (${categoriesResult.data?.categories?.length || 0}):`);
    categoriesResult.data?.categories?.forEach((category: any) => {
      console.log(`  - ${category.name}`);
    });

    // Get all features
    const featuresQuery = `
      query {
        features {
          id
          name
          description
          featureType
        }
      }
    `;

    const featuresResult = await queryGraphQL(featuresQuery);
    console.log(`\n⚡ Current Features (${featuresResult.data?.features?.length || 0}):`);
    featuresResult.data?.features?.forEach((feature: any) => {
      console.log(`  - ${feature.name} (${feature.featureType || 'No Type'})`);
    });

    console.log('\n✅ API analysis complete!');

  } catch (error) {
    console.error('❌ Error analyzing API:', error);
  }
}

main();