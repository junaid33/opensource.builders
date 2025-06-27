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

async function removeDuplicates() {
  try {
    console.log('🔧 Removing duplicate tools and categories...\n');

    // Remove duplicate Saleor tool (keep the original, remove the newer one)
    console.log('1. Removing duplicate Saleor tool...');
    const deleteSaleorMutation = `
      mutation DeleteTool($where: ToolWhereUniqueInput!) {
        deleteTool(where: $where) {
          id
          name
        }
      }
    `;

    // Remove the newer Saleor with slug "saleor-ecommerce"
    const saleorResult = await queryGraphQL(deleteSaleorMutation, {
      where: { id: "cmcc82cxi000ysbad9p1frena" }
    });
    console.log(`   ✅ Deleted duplicate Saleor: ${saleorResult.data.deleteTool.name}`);

    // Remove duplicate category (keep the original, remove the newer one)
    console.log('\n2. Removing duplicate "Notes & Knowledge Management" category...');
    const deleteCategoryMutation = `
      mutation DeleteCategory($where: CategoryWhereUniqueInput!) {
        deleteCategory(where: $where) {
          id
          name
        }
      }
    `;

    // Remove the newer category with slug "notes-knowledge-management"
    const categoryResult = await queryGraphQL(deleteCategoryMutation, {
      where: { id: "cmc0wl2uc0000enh4pojl46fw" }
    });
    console.log(`   ✅ Deleted duplicate category: ${categoryResult.data.deleteCategory.name}`);

    console.log('\n✅ Duplicates removed successfully!');

    // Verify no more duplicates exist
    console.log('\n🔍 Verifying duplicates are gone...');
    
    const verifyQuery = `
      query {
        tools(where: { name: { equals: "Saleor" } }) {
          id
          name
          slug
        }
        categories(where: { name: { equals: "Notes & Knowledge Management" } }) {
          id
          name
          slug
        }
      }
    `;

    const verifyResult = await queryGraphQL(verifyQuery);
    
    console.log(`\nSaleor tools remaining: ${verifyResult.data.tools.length}`);
    verifyResult.data.tools.forEach((tool: any) => {
      console.log(`   - ${tool.name} (${tool.slug})`);
    });

    console.log(`\n"Notes & Knowledge Management" categories remaining: ${verifyResult.data.categories.length}`);
    verifyResult.data.categories.forEach((category: any) => {
      console.log(`   - ${category.name} (${category.slug})`);
    });

  } catch (error) {
    console.error('❌ Error removing duplicates:', error);
  }
}

async function main() {
  await removeDuplicates();
}

main();