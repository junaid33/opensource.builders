/**
 * Seed script: Add UnfoldCMS to the database
 *
 * UnfoldCMS is a self-hosted, open-source CMS built on Laravel 12 + React 19 +
 * shadcn/ui + Tailwind v4. It belongs in the Website Builders category as a
 * free, open-source alternative to WordPress, Ghost, Contentful, and Strapi.
 *
 * Usage:
 *   KEYSTONE_SESSION=<token> tsx scripts/seed-unfoldcms.ts
 *
 * Requires a valid Keystone admin session. See CONTRIBUTING_TO_OSB.md.
 * Script is fully idempotent — safe to re-run.
 */

const API_URL = process.env.KEYSTONE_URL ?? 'https://opensource.builders/api/graphql'
const SESSION = process.env.KEYSTONE_SESSION

if (!SESSION) {
  console.error('Error: KEYSTONE_SESSION environment variable is required.')
  process.exit(1)
}

async function gql(query: string) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `keystonejs-session=${SESSION}`,
    },
    body: JSON.stringify({ query }),
  })
  const json = (await res.json()) as { data?: Record<string, unknown>; errors?: unknown[] }
  if (json.errors) {
    console.error('GraphQL errors:', JSON.stringify(json.errors, null, 2))
    throw new Error('GraphQL request failed')
  }
  return json.data!
}

// ---------------------------------------------------------------------------
// 1. Resolve or create the "Website Builders" category
// ---------------------------------------------------------------------------
async function upsertWebsiteBuilderCategory(): Promise<string> {
  const data = await gql(`
    query {
      categories(where: { slug: { equals: "website-builders" } }) {
        id name slug
      }
    }
  `)
  const cats = data.categories as { id: string; name: string; slug: string }[]
  if (cats.length > 0) {
    console.log(`✓ Found category: ${cats[0].name} (${cats[0].id})`)
    return cats[0].id
  }

  const created = await gql(`
    mutation {
      createCategory(data: {
        name: "Website Builders"
        slug: "website-builders"
        description: "Platforms for building and managing websites, blogs, and content — from classic CMSes to headless solutions."
        icon: "globe"
        color: "#2563EB"
      }) {
        id name slug
      }
    }
  `)
  const cat = created.createCategory as { id: string; name: string; slug: string }
  console.log(`✓ Created category: ${cat.name} (${cat.id})`)
  return cat.id
}

// ---------------------------------------------------------------------------
// 2. Create (or find) the proprietary app: WordPress
// ---------------------------------------------------------------------------
async function upsertWordPress(categoryId: string): Promise<string> {
  const existing = await gql(`
    query {
      proprietaryApplications(where: { slug: { equals: "wordpress" } }) {
        id name slug
      }
    }
  `)
  const list = existing.proprietaryApplications as { id: string; name: string; slug: string }[]
  if (list.length > 0) {
    console.log(`✓ Found proprietary app: ${list[0].name} (${list[0].id})`)
    return list[0].id
  }

  const data = await gql(`
    mutation {
      createProprietaryApplication(data: {
        name: "WordPress"
        slug: "wordpress"
        description: "The world\\'s most popular CMS, powering over 40% of all websites with themes, plugins, and a large ecosystem."
        websiteUrl: "https://wordpress.com"
        simpleIconSlug: "wordpress"
        simpleIconColor: "#21759B"
        category: { connect: { id: "${categoryId}" } }
      }) {
        id name slug
      }
    }
  `)
  const app = data.createProprietaryApplication as { id: string; name: string; slug: string }
  console.log(`✓ Created proprietary app: ${app.name} (${app.id})`)
  return app.id
}

// ---------------------------------------------------------------------------
// 3. Ensure capabilities exist
// ---------------------------------------------------------------------------
interface Capability {
  id: string
  name: string
  slug: string
}

interface CapabilitySpec {
  name: string
  slug: string
  description: string
  category: string
  complexity: string
}

async function upsertCapability(spec: CapabilitySpec): Promise<string> {
  const existing = await gql(`
    query {
      capabilities(where: { slug: { equals: "${spec.slug}" } }) {
        id name slug
      }
    }
  `)
  const list = existing.capabilities as Capability[]
  if (list.length > 0) {
    console.log(`  ✓ Capability exists: ${list[0].name}`)
    return list[0].id
  }

  const data = await gql(`
    mutation {
      createCapability(data: {
        name: "${spec.name}"
        slug: "${spec.slug}"
        description: "${spec.description}"
        category: ${spec.category}
        complexity: ${spec.complexity}
      }) {
        id name slug
      }
    }
  `)
  const cap = data.createCapability as Capability
  console.log(`  ✓ Created capability: ${cap.name}`)
  return cap.id
}

