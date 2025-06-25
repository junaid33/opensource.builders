import { Suspense } from 'react'
import AlternativeCard from './AlternativeCard'

// This would normally fetch from your GraphQL endpoint
// For now, using mock data that matches your data structure
const mockAlternatives = [
  {
    id: '1',
    name: 'WooCommerce',
    description: 'Open-source e-commerce platform for WordPress. Highly customizable with thousands of plugins and themes.',
    websiteUrl: 'https://woocommerce.com',
    repositoryUrl: 'https://github.com/woocommerce/woocommerce',
    logoUrl: null,
    resolvedLogo: {
      type: 'favicon' as const,
      data: 'https://www.google.com/s2/favicons?domain=woocommerce.com&sz=64',
      domain: 'woocommerce.com',
      verified: true
    },
    license: 'GPL v3',
    githubStars: 8900,
    isOpenSource: true,
    category: {
      name: 'E-commerce',
      slug: 'ecommerce'
    },
    proprietaryAlternatives: [
      {
        proprietaryTool: {
          name: 'Shopify'
        }
      }
    ]
  },
  {
    id: '2',
    name: 'AppFlowy',
    description: 'Privacy-first, open-source workspace for your notes, knowledge base, and projects. Built with Flutter and Rust.',
    websiteUrl: 'https://appflowy.io',
    repositoryUrl: 'https://github.com/AppFlowy-IO/AppFlowy',
    logoUrl: null,
    resolvedLogo: {
      type: 'letter' as const,
      data: 'A',
      svg: `<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="28" fill="#3B82F6"/>
              <text x="28" y="28" dy="0.35em" text-anchor="middle" 
                    fill="white" font-family="system-ui, sans-serif" 
                    font-size="28" font-weight="600">A</text>
            </svg>`,
      verified: true
    },
    license: 'AGPL v3',
    githubStars: 45200,
    isOpenSource: true,
    category: {
      name: 'Productivity',
      slug: 'productivity'
    },
    proprietaryAlternatives: [
      {
        proprietaryTool: {
          name: 'Notion'
        }
      }
    ]
  },
  {
    id: '3',
    name: 'NocoDB',
    description: 'Open source Airtable alternative. Turn any MySQL, PostgreSQL, SQL Server, SQLite & MariaDB into a smart spreadsheet.',
    websiteUrl: 'https://nocodb.com',
    repositoryUrl: 'https://github.com/nocodb/nocodb',
    logoUrl: null,
    resolvedLogo: {
      type: 'favicon' as const,
      data: 'https://www.google.com/s2/favicons?domain=nocodb.com&sz=64',
      domain: 'nocodb.com',
      verified: true
    },
    license: 'MIT',
    githubStars: 41800,
    isOpenSource: true,
    category: {
      name: 'Database',
      slug: 'database'
    },
    proprietaryAlternatives: [
      {
        proprietaryTool: {
          name: 'Airtable'
        }
      }
    ]
  },
  {
    id: '4',
    name: 'RustDesk',
    description: 'Open source virtual / remote desktop software, written in Rust. Works out of the box, no configuration required.',
    websiteUrl: 'https://rustdesk.com',
    repositoryUrl: 'https://github.com/rustdesk/rustdesk',
    logoUrl: null,
    resolvedLogo: {
      type: 'favicon' as const,
      data: 'https://www.google.com/s2/favicons?domain=rustdesk.com&sz=64',
      domain: 'rustdesk.com',
      verified: true
    },
    license: 'AGPL v3',
    githubStars: 62800,
    isOpenSource: true,
    category: {
      name: 'Remote Access',
      slug: 'remote-access'
    },
    proprietaryAlternatives: [
      {
        proprietaryTool: {
          name: 'TeamViewer'
        }
      }
    ]
  },
  {
    id: '5',
    name: 'Mattermost',
    description: 'Open source platform for secure collaboration across the entire software development lifecycle.',
    websiteUrl: 'https://mattermost.com',
    repositoryUrl: 'https://github.com/mattermost/mattermost',
    logoUrl: null,
    resolvedLogo: {
      type: 'favicon' as const,
      data: 'https://www.google.com/s2/favicons?domain=mattermost.com&sz=64',
      domain: 'mattermost.com',
      verified: true
    },
    license: 'MIT',
    githubStars: 27200,
    isOpenSource: true,
    category: {
      name: 'Communication',
      slug: 'communication'
    },
    proprietaryAlternatives: [
      {
        proprietaryTool: {
          name: 'Slack'
        }
      }
    ]
  }
]

export default async function AlternativesQuery() {
  // In a real implementation, this would be a GraphQL query like:
  // const data = await fetch('/api/graphql', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     query: `
  //       query GetAlternatives($where: ToolWhereInput) {
  //         tools(where: $where, orderBy: [{ githubStars: desc }]) {
  //           id
  //           name
  //           description
  //           websiteUrl
  //           repositoryUrl
  //           logoUrl
  //           license
  //           githubStars
  //           isOpenSource
  //           category {
  //             name
  //             slug
  //           }
  //           proprietaryAlternatives {
  //             proprietaryTool {
  //               name
  //             }
  //           }
  //         }
  //       }
  //     `,
  //     variables: {
  //       where: {
  //         isOpenSource: { equals: true }
  //       }
  //     }
  //   })
  // })

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))

  return (
    <div className="space-y-6">
      {mockAlternatives.map(alternative => (
        <AlternativeCard key={alternative.id} {...alternative} />
      ))}
    </div>
  )
}