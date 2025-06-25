import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { checkbox, relationship } from '@keystone-6/core/fields'

import { isSignedIn, permissions } from '../access'

export const ToolTechStack = list({
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
      initialColumns: ['tool', 'techStack', 'isPrimary'],
    },
    itemView: {
      defaultFieldMode: args => (permissions.canManageTools(args) ? 'edit' : 'read'),
    },
  },
  fields: {
    tool: relationship({
      ref: 'Tool.techStacks',
      ui: {
        displayMode: 'select',
      },
    }),
    techStack: relationship({
      ref: 'TechStack.tools',
      ui: {
        displayMode: 'select',
      },
    }),
    isPrimary: checkbox({
      label: 'Is Primary',
      defaultValue: false,
    }),
  },
});