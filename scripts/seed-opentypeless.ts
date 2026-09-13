/**
 * Seed script: Add OpenTypeless as an open-source Superwhisper alternative.
 *
 * Usage:
 *   KEYSTONE_SESSION=<token> npx tsx scripts/seed-opentypeless.ts
 *
 * The script is idempotent: it updates an existing application record and
 * updates existing capability links instead of creating duplicates.
 */

const API_URL = process.env.KEYSTONE_URL ?? 'https://opensource.builders/api/graphql'
const SESSION = process.env.KEYSTONE_SESSION

if (!SESSION) {
  console.error('Error: KEYSTONE_SESSION environment variable is required.')
  process.exit(1)
}

type GraphQLData = Record<string, unknown>

async function request(query: string): Promise<GraphQLData> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `keystonejs-session=${SESSION}`,
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed with HTTP ${response.status}`)
  }

  const payload = (await response.json()) as {
    data?: GraphQLData
    errors?: { message?: string }[]
  }
  if (payload.errors?.length) {
    throw new Error(
      `GraphQL request failed: ${payload.errors.map(error => error.message ?? 'Unknown error').join('; ')}`,
    )
  }
  if (!payload.data) {
    throw new Error('GraphQL response did not include data')
  }

  return payload.data
}

function graphQLString(value: string): string {
  return JSON.stringify(value)
}

interface Capability {
  id: string
  name: string
  slug: string
}

interface ProprietaryApplication {
  id: string
  name: string
  slug: string
  capabilities: { capability: Capability | null; isActive: boolean }[]
}

interface OpenSourceApplication {
  id: string
  name: string
  slug: string
}

interface CapabilityEvidence {
  slug: string
  implementationNotes: string
  githubPath: string
  documentationUrl: string
  implementationComplexity: 'basic' | 'intermediate' | 'advanced'
}

const repositoryUrl = 'https://github.com/tover0314-w/opentypeless'
const websiteUrl = 'https://www.opentypeless.com'

const capabilityEvidence: CapabilityEvidence[] = [
  {
    slug: 'speech-to-text',
    implementationNotes:
      'A shared STT provider interface supports streaming and file-based transcription through Deepgram, AssemblyAI, Apple Speech, OpenAI-compatible Whisper endpoints, Volcengine, and the managed cloud provider.',
    githubPath: 'src-tauri/src/stt/mod.rs',
    documentationUrl: `${repositoryUrl}#features`,
    implementationComplexity: 'advanced',
  },
  {
    slug: 'offline-first',
    implementationNotes:
      'The desktop app can keep the core voice-to-text workflow off cloud services by using built-in Apple Speech or a local/self-hosted Whisper-compatible endpoint for STT and Ollama for optional text polishing. Users run or provide the local endpoints; OpenTypeless does not download or manage models.',
    githubPath: 'src-tauri/src/stt/config.rs',
    documentationUrl: `${repositoryUrl}#self-hosting--no-cloud`,
    implementationComplexity: 'advanced',
  },
  {
    slug: 'global-hotkey',
    implementationNotes:
      'Cross-platform global shortcuts support hold and toggle workflows, multiple role-specific bindings, conflict validation, native Fn/Right Alt handling, and supervised registration retries.',
    githubPath: 'src-tauri/src/hotkey.rs',
    documentationUrl: `${repositoryUrl}#features`,
    implementationComplexity: 'advanced',
  },
  {
    slug: 'auto-pasting',
    implementationNotes:
      'The output layer copies generated text, simulates a platform-appropriate paste, restores the previous clipboard when safe, and falls back to copy-only output when insertion is unavailable.',
    githubPath: 'src-tauri/src/output/clipboard.rs',
    documentationUrl: `${repositoryUrl}#features`,
    implementationComplexity: 'intermediate',
  },
  {
    slug: 'context-awareness',
    implementationNotes:
      'A local app detector classifies foreground native applications and supported browser domains into semantic writing contexts. Only mapped context metadata is exposed to prompt composition; raw titles and URLs are excluded.',
    githubPath: 'src-tauri/src/app_detector/mod.rs',
    documentationUrl: `${repositoryUrl}#whats-new-in-v1149`,
    implementationComplexity: 'advanced',
  },
  {
    slug: 'ai-text-transformation',
    implementationNotes:
      'Prompt composition turns raw dictation into polished text and supports selected-text rewriting, translation, app-aware style policies, custom instructions, dictionaries, and correction rules.',
    githubPath: 'src-tauri/src/llm/prompt.rs',
    documentationUrl: `${repositoryUrl}#features`,
    implementationComplexity: 'advanced',
  },
]

async function findSuperwhisper(): Promise<ProprietaryApplication> {
  const data = await request(`
    query {
      proprietaryApplications(where: { slug: { equals: "superwhisper" } }) {
        id
        name
        slug
        capabilities {
          isActive
          capability { id name slug }
        }
      }
    }
  `)
  const applications = data.proprietaryApplications as ProprietaryApplication[]
  if (applications.length !== 1) {
    throw new Error(`Expected one Superwhisper record, found ${applications.length}`)
  }

  console.log(`Found proprietary baseline: ${applications[0].name} (${applications[0].id})`)
  return applications[0]
}

async function findExistingOpenTypeless(): Promise<OpenSourceApplication | null> {
  const data = await request(`
    query {
      openSourceApplications(where: {
        OR: [
          { slug: { equals: "opentypeless" } }
          { repositoryUrl: { equals: ${graphQLString(repositoryUrl)} } }
        ]
      }) {
        id name slug
      }
    }
  `)
  const applications = data.openSourceApplications as OpenSourceApplication[]
  if (applications.length > 1) {
    throw new Error(`Duplicate OpenTypeless records found: ${applications.map(app => app.id).join(', ')}`)
  }
  return applications[0] ?? null
}

