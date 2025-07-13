// Simple script to check current tool simpleIconColor values
const { GraphQLClient, gql } = require('graphql-request');

const client = new GraphQLClient('http://localhost:3000/api/graphql');

const query = gql`
  query GetToolsWithColors {
    tools(take: 20) {
      id
      name
      slug
      simpleIconSlug
      simpleIconColor
      isOpenSource
    }
  }
`;

async function checkToolColors() {
  try {
    const data = await client.request(query);
    
    console.log('Current tool data and simpleIconColor values:');
    console.log('='.repeat(60));
    
    data.tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} (${tool.slug})`);
      console.log(`   Icon Slug: ${tool.simpleIconSlug || 'NULL'}`);
      console.log(`   Icon Color: ${tool.simpleIconColor || 'NULL'}`);
      console.log(`   Open Source: ${tool.isOpenSource}`);
      console.log('');
    });
    
    // Summary
    const totalTools = data.tools.length;
    const toolsWithColors = data.tools.filter(tool => tool.simpleIconColor && tool.simpleIconColor.trim() !== '').length;
    const toolsWithSlugs = data.tools.filter(tool => tool.simpleIconSlug && tool.simpleIconSlug.trim() !== '').length;
    
    console.log('SUMMARY:');
    console.log(`Total tools checked: ${totalTools}`);
    console.log(`Tools with simpleIconColor: ${toolsWithColors} (${Math.round(toolsWithColors/totalTools*100)}%)`);
    console.log(`Tools with simpleIconSlug: ${toolsWithSlugs} (${Math.round(toolsWithSlugs/totalTools*100)}%)`);
    
  } catch (error) {
    console.error('Error querying tools:', error.message);
    if (error.response) {
      console.error('GraphQL errors:', error.response.errors);
    }
  }
}

checkToolColors();