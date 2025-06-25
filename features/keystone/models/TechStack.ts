import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { relationship, select, text } from '@keystone-6/core/fields'

import { isSignedIn, permissions } from '../access'

export const TechStack = list({
  access: {
    operation: {
      query: () => true, // Allow public read access
      create: permissions.canManageTechStacks,
      update: permissions.canManageTechStacks,
      delete: permissions.canManageTechStacks,
    },
  },
  ui: {
    hideCreate: args => !permissions.canManageTechStacks(args),
    hideDelete: args => !permissions.canManageTechStacks(args),
    listView: {
      initialColumns: ['name', 'type', 'color'],
    },
    itemView: {
      defaultFieldMode: args => (permissions.canManageTechStacks(args) ? 'edit' : 'read'),
    },
  },
  fields: {
    name: text({
      validation: {
        isRequired: true,
        length: { max: 100 },
      },
    }),
    type: select({
      options: [
        { label: 'Programming Language', value: 'language' },
        { label: 'Framework', value: 'framework' },
        { label: 'Library', value: 'library' },
        { label: 'Database', value: 'database' },
        { label: 'Cloud Service', value: 'cloud' },
        { label: 'DevOps Tool', value: 'devops' },
        { label: 'Container', value: 'container' },
        { label: 'Runtime', value: 'runtime' },
        { label: 'Build Tool', value: 'build' },
        { label: 'Other', value: 'other' },
      ],
    }),
    color: text({
      validation: {
        length: { max: 7 },
      },
    }),
    iconUrl: text({
      label: 'Icon URL',
      validation: {
        length: { max: 500 },
      },
    }),
    tools: relationship({
      ref: 'ToolTechStack.techStack',
      many: true,
    }),
  },
});