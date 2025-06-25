import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { checkbox, json, relationship, select, text, timestamp } from '@keystone-6/core/fields'

import { isSignedIn, permissions } from '../access'

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
      initialColumns: ['tool', 'platform', 'difficulty', 'isVerified', 'createdAt'],
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
    }),
    deployUrl: text({
      label: 'Deploy URL',
      validation: {
        length: { max: 500 },
      },
    }),
    templateUrl: text({
      label: 'Template URL',
      validation: {
        length: { max: 500 },
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
    requirements: json(),
    isVerified: checkbox({
      label: 'Is Verified',
      defaultValue: false,
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
});