// ---------------------------------------------------------------------------
// 4. Link capabilities to a proprietary app (idempotent)
// ---------------------------------------------------------------------------
async function linkProprietaryCapability(proprietaryAppId: string, capabilityId: string) {
  const existing = await gql(`
    query {
      proprietaryCapabilities(where: {
        proprietaryApplication: { id: { equals: "${proprietaryAppId}" } }
        capability: { id: { equals: "${capabilityId}" } }
      }) { id }
    }
  `)
  const list = existing.proprietaryCapabilities as { id: string }[]
  if (list.length > 0) return

  await gql(`
    mutation {
      createProprietaryCapability(data: {
        proprietaryApplication: { connect: { id: "${proprietaryAppId}" } }
        capability: { connect: { id: "${capabilityId}" } }
        isActive: true
      }) { id }
    }
  `)
}

// ---------------------------------------------------------------------------
// 5. Create (or find) UnfoldCMS as an open-source application
// ---------------------------------------------------------------------------
async function upsertUnfoldCMS(wordPressId: string): Promise<string> {
  const existing = await gql(`
    query {
      openSourceApplications(where: { slug: { equals: "unfoldcms" } }) {
        id name slug
      }
    }
  `)
  const list = existing.openSourceApplications as { id: string; name: string; slug: string }[]
  if (list.length > 0) {
    console.log(`✓ UnfoldCMS already exists: ${list[0].name} (${list[0].id})`)
    return list[0].id
  }

  const data = await gql(`
    mutation {
      createOpenSourceApplication(data: {
        name: "UnfoldCMS"
        slug: "unfoldcms"
        description: "Self-hosted CMS built on Laravel 12, React 19, shadcn/ui, and Tailwind v4. Free Core tier with no monthly SaaS fee, headless REST API, and full admin panel."
        repositoryUrl: "https://github.com/hpakdaman/unfoldcms"
        websiteUrl: "https://unfoldcms.com"
        license: "MIT"
        githubStars: 0
        githubForks: 0
        githubIssues: 0
        status: active
        primaryAlternativeTo: { connect: { id: "${wordPressId}" } }
      }) {
        id name slug
      }
    }
  `)
  const app = data.createOpenSourceApplication as { id: string; name: string; slug: string }
  console.log(`✓ Created open-source app: ${app.name} (${app.id})`)
  return app.id
}

// ---------------------------------------------------------------------------
// 6. Link open-source capabilities with implementation evidence
// ---------------------------------------------------------------------------
interface OsCapabilitySpec {
  capabilityId: string
  implementationNotes: string
  githubPath: string
  documentationUrl: string
  implementationComplexity: string
}

