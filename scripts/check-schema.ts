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
    console.log('🔍 Checking GraphQL schema...\n');

    // Introspection query to get schema info
    const introspectionQuery = `
      query IntrospectionQuery {
        __schema {
          mutationType {
            name
            fields {
              name
              args {
                name
                type {
                  name
                  kind
                  inputFields {
                    name
                    type {
                      name
                      kind
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result = await queryGraphQL(introspectionQuery);
    
    // Find Tool creation mutation
    const mutations = result.data.__schema.mutationType.fields;
    const createToolMutation = mutations.find((m: any) => m.name === 'createTool');
    
    if (createToolMutation) {
      console.log('📦 createTool mutation found!');
      console.log('Arguments:', createToolMutation.args);
      
      const dataArg = createToolMutation.args.find((arg: any) => arg.name === 'data');
      if (dataArg && dataArg.type.inputFields) {
        console.log('\n🏗️ ToolCreateInput fields:');
        dataArg.type.inputFields.forEach((field: any) => {
          console.log(`  - ${field.name}: ${field.type.name || field.type.kind}`);
        });
      }
    }

    // Also check Category
    const createCategoryMutation = mutations.find((m: any) => m.name === 'createCategory');
    if (createCategoryMutation) {
      console.log('\n📂 createCategory mutation found!');
      const dataArg = createCategoryMutation.args.find((arg: any) => arg.name === 'data');
      if (dataArg && dataArg.type.inputFields) {
        console.log('\n🏗️ CategoryCreateInput fields:');
        dataArg.type.inputFields.forEach((field: any) => {
          console.log(`  - ${field.name}: ${field.type.name || field.type.kind}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();