import { list } from '@keystone-6/core'
import { relationship, text, timestamp, select } from '@keystone-6/core/fields'

import { permissions } from '../access'

export const Capability = list({
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
      initialColumns: ['name', 'slug', 'category', 'complexity', 'createdAt'],
    },
    itemView: {
      defaultFieldMode: args => (permissions.canManageCapabilities(args) ? 'edit' : 'read'),
    },
  },
  fields: {
    name: text({
      validation: {
        isRequired: true,
        length: { max: 255 },
      },
    }),
    slug: text({
      validation: {
        isRequired: true,
        length: { max: 255 },
      },
      isIndexed: 'unique',
    }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    
    // Categorization for build page
    category: select({
      label: 'Capability Category',
      options: [
        { label: 'Authentication', value: 'authentication' },
        { label: 'Payment', value: 'payment' },
        { label: 'Storage', value: 'storage' },
        { label: 'Communication', value: 'communication' },
        { label: 'Analytics', value: 'analytics' },
        { label: 'UI Components', value: 'ui_components' },
        { label: 'Database', value: 'database' },
        { label: 'Email', value: 'email' },
        { label: 'Search', value: 'search' },
        { label: 'Media', value: 'media' },
        { label: 'Security', value: 'security' },
        { label: 'Deployment', value: 'deployment' },
        { label: 'Monitoring', value: 'monitoring' },
        { label: 'Testing', value: 'testing' },
        { label: 'Other', value: 'other' },
      ],
    }),
    
    // Overall implementation complexity
    complexity: select({
      label: 'Implementation Complexity',
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
      defaultValue: 'intermediate',
    }),
    
    // Relationships to applications
    proprietaryApplications: relationship({
      ref: 'ProprietaryCapability.capability',
      many: true,
    }),
    
    openSourceApplications: relationship({
      ref: 'OpenSourceCapability.capability',
      many: true,
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