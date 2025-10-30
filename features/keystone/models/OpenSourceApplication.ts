import { list } from '@keystone-6/core'
import { relationship, text, timestamp, integer, select, virtual } from '@keystone-6/core/fields'
import { graphql } from '@keystone-6/core'

import { permissions } from '../access'

export const OpenSourceApplication = list({
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
      initialColumns: ['name', 'slug', 'primaryAlternativeTo', 'githubStars', 'status', 'createdAt'],
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
    
    // Direct connection to ONE proprietary application
    primaryAlternativeTo: relationship({
      ref: 'ProprietaryApplication.openSourceAlternatives',
      ui: {
        displayMode: 'select',
      },
    }),
    
    // Open source specific fields
    repositoryUrl: text({
      label: 'Repository URL',
      validation: {
        length: { max: 500 },
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
    license: text({
      validation: {
        length: { max: 100 },
      },
    }),
    githubStars: integer({
      label: 'GitHub Stars',
    }),
    githubForks: integer({
      label: 'GitHub Forks',
    }),
    githubIssues: integer({
      label: 'GitHub Issues',
    }),
    githubLastCommit: timestamp({
      label: 'GitHub Last Commit',
    }),
    status: select({
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Deprecated', value: 'deprecated' },
        { label: 'Beta', value: 'beta' },
      ],
      defaultValue: 'active',
    }),
    
    // Rich capabilities for build page
    capabilities: relationship({
      ref: 'OpenSourceCapability.openSourceApplication',
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