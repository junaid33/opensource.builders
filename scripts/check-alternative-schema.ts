#!/usr/bin/env npx tsx

/**
 * Check the actual Alternative model schema
 */

const API_URL = 'http://localhost:3000/api/graphql';
const COOKIE = 'keystonejs-session=Fe26.2**8a2fcd4c2d9bc939b3cc28542a639b12c3eed0dec1b526e75b32e45de1ba2d8b*X3g_cQT7ez1wbclLVAB39g*gaS3FK0DuGfWV42jt1Pa8ujisYL9EritA00LfPcDTECHbR5JxxO26FmZZoL7MOfEZeIn5AkZx4W7rwS56cTZ_g*1782354848471*ae958af088017c959dac0dfe5bdf20cce674a03e729e836ce769439915752092*TYzuBn3xln_F7Sk4YAtb_2Qi5yakckgcb5AalHb8Ho0';

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

async function checkSchema() {
  console.log('🔍 Checking Alternative model schema...\n');

  try {
    // Check existing alternatives without problematic fields
    console.log('1. Checking existing alternatives (basic fields)...');
    const alternatives = await makeGraphQLRequest(`
      query {
        alternatives {
          id
          proprietaryTool {
            id
            name
            slug
          }
          openSourceTool {
            id
            name  
            slug
          }
          similarityScore
        }
      }
    `);
    
    console.log(`Found ${alternatives.alternatives.length} existing alternatives`);
    if (alternatives.alternatives.length > 0) {
      console.log('Example alternative:', JSON.stringify(alternatives.alternatives[0], null, 2));
    }

    // Check the schema for Alternative type
    console.log('\n2. Introspecting Alternative type...');
    const alternativeType = await makeGraphQLRequest(`
      query {
        __type(name: "Alternative") {
          fields {
            name
            type {
              name
              kind
              ofType {
                name
              }
            }
          }
        }
      }
    `);

    if (alternativeType.__type) {
      console.log('Alternative type fields:');
      alternativeType.__type.fields.forEach((field: any) => {
        const typeName = field.type.name || field.type.ofType?.name || field.type.kind;
        console.log(`  - ${field.name}: ${typeName}`);
      });
    }

    // Check AlternativeCreateInput
    console.log('\n3. Introspecting AlternativeCreateInput...');
    const createInput = await makeGraphQLRequest(`
      query {
        __type(name: "AlternativeCreateInput") {
          inputFields {
            name
            type {
              name
              kind
              ofType {
                name
              }
            }
          }
        }
      }
    `);

    if (createInput.__type) {
      console.log('AlternativeCreateInput fields:');
      createInput.__type.inputFields.forEach((field: any) => {
        const typeName = field.type.name || field.type.ofType?.name || field.type.kind;
        console.log(`  - ${field.name}: ${typeName}`);
      });
    }

    // Test simple alternative creation
    console.log('\n4. Testing simple alternative creation...');
    
    const chatgpt = await makeGraphQLRequest(`
      query {
        tools(where: { slug: { equals: "chatgpt" } }) {
          id
          name
        }
      }
    `);

    const llama = await makeGraphQLRequest(`
      query {
        tools(where: { slug: { equals: "llama" } }) {
          id
          name
        }
      }
    `);

    if (chatgpt.tools.length > 0 && llama.tools.length > 0) {
      console.log(`Found ChatGPT: ${chatgpt.tools[0].name} (${chatgpt.tools[0].id})`);
      console.log(`Found LLaMA: ${llama.tools[0].name} (${llama.tools[0].id})`);

      // Check if this alternative already exists
      const existingAlt = await makeGraphQLRequest(`
        query {
          alternatives(where: {
            AND: [
              { proprietaryTool: { id: { equals: "${chatgpt.tools[0].id}" } } }
              { openSourceTool: { id: { equals: "${llama.tools[0].id}" } } }
            ]
          }) {
            id
          }
        }
      `);

      if (existingAlt.alternatives.length === 0) {
        try {
          const result = await makeGraphQLRequest(`
            mutation {
              createAlternative(data: {
                proprietaryTool: { connect: { id: "${chatgpt.tools[0].id}" } }
                openSourceTool: { connect: { id: "${llama.tools[0].id}" } }
                similarityScore: 85
              }) {
                id
                proprietaryTool { name }
                openSourceTool { name }
                similarityScore
              }
            }
          `);
          console.log('✅ Test alternative created:', result.createAlternative);
        } catch (error) {
          console.log('❌ Test alternative creation failed:', error);
        }
      } else {
        console.log('ℹ️  Alternative already exists between these tools');
      }
    }

  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

// Run the check
checkSchema();