/**
 * Seed script: Add Pharos (pharos.watch) to the database
 *
 * Pharos is an open-source stablecoin analytics dashboard tracking
 * 390+ stablecoins. It belongs in the Analytics category as an
 * open-source alternative to proprietary crypto-analytics platforms
 * like Dune Analytics and Nansen.
 *
 * Usage:
 *   KEYSTONE_SESSION=<token> tsx scripts/seed-pharos.ts
 *
 * Requires a valid Keystone admin session. See CONTRIBUTING_TO_OSB.md.
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
// 1. Resolve the Analytics category
// ---------------------------------------------------------------------------
async function getAnalyticsCategoryId(): Promise<string> {
  const data = await gql(`
    query {
      categories(where: { slug: { equals: "analytics" } }) {
        id name slug
      }
    }
  `)
  const cats = data.categories as { id: string; name: string; slug: string }[]
  if (cats.length > 0) {
    console.log(`✓ Found category: ${cats[0].name} (${cats[0].id})`)
    return cats[0].id
  }
  throw new Error('Analytics category not found. Has the DB been seeded?')
}

// ---------------------------------------------------------------------------
// 2. Create (or find) the proprietary app: Dune Analytics
// ---------------------------------------------------------------------------
async function upsertDuneAnalytics(categoryId: string): Promise<string> {
  const existing = await gql(`
    query {
      proprietaryApplications(where: { slug: { equals: "dune-analytics" } }) {
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
        name: "Dune Analytics"
        slug: "dune-analytics"
        description: "Blockchain analytics platform for querying on-chain data with SQL and building shareable dashboards."
        websiteUrl: "https://dune.com"
        simpleIconSlug: "dune"
        simpleIconColor: "#FF7344"
        category: { connect: { id: "${categoryId}" } }
      }) {
        id name slug
      }
    }
  `)
  const app = (data.createProprietaryApplication as { id: string; name: string; slug: string })
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
  const cap = (data.createCapability as Capability)
  console.log(`  ✓ Created capability: ${cap.name}`)
  return cap.id
}

// ---------------------------------------------------------------------------
// 4. Link capabilities to a proprietary app (idempotent: skip if linked)
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
// 5. Create (or find) Pharos as an open-source application
// ---------------------------------------------------------------------------
async function upsertPharos(proprietaryAppId: string): Promise<string> {
  const existing = await gql(`
    query {
      openSourceApplications(where: { slug: { equals: "pharos-watch" } }) {
        id name slug
      }
    }
  `)
  const list = existing.openSourceApplications as { id: string; name: string; slug: string }[]
  if (list.length > 0) {
    console.log(`✓ Pharos already exists: ${list[0].name} (${list[0].id})`)
    return list[0].id
  }

  const data = await gql(`
    mutation {
      createOpenSourceApplication(data: {
        name: "Pharos"
        slug: "pharos-watch"
        description: "Open-source stablecoin analytics dashboard tracking 390+ stablecoins with peg health scores, supply history, liquidity metrics, and reserve data."
        repositoryUrl: "https://github.com/TokenBrice/pharos-watch"
        websiteUrl: "https://pharos.watch"
        license: "MIT"
        githubStars: 0
        githubForks: 0
        githubIssues: 0
        status: active
        primaryAlternativeTo: { connect: { id: "${proprietaryAppId}" } }
      }) {
        id name slug
      }
    }
  `)
  const app = (data.createOpenSourceApplication as { id: string; name: string; slug: string })
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

async function linkOpenSourceCapability(pharosId: string, spec: OsCapabilitySpec) {
  const existing = await gql(`
    query {
      openSourceCapabilities(where: {
        openSourceApplication: { id: { equals: "${pharosId}" } }
        capability: { id: { equals: "${spec.capabilityId}" } }
      }) { id }
    }
  `)
  const list = existing.openSourceCapabilities as { id: string }[]
  if (list.length > 0) return

  await gql(`
    mutation {
      createOpenSourceCapability(data: {
        openSourceApplication: { connect: { id: "${pharosId}" } }
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
  console.log('=== Seeding Pharos (pharos.watch) ===\n')

  // 1. Category
  const categoryId = await getAnalyticsCategoryId()

  // 2. Proprietary baseline
  const duneId = await upsertDuneAnalytics(categoryId)

  // 3. Capabilities
  console.log('\nEnsuring capabilities...')
  const capabilities = [
    {
      name: 'Real-time Analytics Dashboard',
      slug: 'realtime-analytics-dashboard',
      description: 'Live dashboards showing current metrics, prices, and health scores updated in real time.',
      category: 'analytics',
      complexity: 'intermediate',
    },
    {
      name: 'Historical Supply Charts',
      slug: 'historical-supply-charts',
      description: 'Time-series charts tracking circulating supply and market cap over configurable date ranges.',
      category: 'analytics',
      complexity: 'intermediate',
    },
    {
      name: 'Peg Health Monitoring',
      slug: 'peg-health-monitoring',
      description: 'Automated scoring and alerting for stablecoin peg deviations and depeg events.',
      category: 'monitoring',
      complexity: 'advanced',
    },
    {
      name: 'Reserve Transparency',
      slug: 'reserve-transparency',
      description: 'Breakdown of collateral and reserve composition backing each tracked asset.',
      category: 'analytics',
      complexity: 'intermediate',
    },
    {
      name: 'Self-hostable',
      slug: 'self-hostable',
      description: 'Can be deployed independently without relying on a third-party cloud service.',
      category: 'deployment',
      complexity: 'basic',
    },
  ] as CapabilitySpec[]

  const capIds: Record<string, string> = {}
  for (const cap of capabilities) {
    capIds[cap.slug] = await upsertCapability(cap)
  }

  // 4. Link capabilities to Dune (proprietary baseline)
  console.log('\nLinking capabilities to Dune Analytics...')
  for (const capId of Object.values(capIds)) {
    await linkProprietaryCapability(duneId, capId)
  }
  console.log('  ✓ Done')

  // 5. Create Pharos
  console.log('\nCreating Pharos...')
  const pharosId = await upsertPharos(duneId)

  // 6. Link open-source capabilities
  console.log('\nLinking capabilities to Pharos...')
  const osCapabilities: OsCapabilitySpec[] = [
    {
      capabilityId: capIds['realtime-analytics-dashboard'],
      implementationNotes: 'Cloudflare Worker cron jobs fetch live price and supply data every 5 minutes; TanStack Query hooks stream updates to the Next.js frontend.',
      githubPath: 'worker/src/cron/',
      documentationUrl: 'https://pharos.watch',
      implementationComplexity: 'intermediate',
    },
    {
      capabilityId: capIds['historical-supply-charts'],
      implementationNotes: 'D1 database stores point-in-time supply snapshots; Recharts renders interactive time-series charts with configurable range selectors.',
      githubPath: 'src/components/',
      documentationUrl: 'https://pharos.watch',
      implementationComplexity: 'intermediate',
    },
    {
      capabilityId: capIds['peg-health-monitoring'],
      implementationNotes: 'PegScore/DEWS methodology computes a composite health score per stablecoin from price deviation, liquidity depth, and supply trend data.',
      githubPath: 'shared/lib/',
      documentationUrl: 'https://pharos.watch/methodology',
      implementationComplexity: 'advanced',
    },
    {
      capabilityId: capIds['reserve-transparency'],
      implementationNotes: 'Per-coin JSON files in shared/data/stablecoins/coins/ curate reserve composition; the detail page renders collateral breakdowns with source links.',
      githubPath: 'shared/data/stablecoins/',
      documentationUrl: 'https://pharos.watch',
      implementationComplexity: 'basic',
    },
    {
      capabilityId: capIds['self-hostable'],
      implementationNotes: 'Static Next.js export deploys to Cloudflare Pages; the backend is a Cloudflare Worker + D1 database. Full instructions in the repository README.',
      githubPath: '',
      documentationUrl: 'https://github.com/TokenBrice/pharos-watch',
      implementationComplexity: 'basic',
    },
  ]

  for (const spec of osCapabilities) {
    await linkOpenSourceCapability(pharosId, spec)
  }
  console.log('  ✓ Done')

  console.log('\n=== Seed complete ===')
  console.log(`View: https://opensource.builders/alternatives/dune-analytics`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
