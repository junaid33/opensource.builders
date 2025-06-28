#!/usr/bin/env tsx

import { GraphQLClient } from 'graphql-request';

const KEYSTONE_SESSION = 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    'authorization': `Bearer ${KEYSTONE_SESSION}`,
    'cookie': `keystonejs-session=${KEYSTONE_SESSION}`
  }
});

// Icon updates from deepresearch.md - these are the SQL UPDATE statements converted to GraphQL
const iconUpdates = [
  // High Priority Icons (Popular Tools)
  { slug: 'github', simpleIconSlug: 'github', simpleIconColor: '#181717' },
  { slug: 'gitlab', simpleIconSlug: 'gitlab', simpleIconColor: '#FC6D26' },
  { slug: 'vscode', simpleIconSlug: 'visualstudiocode', simpleIconColor: '#007ACC' },
  { slug: 'slack', simpleIconSlug: 'slack', simpleIconColor: '#4A154B' },
  { slug: 'notion', simpleIconSlug: 'notion', simpleIconColor: '#000000' },
  { slug: 'zoom', simpleIconSlug: 'zoom', simpleIconColor: '#0B5CFF' },
  { slug: 'asana', simpleIconSlug: 'asana', simpleIconColor: '#F06A6A' },
  { slug: 'salesforce', simpleIconSlug: 'salesforce', simpleIconColor: '#00A1E0' },
  { slug: 'chatgpt', simpleIconSlug: 'chatgpt', simpleIconColor: '#74AA9C' },

  // Business Tools
  { slug: '1password', simpleIconSlug: '1password', simpleIconColor: '#3B66BC' },
  { slug: 'bitwarden', simpleIconSlug: 'bitwarden', simpleIconColor: '#175DDC' },
  { slug: 'mailchimp', simpleIconSlug: 'mailchimp', simpleIconColor: '#FFE01B' },
  { slug: 'hubspot', simpleIconSlug: 'hubspot', simpleIconColor: '#FF7A59' },
  { slug: 'pipedrive', simpleIconSlug: 'pipedrive', simpleIconColor: '#00AC69' },
  { slug: 'quickbooks', simpleIconSlug: 'quickbooks', simpleIconColor: '#0077C5' },
  { slug: 'confluence', simpleIconSlug: 'confluence', simpleIconColor: '#172B4D' },
  { slug: 'typeform', simpleIconSlug: 'typeform', simpleIconColor: '#262627' },
  { slug: 'tableau', simpleIconSlug: 'tableau', simpleIconColor: '#E97627' },
  { slug: 'toggl', simpleIconSlug: 'toggl', simpleIconColor: '#E57CD8' },
  { slug: 'freshbooks', simpleIconSlug: 'freshbooks', simpleIconColor: '#0E88A8' },

  // Development Tools
  { slug: 'postman', simpleIconSlug: 'postman', simpleIconColor: '#FF6C37' },
  { slug: 'flutter', simpleIconSlug: 'flutter', simpleIconColor: '#02569B' },
  { slug: 'terraform', simpleIconSlug: 'terraform', simpleIconColor: '#844FBA' },
  { slug: 'intellij-idea', simpleIconSlug: 'intellijidea', simpleIconColor: '#000000' },
  { slug: 'sublime-text', simpleIconSlug: 'sublimetext', simpleIconColor: '#FF9800' },

  // Data & Analytics
  { slug: 'grafana', simpleIconSlug: 'grafana', simpleIconColor: '#F46800' },
  { slug: 'prometheus', simpleIconSlug: 'prometheus', simpleIconColor: '#E6522C' },
  { slug: 'metabase', simpleIconSlug: 'metabase', simpleIconColor: '#509EE3' },
  { slug: 'mongodb-atlas', simpleIconSlug: 'mongodb', simpleIconColor: '#47A248' },
  { slug: 'postgresql', simpleIconSlug: 'postgresql', simpleIconColor: '#4169E1' },
  { slug: 'redis', simpleIconSlug: 'redis', simpleIconColor: '#FF4438' },

  // CMS & E-commerce
  { slug: 'shopify', simpleIconSlug: 'shopify', simpleIconColor: '#7AB55C' },
  { slug: 'wordpress-com', simpleIconSlug: 'wordpress', simpleIconColor: '#21759B' },
  { slug: 'ghost', simpleIconSlug: 'ghost', simpleIconColor: '#15171A' },
  { slug: 'strapi', simpleIconSlug: 'strapi', simpleIconColor: '#4945FF' },
];

async function applySimpleIconUpdates() {
  console.log('🎨 Applying Simple Icons updates from deepresearch.md...\n');

  let successCount = 0;
  let failureCount = 0;
  const failures: string[] = [];

  for (const iconUpdate of iconUpdates) {
    try {
      // First get the tool by slug
      const getToolQuery = `
        query GetToolBySlug($slug: String!) {
          tools(where: { slug: { equals: $slug } }) {
            id
            name
            slug
          }
        }
      `;

      const toolResult = await client.request(getToolQuery, { slug: iconUpdate.slug });
      const tool = toolResult.tools[0];

      if (!tool) {
        console.log(`❌ Tool not found: ${iconUpdate.slug}`);
        failureCount++;
        failures.push(iconUpdate.slug);
        continue;
      }

      // Update the tool with Simple Icons data
      const updateMutation = `
        mutation UpdateToolIcon($id: ID!, $data: ToolUpdateInput!) {
          updateTool(where: { id: $id }, data: $data) {
            id
            name
            slug
            simpleIconSlug
            simpleIconColor
          }
        }
      `;

      const result = await client.request(updateMutation, {
        id: tool.id,
        data: { 
          simpleIconSlug: iconUpdate.simpleIconSlug,
          simpleIconColor: iconUpdate.simpleIconColor
        }
      });

      console.log(`✅ Updated ${tool.name} (${iconUpdate.slug}) with icon: ${iconUpdate.simpleIconSlug}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to update ${iconUpdate.slug}:`, error);
      failureCount++;
      failures.push(iconUpdate.slug);
    }
  }

  console.log('\n🎉 Simple Icons updates completed!');
  console.log(`✅ Successfully updated: ${successCount} tools`);
  console.log(`❌ Failed to update: ${failureCount} tools`);
  
  if (failures.length > 0) {
    console.log('\n❌ Failed tools:');
    failures.forEach(slug => console.log(`  - ${slug}`));
  }
}

async function main() {
  await applySimpleIconUpdates();
}

main().catch(console.error);