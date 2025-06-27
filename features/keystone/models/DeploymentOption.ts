import { list } from '@keystone-6/core'
import { relationship, text, timestamp } from '@keystone-6/core/fields'

import { permissions } from '../access'

export const DeploymentOption = list({
  access: {
    operation: {
      query: () => true, // Allow public read access
      create: permissions.canManageDeploymentOptions,
      update: permissions.canManageDeploymentOptions,
      delete: permissions.canManageDeploymentOptions,
    },
  },
  ui: {
    hideCreate: args => !permissions.canManageDeploymentOptions(args),
    hideDelete: args => !permissions.canManageDeploymentOptions(args),
    listView: {
      initialColumns: ['tool', 'platform', 'createdAt'],
    },
    itemView: {
      defaultFieldMode: args => (permissions.canManageDeploymentOptions(args) ? 'edit' : 'read'),
    },
  },
  fields: {
    tool: relationship({
      ref: 'Tool.deploymentOptions',
      ui: {
        displayMode: 'select',
      },
    }),
    platform: text({
      validation: {
        isRequired: true,
        length: { max: 100 },
      },
      ui: {
        description: 'Platform name (e.g., Vercel, Railway, Render)',
      },
    }),
    deployUrl: text({
      label: 'Deploy URL',
      validation: {
        length: { max: 500 },
      },
      ui: {
        description: 'One-click deploy URL',
      },
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
});