import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { checkbox, integer, relationship, select, text, timestamp, virtual } from '@keystone-6/core/fields'
import { graphql } from '@keystone-6/core'

import { isSignedIn, permissions } from '../access'
import { resolveToolLogo, generateLetterAvatarSvg } from '../utils/logo-resolver'

export const Tool = list({
  access: {
    operation: {
      query: () => true, // Allow public read access
      create: permissions.canManageTools,
      update: permissions.canManageTools,
      delete: permissions.canManageTools,
    },
  },
  ui: {
    hideCreate: args => !permissions.canManageTools(args),
    hideDelete: args => !permissions.canManageTools(args),
    listView: {
      initialColumns: ['name', 'slug', 'category', 'isOpenSource', 'status', 'createdAt'],
    },
    itemView: {
      defaultFieldMode: args => (permissions.canManageTools(args) ? 'edit' : 'read'),
    },
  },
  fields: {
    name: text({
      validation: {
        isRequired: true,
        length: { max: 255 },
      },
    }),
    slug: text({
      validation: {
        isRequired: true,
        length: { max: 255 },
      },
      isIndexed: 'unique',
    }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    websiteUrl: text({
      label: 'Website URL',
      validation: {
        length: { max: 500 },
      },
    }),
    repositoryUrl: text({
      label: 'Repository URL',
      validation: {
        length: { max: 500 },
      },
    }),
    logoUrl: text({
      label: 'Logo URL',
      validation: {
        length: { max: 500 },
      },
    }),
    logoSvg: text({
      label: 'Logo SVG',
      ui: {
        displayMode: 'textarea',
      },
      validation: {
        length: { max: 10000 },
      },
    }),
    isOpenSource: checkbox({
      label: 'Is Open Source',
      defaultValue: false,
    }),
    category: relationship({
      ref: 'Category.tools',
      ui: {
        displayMode: 'select',
      },
    }),
    license: text({
      validation: {
        length: { max: 100 },
      },
    }),
    githubStars: integer({
      label: 'GitHub Stars',
    }),
    status: select({
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Deprecated', value: 'deprecated' },
        { label: 'Beta', value: 'beta' },
      ],
      defaultValue: 'active',
    }),
    pricingModel: select({
      label: 'Pricing Model',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Freemium', value: 'freemium' },
        { label: 'Paid', value: 'paid' },
        { label: 'One-time', value: 'one_time' },
        { label: 'Subscription', value: 'subscription' },
        { label: 'Usage-based', value: 'usage_based' },
      ],
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
    updatedAt: timestamp({
      defaultValue: { kind: 'now' },
      db: {
        updatedAt: true,
      },
    }),
    features: relationship({
      ref: 'ToolFeature.tool',
      many: true,
    }),
    proprietaryAlternatives: relationship({
      ref: 'Alternative.proprietaryTool',
      many: true,
    }),
    openSourceAlternatives: relationship({
      ref: 'Alternative.openSourceTool',
      many: true,
    }),
    deploymentOptions: relationship({
      ref: 'DeploymentOption.tool',
      many: true,
    }),
    techStacks: relationship({
      ref: 'ToolTechStack.tool',
      many: true,
    }),
    // Virtual field that provides intelligent logo resolution
    resolvedLogo: virtual({
      field: graphql.field({
        type: graphql.JSON,
        async resolve(item: any) {
          try {
            const result = await resolveToolLogo({
              name: item.name,
              logoSvg: item.logoSvg,
              logoUrl: item.logoUrl,
              websiteUrl: item.websiteUrl,
            })

            // If it's a letter type, generate the SVG
            if (result.type === 'letter') {
              return {
                ...result,
                svg: generateLetterAvatarSvg(result.data),
              }
            }

            return result
          } catch (error) {
            console.error(`Error resolving logo for ${item.name}:`, error)
            // Fallback to letter avatar
            const firstLetter = item.name ? item.name.charAt(0).toUpperCase() : '?'
            return {
              type: 'letter',
              data: firstLetter,
              svg: generateLetterAvatarSvg(firstLetter),
              verified: false
            }
          }
        },
      }),
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'hidden' },
      },
    }),
  },
});