import { list } from '@keystone-6/core'
import { relationship, text, timestamp } from '@keystone-6/core/fields'

import { permissions } from '../access'

export const ProprietaryApplication = list({
  access: {
    operation: {
      query: () => true, // Allow public read access
      create: permissions.canManageApplications,
      update: permissions.canManageApplications,
      delete: permissions.canManageApplications,
    },
  },
  ui: {
    hideCreate: args => !permissions.canManageApplications(args),
    hideDelete: args => !permissions.canManageApplications(args),
    listView: {
      initialColumns: ['name', 'slug', 'category', 'createdAt'],
    },
    itemView: {
      defaultFieldMode: args => (permissions.canManageApplications(args) ? 'edit' : 'read'),
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
    websiteUrl: text({
      label: 'Website URL',
      validation: {
        length: { max: 500 },
      },
    }),
    simpleIconSlug: text({
      label: 'Simple Icon Slug',
      validation: {
        length: { max: 100 },
      },
    }),
    simpleIconColor: text({
      label: 'Simple Icon Color',
      validation: {
        length: { max: 7 }, // For hex colors like #7AB55C
      },
    }),
    category: relationship({
      ref: 'Category.proprietaryApplications',
      ui: {
        displayMode: 'select',
      },
    }),
    
    // Capabilities this proprietary app has (for comparison baseline)
    capabilities: relationship({
      ref: 'ProprietaryCapability.proprietaryApplication',
      many: true,
    }),
    
    // Open source alternatives to this proprietary app
    openSourceAlternatives: relationship({
      ref: 'OpenSourceApplication.primaryAlternativeTo',
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