async function linkOpenSourceCapability(appId: string, spec: OsCapabilitySpec) {
  const existing = await gql(`
    query {
      openSourceCapabilities(where: {
        openSourceApplication: { id: { equals: "${appId}" } }
        capability: { id: { equals: "${spec.capabilityId}" } }
      }) { id }
    }
  `)
  const list = existing.openSourceCapabilities as { id: string }[]
  if (list.length > 0) return

  await gql(`
    mutation {
      createOpenSourceCapability(data: {
        openSourceApplication: { connect: { id: "${appId}" } }
        capability: { connect: { id: "${spec.capabilityId}" } }
        isActive: true
        implementationNotes: "${spec.implementationNotes}"
        githubPath: "${spec.githubPath}"
        documentationUrl: "${spec.documentationUrl}"
        implementationComplexity: ${spec.implementationComplexity}
      }) { id }
    }
  `)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('=== Seeding UnfoldCMS ===\n')

  // 1. Category
  const categoryId = await upsertWebsiteBuilderCategory()

  // 2. Proprietary baseline: WordPress
  const wordPressId = await upsertWordPress(categoryId)

  // 3. Capabilities
  console.log('\nEnsuring capabilities...')
  const capabilities: CapabilitySpec[] = [
    {
      name: 'Admin Panel',
      slug: 'admin-panel',
      description: 'Web-based admin dashboard for managing content, users, settings, and plugins.',
      category: 'content-management',
      complexity: 'basic',
    },
    {
      name: 'Headless REST API',
      slug: 'headless-rest-api',
      description: 'Full REST/headless API for delivering content to any frontend or mobile app.',
      category: 'api',
      complexity: 'intermediate',
    },
    {
      name: 'Self-hosted',
      slug: 'self-hosted',
      description: 'Runs entirely on your own server — no vendor lock-in, no monthly SaaS fee.',
      category: 'deployment',
      complexity: 'basic',
    },
    {
      name: 'Blog & Content Management',
      slug: 'blog-content-management',
      description: 'Create and manage blog posts, pages, categories, tags, and media.',
      category: 'content-management',
      complexity: 'basic',
    },
    {
      name: 'Role-based Access Control',
      slug: 'role-based-access-control',
      description: 'Fine-grained user roles and permissions for managing who can do what.',
      category: 'security',
      complexity: 'intermediate',
    },
    {
      name: 'Plugin System',
      slug: 'plugin-system',
      description: 'Extensible architecture for adding new features without modifying core code.',
      category: 'extensibility',
      complexity: 'advanced',
    },
  ]

  const capIds: Record<string, string> = {}
  for (const cap of capabilities) {
    capIds[cap.slug] = await upsertCapability(cap)
  }

  // 4. Link capabilities to WordPress (proprietary baseline)
  console.log('\nLinking capabilities to WordPress...')
  for (const capId of Object.values(capIds)) {
    await linkProprietaryCapability(wordPressId, capId)
  }
  console.log('  ✓ Done')

  // 5. Create UnfoldCMS
  console.log('\nCreating UnfoldCMS...')
  const unfoldId = await upsertUnfoldCMS(wordPressId)

  // 6. Link open-source capabilities
  console.log('\nLinking capabilities to UnfoldCMS...')
  const osCapabilities: OsCapabilitySpec[] = [
    {
      capabilityId: capIds['admin-panel'],
      implementationNotes:
        'Full admin panel built with React 19 + shadcn/ui + Inertia.js. Covers posts, pages, media, users, settings, menus, and analytics — no separate front-end build step needed.',
      githubPath: 'resources/js/pages/admin/',
      documentationUrl: 'https://unfoldcms.com/docs',
      implementationComplexity: 'basic',
    },
    {
      capabilityId: capIds['headless-rest-api'],
      implementationNotes:
        'Versioned /api/v1 REST API with public read endpoints for posts, pages, categories, menus, and search. Sanctum-authenticated write endpoints for headless deployments.',
      githubPath: 'routes/api.php',
      documentationUrl: 'https://unfoldcms.com/docs',
      implementationComplexity: 'intermediate',
    },
    {
      capabilityId: capIds['self-hosted'],
      implementationNotes:
        'Standard Laravel 12 deployment — runs on any VPS, shared host, or container. No external services required for the Core tier. One-command deploy via built-in artisan commands.',
      githubPath: '',
      documentationUrl: 'https://unfoldcms.com/docs',
      implementationComplexity: 'basic',
    },
    {
      capabilityId: capIds['blog-content-management'],
      implementationNotes:
        'Rich Markdown editor with featured images, categories, tags, SEO fields, custom slugs, scheduled publishing, and revision history. Pages support flexible block sections.',
      githubPath: 'resources/js/pages/admin/posts/',
      documentationUrl: 'https://unfoldcms.com/docs',
      implementationComplexity: 'basic',
    },
    {
      capabilityId: capIds['role-based-access-control'],
      implementationNotes:
        'Spatie Laravel-permission integration with super_admin, admin, editor, and author roles. All admin routes and API endpoints enforce role checks via middleware.',
      githubPath: 'app/Http/Middleware/',
      documentationUrl: 'https://unfoldcms.com/docs',
      implementationComplexity: 'intermediate',
    },
    {
      capabilityId: capIds['plugin-system'],
      implementationNotes:
        'Module/plugin system allowing feature extensions through registered service providers. Pro tier adds premium modules (e-commerce, email activity, social auth) on top of the open Core.',
      githubPath: 'app/Providers/',
      documentationUrl: 'https://unfoldcms.com/docs',
      implementationComplexity: 'advanced',
    },
  ]

  for (const spec of osCapabilities) {
    await linkOpenSourceCapability(unfoldId, spec)
  }
  console.log('  ✓ Done')

  console.log('\n=== Seed complete ===')
  console.log('View: https://opensource.builders/alternatives/wordpress')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
