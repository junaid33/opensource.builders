import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { decimal, relationship, select, text, timestamp } from '@keystone-6/core/fields'

import { isSignedIn, permissions } from '../access'

export const Alternative = list({
  access: {
    operation: {
      query: () => true, // Allow public read access
      create: permissions.canManageAlternatives,
      update: permissions.canManageAlternatives,
      delete: permissions.canManageAlternatives,
    },
  },
  ui: {
    hideCreate: args => !permissions.canManageAlternatives(args),
    hideDelete: args => !permissions.canManageAlternatives(args),
    listView: {
      initialColumns: ['proprietaryTool', 'openSourceTool', 'similarityScore', 'matchType', 'createdAt'],
    },
    itemView: {
      defaultFieldMode: args => (permissions.canManageAlternatives(args) ? 'edit' : 'read'),
    },
  },
  fields: {
    proprietaryTool: relationship({
      ref: 'Tool.proprietaryAlternatives',
      label: 'Proprietary Tool',
      ui: {
        displayMode: 'select',
      },
    }),
    openSourceTool: relationship({
      ref: 'Tool.openSourceAlternatives',
      label: 'Open Source Tool',
      ui: {
        displayMode: 'select',
      },
    }),
    similarityScore: decimal({
      label: 'Similarity Score',
      precision: 3,
      scale: 2,
      validation: {
        min: '0.00',
        max: '1.00',
      },
    }),
    matchType: select({
      label: 'Match Type',
      options: [
        { label: 'Direct', value: 'direct' },
        { label: 'Partial', value: 'partial' },
        { label: 'Alternative', value: 'alternative' },
        { label: 'Complementary', value: 'complementary' },
      ],
    }),
    comparisonNotes: text({
      label: 'Comparison Notes',
      ui: {
        displayMode: 'textarea',
      },
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
});