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

async function fixTailArkName() {
  try {
    console.log('🔧 Fixing TailArc → TailArk...\n');

    // First find the TailArc tool
    const findQuery = `
      query {
        tools(where: { name: { equals: "TailArc" } }) {
          id
          name
          slug
        }
      }
    `;

    const findResult = await queryGraphQL(findQuery);
    const tailArcTool = findResult.data.tools[0];

    if (!tailArcTool) {
      console.log('❌ TailArc tool not found');
      return;
    }

    console.log(`Found TailArc tool: ID ${tailArcTool.id}`);

    // Update the name to TailArk
    const updateMutation = `
      mutation UpdateTool($where: ToolWhereUniqueInput!, $data: ToolUpdateInput!) {
        updateTool(where: $where, data: $data) {
          id
          name
          slug
        }
      }
    `;

    const updateResult = await queryGraphQL(updateMutation, {
      where: { id: tailArcTool.id },
      data: {
        name: "TailArk",
        slug: "tailark"
      }
    });

    console.log(`✅ Updated tool name: ${updateResult.data.updateTool.name}`);
    console.log(`✅ Updated tool slug: ${updateResult.data.updateTool.slug}`);

    console.log('\n✅ TailArk name fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing TailArk:', error);
  }
}

async function main() {
  await fixTailArkName();
}

main();