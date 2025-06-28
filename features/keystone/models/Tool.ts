import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { checkbox, integer, relationship, select, text, timestamp } from '@keystone-6/core/fields'

import { permissions } from '../access'

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
    simpleIconSlug: text({
      label: 'Simple Icon Slug',
      validation: {
        length: { max: 100 },
      },
    }),
    simpleIconColor: text({
      label: 'Simple Icon Color',
      validation: {
        length: { max: 7 }, // For hex colors like #7AB55C
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
  },
});