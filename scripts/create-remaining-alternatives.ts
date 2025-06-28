#!/usr/bin/env npx tsx

/**
 * Script to create remaining Cursor alternatives with correct format
 */

import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION || 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc74bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'}`
  }
});

const alternativesToCreate = [
  { toolSlug: "cline", toolId: "cmcfpei81003hsbaujhxwdvwt" },
  { toolSlug: "kilo-code", toolId: "cmcfpeits003isbau9j1n4ds9" },
  { toolSlug: "plandex", toolId: "cmcfpejfo003jsbau027pjdpr" },
  { toolSlug: "gemini-cli", toolId: "cmcfpek1g003ksbaut07ap1lx" }
];

const cursorId = "cmcfp3jni000wsbauk6uy1w59";

async function createAlternative(openSourceToolId: string, toolName: string) {
  const mutation = `
    mutation {
      createAlternative(data: {
        proprietaryTool: { connect: { id: "${cursorId}" } }
        openSourceTool: { connect: { id: "${openSourceToolId}" } }
        similarityScore: "0.85"
      }) {
        id
        proprietaryTool { name }
        openSourceTool { name }
      }
    }
  `;
  
  return await client.request(mutation);
}

async function main() {
  console.log('Creating remaining Cursor alternatives...');
  
  for (const alt of alternativesToCreate) {
    try {
      console.log(`Creating alternative for ${alt.toolSlug}...`);
      const result = await createAlternative(alt.toolId, alt.toolSlug);
      console.log(`✅ Created: ${result.createAlternative.proprietaryTool.name} ↔ ${result.createAlternative.openSourceTool.name}`);
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`❌ Failed to create alternative for ${alt.toolSlug}:`, error);
    }
  }
  
  console.log('\n🎉 All alternatives created!');
}

main();