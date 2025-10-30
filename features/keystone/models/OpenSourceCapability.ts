import { list } from '@keystone-6/core'
import { relationship, text, timestamp, checkbox, select } from '@keystone-6/core/fields'

import { permissions } from '../access'

export const OpenSourceCapability = list({
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
      initialColumns: ['openSourceApplication', 'capability', 'isActive', 'implementationComplexity', 'createdAt'],
    },
    itemView: {
      defaultFieldMode: args => (permissions.canManageCapabilities(args) ? 'edit' : 'read'),
    },
  },
  fields: {
    openSourceApplication: relationship({
      ref: 'OpenSourceApplication.capabilities',
      ui: {
        displayMode: 'select',
      },
    }),
    capability: relationship({
      ref: 'Capability.openSourceApplications',
      ui: {
        displayMode: 'select',
      },
    }),
    
    // Basic status
    isActive: checkbox({
      defaultValue: true,
      ui: {
        description: 'Does this open source application currently have this capability?'
      }
    }),
    
    // Rich implementation details for build page
    implementationNotes: text({
      label: 'Implementation Notes',
      ui: {
        displayMode: 'textarea',
        description: 'How this application implements this capability'
      },
    }),
    
    githubPath: text({
      label: 'GitHub Path',
      validation: {
        length: { max: 500 },
      },
      ui: {
        description: 'Relative path to code that implements this capability (e.g., "src/auth/providers/google.ts")'
      }
    }),
    
    documentationUrl: text({
      label: 'Documentation URL',
      validation: {
        length: { max: 500 },
      },
      ui: {
        description: 'Link to documentation for this specific capability'
      }
    }),
    
    implementationComplexity: select({
      label: 'Implementation Complexity',
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
      defaultValue: 'intermediate',
      ui: {
        description: 'How complex it is to implement this capability in this application'
      }
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
  },
});