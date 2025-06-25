import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { checkbox, integer, relationship, text, timestamp } from '@keystone-6/core/fields'

import { isSignedIn, permissions } from '../access'

export const ToolFeature = list({
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
      initialColumns: ['tool', 'feature', 'qualityScore', 'verified', 'createdAt'],
    },
    itemView: {
      defaultFieldMode: args => (permissions.canManageTools(args) ? 'edit' : 'read'),
    },
  },
  fields: {
    tool: relationship({
      ref: 'Tool.features',
      ui: {
        displayMode: 'select',
      },
    }),
    feature: relationship({
      ref: 'Feature.tools',
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
    qualityScore: integer({
      label: 'Quality Score',
      validation: {
        min: 1,
        max: 10,
      },
    }),
    verified: checkbox({
      defaultValue: false,
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
});