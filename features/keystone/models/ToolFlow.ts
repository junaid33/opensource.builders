import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { checkbox, integer, relationship, text, timestamp } from '@keystone-6/core/fields'

import { isSignedIn, permissions } from '../access'

export const ToolFlow = list({
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
      initialColumns: ['tool', 'flow', 'easeOfUseScore', 'verified', 'createdAt'],
    },
    itemView: {
      defaultFieldMode: args => (permissions.canManageFlows(args) ? 'edit' : 'read'),
    },
  },
  fields: {
    tool: relationship({
      ref: 'Tool.flows',
      ui: {
        displayMode: 'select',
      },
    }),
    flow: relationship({
      ref: 'Flow.tools',
      ui: {
        displayMode: 'select',
      },
    }),
    implementationNotes: text({
      label: 'Implementation Notes',
      ui: {
        displayMode: 'textarea',
      },
    }),
    easeOfUseScore: integer({
      label: 'Ease of Use Score',
      validation: {
        min: 1,
        max: 10,
      },
    }),
    stepsRequired: integer({
      label: 'Steps Required',
      validation: {
        min: 1,
      },
    }),
    requiresPlugins: checkbox({
      label: 'Requires Plugins',
      defaultValue: false,
    }),
    verified: checkbox({
      defaultValue: false,
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
});