#!/usr/bin/env npx tsx

/**
 * Debug GraphQL schema to understand the Alternative model structure
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

async function debugSchema() {
  console.log('🔍 Debugging GraphQL schema...\n');

  try {
    // Check if alternatives exist and their structure
    console.log('1. Checking existing alternatives...');
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
          notes
        }
      }
    `);
    
    console.log(`Found ${alternatives.alternatives.length} existing alternatives`);
    if (alternatives.alternatives.length > 0) {
      console.log('Example alternative structure:', JSON.stringify(alternatives.alternatives[0], null, 2));
    }

    // Test introspection
    console.log('\n2. Checking AlternativeCreateInput schema...');
    const introspection = await makeGraphQLRequest(`
      query {
        __type(name: "AlternativeCreateInput") {
          inputFields {
            name
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    `);

    if (introspection.__type) {
      console.log('AlternativeCreateInput fields:');
      introspection.__type.inputFields.forEach((field: any) => {
        console.log(`  - ${field.name}: ${field.type.name || field.type.kind}`);
      });
    } else {
      console.log('❌ AlternativeCreateInput type not found');
    }

    // Try to find specific tools
    console.log('\n3. Testing specific tool lookup...');
    const chatgpt = await makeGraphQLRequest(`
      query {
        tools(where: { slug: { equals: "chatgpt" } }) {
          id
          name
          slug
          isOpenSource
        }
      }
    `);
    
    console.log(`ChatGPT tool:`, chatgpt.tools[0]);

    const ollama = await makeGraphQLRequest(`
      query {
        tools(where: { slug: { equals: "ollama" } }) {
          id
          name
          slug
          isOpenSource
        }
      }
    `);
    
    if (ollama.tools.length > 0) {
      console.log(`Ollama tool:`, ollama.tools[0]);
    } else {
      console.log('❌ Ollama tool not found');
    }

    // Test creating a simple alternative
    console.log('\n4. Testing alternative creation with existing tools...');
    
    if (chatgpt.tools.length > 0 && ollama.tools.length > 0) {
      try {
        const testAlternative = await makeGraphQLRequest(`
          mutation {
            createAlternative(data: {
              proprietaryTool: { connect: { id: "${chatgpt.tools[0].id}" } }
              openSourceTool: { connect: { id: "${ollama.tools[0].id}" } }
              similarityScore: 85
              notes: "Test alternative"
            }) {
              id
              proprietaryTool { name }
              openSourceTool { name }
            }
          }
        `);
        console.log('✅ Test alternative created successfully:', testAlternative);
      } catch (error) {
        console.log('❌ Test alternative creation failed:', error);
      }
    }

  } catch (error) {
    console.error('❌ Error debugging schema:', error);
  }
}

// Run the debug
debugSchema();