import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { relationship, select, text, timestamp } from '@keystone-6/core/fields'

import { isSignedIn, permissions } from '../access'

export const Feature = list({
  access: {
    operation: {
      query: () => true, // Allow public read access
      create: permissions.canManageFeatures,
      update: permissions.canManageFeatures,
      delete: permissions.canManageFeatures,
    },
  },
  ui: {
    hideCreate: args => !permissions.canManageFeatures(args),
    hideDelete: args => !permissions.canManageFeatures(args),
    listView: {
      initialColumns: ['name', 'slug', 'category', 'featureType', 'createdAt'],
    },
    itemView: {
      defaultFieldMode: args => (permissions.canManageFeatures(args) ? 'edit' : 'read'),
    },
  },
  fields: {
    name: text({
      validation: {
        isRequired: true,
        length: { max: 100 },
      },
    }),
    slug: text({
      validation: {
        isRequired: true,
        length: { max: 100 },
      },
      isIndexed: 'unique',
    }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    category: relationship({
      ref: 'Category.features',
      ui: {
        displayMode: 'select',
      },
    }),
    featureType: select({
      label: 'Feature Type',
      options: [
        { label: 'Core', value: 'core' },
        { label: 'Integration', value: 'integration' },
        { label: 'UI/UX', value: 'ui_ux' },
        { label: 'API', value: 'api' },
        { label: 'Security', value: 'security' },
        { label: 'Performance', value: 'performance' },
        { label: 'Analytics', value: 'analytics' },
        { label: 'Collaboration', value: 'collaboration' },
        { label: 'Deployment', value: 'deployment' },
        { label: 'Customization', value: 'customization' },
      ],
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
    tools: relationship({
      ref: 'ToolFeature.feature',
      many: true,
    }),
  },
});