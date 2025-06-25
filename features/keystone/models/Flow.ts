import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { json, relationship, select, text, timestamp } from '@keystone-6/core/fields'

import { isSignedIn, permissions } from '../access'

export const Flow = list({
  access: {
    operation: {
      query: () => true, // Allow public read access
      create: permissions.canManageFlows,
      update: permissions.canManageFlows,
      delete: permissions.canManageFlows,
    },
  },
  ui: {
    hideCreate: args => !permissions.canManageFlows(args),
    hideDelete: args => !permissions.canManageFlows(args),
    listView: {
      initialColumns: ['name', 'slug', 'category', 'difficulty', 'userPersona', 'createdAt'],
    },
    itemView: {
      defaultFieldMode: args => (permissions.canManageFlows(args) ? 'edit' : 'read'),
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
      ref: 'Category.flows',
      ui: {
        displayMode: 'select',
      },
    }),
    steps: json(),
    userPersona: text({
      label: 'User Persona',
      validation: {
        length: { max: 100 },
      },
    }),
    difficulty: select({
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
        { label: 'Expert', value: 'expert' },
      ],
    }),
    estimatedTime: text({
      label: 'Estimated Time',
      validation: {
        length: { max: 50 },
      },
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
    tools: relationship({
      ref: 'ToolFlow.flow',
      many: true,
    }),
  },
});