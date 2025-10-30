import { list } from '@keystone-6/core'
import { relationship, timestamp, checkbox } from '@keystone-6/core/fields'

import { permissions } from '../access'

export const ProprietaryCapability = list({
  access: {
    operation: {
      query: () => true, // Allow public read access
      create: permissions.canManageCapabilities,
      update: permissions.canManageCapabilities,
      delete: permissions.canManageCapabilities,
    },
  },
  ui: {
    hideCreate: args => !permissions.canManageCapabilities(args),
    hideDelete: args => !permissions.canManageCapabilities(args),
    listView: {
      initialColumns: ['proprietaryApplication', 'capability', 'isActive', 'createdAt'],
    },
    itemView: {
      defaultFieldMode: args => (permissions.canManageCapabilities(args) ? 'edit' : 'read'),
    },
  },
  fields: {
    proprietaryApplication: relationship({
      ref: 'ProprietaryApplication.capabilities',
      ui: {
        displayMode: 'select',
      },
    }),
    capability: relationship({
      ref: 'Capability.proprietaryApplications',
      ui: {
        displayMode: 'select',
      },
    }),
    
    // Simple tracking - does this proprietary app have this capability?
    isActive: checkbox({
      defaultValue: true,
      ui: {
        description: 'Does this proprietary application currently have this capability?'
      }
    }),
    
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
});