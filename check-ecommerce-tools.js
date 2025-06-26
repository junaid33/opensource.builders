#!/usr/bin/env node

/**
 * Script to check if e-commerce platforms exist in the database
 */

const { GraphQLClient } = require('graphql-request');

const ECOMMERCE_PLATFORMS = [
  'PrestaShop',
  'Bagisto', 
  'Medusa',
  'Saleor',
  'Sylius',
  'Vue Storefront',
  'WooCommerce',
  'Shopify'
];

const GET_ALL_TOOLS_QUERY = `
  query GetAllTools {
    tools {
      id
      name
      slug
      description
      websiteUrl
      repositoryUrl
      isOpenSource
      proprietaryAlternatives {
        id
        proprietaryTool {
          id
          name
          slug
          websiteUrl
        }
        similarityScore
        matchType
        comparisonNotes
      }
      openSourceAlternatives {
        id
        openSourceTool {
          id
          name
          slug
          websiteUrl
        }
        similarityScore
        matchType
        comparisonNotes
      }
    }
  }
`;

async function checkEcommerceTools() {
  try {
    console.log('🔍 Checking database for e-commerce platforms...\n');
    
    // Create GraphQL client pointing to local development server
    const client = new GraphQLClient('http://localhost:3000/api/graphql', {
      credentials: 'include',
    });

    // Execute the query
    const data = await client.request(GET_ALL_TOOLS_QUERY);
    
    console.log(`📊 Total tools in database: ${data.tools.length}\n`);
    
    // Check for each e-commerce platform
    const foundPlatforms = [];
    const missingPlatforms = [];
    
    for (const platformName of ECOMMERCE_PLATFORMS) {
      const tool = data.tools.find(t => 
        t.name.toLowerCase().includes(platformName.toLowerCase()) ||
        t.slug.toLowerCase().includes(platformName.toLowerCase())
      );
      
      if (tool) {
        foundPlatforms.push({
          name: tool.name,
          slug: tool.slug,
          description: tool.description,
          websiteUrl: tool.websiteUrl,
          repositoryUrl: tool.repositoryUrl,
          isOpenSource: tool.isOpenSource,
          proprietaryAlternatives: tool.proprietaryAlternatives,
          openSourceAlternatives: tool.openSourceAlternatives
        });
      } else {
        missingPlatforms.push(platformName);
      }
    }
    
    // Report findings
    console.log('✅ FOUND E-COMMERCE PLATFORMS:');
    console.log('='.repeat(50));
    
    if (foundPlatforms.length === 0) {
      console.log('❌ No e-commerce platforms found in database');
    } else {
      foundPlatforms.forEach((platform, index) => {
        console.log(`${index + 1}. ${platform.name}`);
        console.log(`   Slug: ${platform.slug}`);
        console.log(`   Description: ${platform.description || 'No description'}`);
        console.log(`   Website: ${platform.websiteUrl || 'No website'}`);
        console.log(`   Repository: ${platform.repositoryUrl || 'No repository'}`);
        console.log(`   Is Open Source: ${platform.isOpenSource ? 'Yes' : 'No'}`);
        
        const totalAlternatives = (platform.proprietaryAlternatives?.length || 0) + (platform.openSourceAlternatives?.length || 0);
        console.log(`   Alternatives: ${totalAlternatives} relationships`);
        
        if (platform.proprietaryAlternatives?.length > 0) {
          platform.proprietaryAlternatives.forEach(alt => {
            if (alt.proprietaryTool) {
              console.log(`     → vs ${alt.proprietaryTool.name} (proprietary, score: ${alt.similarityScore || 'N/A'})`);
            }
          });
        }
        
        if (platform.openSourceAlternatives?.length > 0) {
          platform.openSourceAlternatives.forEach(alt => {
            if (alt.openSourceTool) {
              console.log(`     → vs ${alt.openSourceTool.name} (open source, score: ${alt.similarityScore || 'N/A'})`);
            }
          });
        }
        console.log('');
      });
    }
    
    console.log('\n❌ MISSING E-COMMERCE PLATFORMS:');
    console.log('='.repeat(50));
    
    if (missingPlatforms.length === 0) {
      console.log('🎉 All e-commerce platforms found!');
    } else {
      missingPlatforms.forEach((platform, index) => {
        console.log(`${index + 1}. ${platform}`);
      });
      console.log(`\n⚠️  ${missingPlatforms.length} platforms need to be added to the database`);
    }
    
    // Additional analysis
    console.log('\n📈 ADDITIONAL ANALYSIS:');
    console.log('='.repeat(50));
    
    // Look for any tools that might be e-commerce related
    const ecommerceKeywords = ['shop', 'commerce', 'cart', 'store', 'marketplace', 'payment', 'checkout'];
    const possibleEcommerceTools = data.tools.filter(tool => {
      const searchText = `${tool.name} ${tool.description || ''}`.toLowerCase();
      return ecommerceKeywords.some(keyword => searchText.includes(keyword));
    });
    
    console.log(`Found ${possibleEcommerceTools.length} tools with e-commerce keywords:`);
    possibleEcommerceTools.forEach(tool => {
      console.log(`- ${tool.name} (${tool.slug})`);
    });
    
  } catch (error) {
    console.error('❌ Error querying database:', error.message);
    
    if (error.response?.errors) {
      console.error('GraphQL Errors:');
      error.response.errors.forEach(err => {
        console.error(`- ${err.message}`);
      });
    }
    
    console.log('\n💡 Make sure the development server is running with: npm run dev');
  }
}

// Run the check
checkEcommerceTools();