async function upsertOpenTypeless(superwhisperId: string): Promise<OpenSourceApplication> {
  const existing = await findExistingOpenTypeless()
  const applicationData = `
    name: "OpenTypeless"
    slug: "opentypeless"
    description: "Open-source, cross-platform AI voice typing that turns speech into polished text in any desktop application, with app-aware writing, selected-text editing, BYOK providers, and local/self-hosted paths."
    repositoryUrl: ${graphQLString(repositoryUrl)}
    websiteUrl: ${graphQLString(websiteUrl)}
    license: "MIT"
    githubStars: 347
    githubForks: 63
    githubIssues: 28
    githubLastCommit: "2026-07-16T16:45:46.000Z"
    status: active
    primaryAlternativeTo: { connect: { id: ${graphQLString(superwhisperId)} } }
  `

  if (existing) {
    const data = await request(`
      mutation {
        updateOpenSourceApplication(
          where: { id: ${graphQLString(existing.id)} }
          data: { ${applicationData} }
        ) { id name slug }
      }
    `)
    const application = data.updateOpenSourceApplication as OpenSourceApplication
    console.log(`Updated open-source application: ${application.name} (${application.id})`)
    return application
  }

  const data = await request(`
    mutation {
      createOpenSourceApplication(data: { ${applicationData} }) {
        id name slug
      }
    }
  `)
  const application = data.createOpenSourceApplication as OpenSourceApplication
  console.log(`Created open-source application: ${application.name} (${application.id})`)
  return application
}

async function resolveCapabilities(
  superwhisper: ProprietaryApplication,
): Promise<Map<string, Capability>> {
  const baselineCapabilities = new Map(
    superwhisper.capabilities
      .filter(link => link.isActive && link.capability)
      .map(link => [link.capability!.slug, link.capability!]),
  )

  const missing = capabilityEvidence
    .map(spec => spec.slug)
    .filter(slug => !baselineCapabilities.has(slug))
  if (missing.length) {
    throw new Error(
      `Superwhisper is missing expected capabilities: ${missing.join(', ')}. Review the mapping before seeding.`,
    )
  }

  return baselineCapabilities
}

async function upsertCapabilityLink(
  applicationId: string,
  capability: Capability,
  evidence: CapabilityEvidence,
): Promise<void> {
  const data = await request(`
    query {
      openSourceCapabilities(where: {
        openSourceApplication: { id: { equals: ${graphQLString(applicationId)} } }
        capability: { id: { equals: ${graphQLString(capability.id)} } }
      }) { id }
    }
  `)
  const links = data.openSourceCapabilities as { id: string }[]
  if (links.length > 1) {
    throw new Error(`Duplicate ${capability.slug} links found: ${links.map(link => link.id).join(', ')}`)
  }

  const linkData = `
    openSourceApplication: { connect: { id: ${graphQLString(applicationId)} } }
    capability: { connect: { id: ${graphQLString(capability.id)} } }
    isActive: true
    implementationNotes: ${graphQLString(evidence.implementationNotes)}
    githubPath: ${graphQLString(evidence.githubPath)}
    documentationUrl: ${graphQLString(evidence.documentationUrl)}
    implementationComplexity: ${evidence.implementationComplexity}
  `

  if (links[0]) {
    await request(`
      mutation {
        updateOpenSourceCapability(
          where: { id: ${graphQLString(links[0].id)} }
          data: { ${linkData} }
        ) { id }
      }
    `)
    console.log(`Updated capability evidence: ${capability.name}`)
    return
  }

  await request(`
    mutation {
      createOpenSourceCapability(data: { ${linkData} }) { id }
    }
  `)
  console.log(`Linked capability: ${capability.name}`)
}

async function verifyOpenTypeless(applicationId: string): Promise<void> {
  const data = await request(`
    query {
      openSourceApplication(where: { id: ${graphQLString(applicationId)} }) {
        id name slug repositoryUrl websiteUrl license
        githubStars githubForks githubIssues githubLastCommit status
        primaryAlternativeTo { id name slug }
        capabilities {
          isActive implementationNotes githubPath documentationUrl implementationComplexity
          capability { id name slug }
        }
      }
    }
  `)
  const application = data.openSourceApplication as {
    name: string
    capabilities: { isActive: boolean; capability: Capability | null }[]
  } | null
  if (!application) {
    throw new Error('Verification query could not find OpenTypeless after seeding')
  }

  const activeCapabilitySlugs = application.capabilities
    .filter(link => link.isActive && link.capability)
    .map(link => link.capability!.slug)
    .sort()
  const expectedSlugs = capabilityEvidence.map(spec => spec.slug).sort()
  if (activeCapabilitySlugs.join(',') !== expectedSlugs.join(',')) {
    throw new Error(
      `Verification failed. Expected capabilities ${expectedSlugs.join(', ')}, got ${activeCapabilitySlugs.join(', ')}`,
    )
  }

  console.log(`Verified ${application.name} with ${activeCapabilitySlugs.length} active capabilities`)
}

async function main(): Promise<void> {
  console.log('Seeding OpenTypeless as a Superwhisper alternative')
  const superwhisper = await findSuperwhisper()
  const capabilities = await resolveCapabilities(superwhisper)
  const openTypeless = await upsertOpenTypeless(superwhisper.id)

  for (const evidence of capabilityEvidence) {
    await upsertCapabilityLink(openTypeless.id, capabilities.get(evidence.slug)!, evidence)
  }

  await verifyOpenTypeless(openTypeless.id)
  console.log('Seed complete: https://opensource.builders/alternatives/superwhisper')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
