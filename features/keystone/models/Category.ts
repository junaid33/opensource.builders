import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { relationship, text, timestamp } from '@keystone-6/core/fields'

import { isSignedIn, permissions } from '../access'

export const Category = list({
  access: {
    operation: {
      query: () => true, // Allow public read access
      create: permissions.canManageCategories,
      update: permissions.canManageCategories,
      delete: permissions.canManageCategories,
    },
  },
  ui: {
    hideCreate: args => !permissions.canManageCategories(args),
    hideDelete: args => !permissions.canManageCategories(args),
    listView: {
      initialColumns: ['name', 'slug', 'description', 'createdAt'],
    },
    itemView: {
      defaultFieldMode: args => (permissions.canManageCategories(args) ? 'edit' : 'read'),
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
    icon: text({
      validation: {
        length: { max: 100 },
      },
    }),
    color: text({
      validation: {
        length: { max: 7 },
      },
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
    tools: relationship({
      ref: 'Tool.category',
      many: true,

    }),
    features: relationship({
      ref: 'Feature.category',
      many: true,
    }),
    flows: relationship({
      ref: 'Flow.category',
      many: true,
    }),
  },
});