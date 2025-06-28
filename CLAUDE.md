# CLAUDE.md - Open Source Builders GraphQL API Guide

This file provides comprehensive guidance for working with the Open Source Builders GraphQL API, schema structure, and data management operations.

## API Configuration

**Base URL**: `http://localhost:3003/api/graphql`
**Authentication**: Cookie-based session authentication using `keystonejs-session` cookie

### Authentication Cookie Format
```
keystonejs-session=Fe26.2**[session-data]
```

## Core Schema Models

### Tool Model
The primary entity representing software tools in the directory.

**Key Fields**:
- `id`: String (auto-generated)
- `name`: String (display name)
- `slug`: String (URL-friendly identifier)
- `description`: String (tool description)
- `isOpenSource`: Boolean (true for open source, false for proprietary)
- `websiteUrl`: String (official website)
- `repositoryUrl`: String (source code repository)
- `simpleIconSlug`: String (Simple Icons identifier)
- `simpleIconColor`: String (brand color hex)
- `license`: String (software license)
- `githubStars`: Int (GitHub star count)
- `status`: String (development status)
- `pricingModel`: String (pricing information)
- `category`: Relationship to Category
- `features`: Many-to-many relationship via ToolFeature
- `proprietaryAlternatives`: Many-to-many via Alternative model
- `openSourceAlternatives`: Many-to-many via Alternative model
- `deploymentOptions`: Many-to-many relationship

### Category Model
Hierarchical categorization system for tools.

**Key Fields**:
- `id`: String
- `name`: String (category name)
- `description`: String
- `tools`: One-to-many relationship with Tool

### Alternative Model
Junction table connecting proprietary and open source tools as alternatives.

**Key Fields**:
- `id`: String
- `proprietaryTool`: Relationship to Tool (where isOpenSource=false)
- `openSourceTool`: Relationship to Tool (where isOpenSource=true)
- `similarityScore`: Int (relevance rating)
- `notes`: String (comparison details)

### Feature Model
Represents software capabilities and features.

**Key Fields**:
- `id`: String
- `name`: String
- `description`: String
- `featureType`: String (categorization)

### ToolFeature Model
Junction table connecting tools to features with quality ratings.

**Key Fields**:
- `id`: String
- `tool`: Relationship to Tool
- `feature`: Relationship to Feature
- `implementationNotes`: String
- `qualityScore`: Int (implementation quality 1-10)

## Common Query Patterns

### Get All Tools with Basic Info
```graphql
query {
  tools {
    id
    name
    slug
    description
    isOpenSource
    websiteUrl
    category {
      id
      name
    }
  }
}
```

### Get Tools by Category
```graphql
query GetToolsByCategory($categoryId: ID!) {
  tools(where: { category: { id: { equals: $categoryId } } }) {
    id
    name
    slug
    description
    isOpenSource
  }
}
```

### Get Specific Tools by Slugs
```graphql
query GetSpecificTools($slugs: [String!]!) {
  tools(where: { slug: { in: $slugs } }) {
    id
    name
    slug
    description
    isOpenSource
    websiteUrl
  }
}
```

### Get Proprietary Tools for Carousel
```graphql
query GetProprietaryTools {
  tools(where: { 
    isOpenSource: { equals: false }
    slug: { in: ["shopify", "notion", "tailwind-plus", "cursor"] }
  }) {
    id
    name
    slug
    description
    websiteUrl
    simpleIconSlug
    simpleIconColor
  }
}
```

### Get Open Source Alternatives
```graphql
query GetAlternatives($proprietarySlug: String!) {
  alternatives(where: { 
    proprietaryTool: { slug: { equals: $proprietarySlug } } 
  }) {
    id
    openSourceTool {
      id
      name
      slug
      description
      repositoryUrl
      githubStars
    }
    similarityScore
    notes
  }
}
```

### Get Available Categories
```graphql
query GetCategories {
  categories {
    id
    name
    description
    _count {
      tools
    }
  }
}
```

## Data Creation Patterns

### Create a New Tool
```graphql
mutation CreateTool($data: ToolCreateInput!) {
  createTool(data: $data) {
    id
    name
    slug
  }
}
```

**Example Variables**:
```json
{
  "data": {
    "name": "Tool Name",
    "slug": "tool-slug",
    "description": "Tool description",
    "isOpenSource": true,
    "websiteUrl": "https://example.com",
    "repositoryUrl": "https://github.com/org/repo",
    "category": {
      "connect": { "id": "category-id" }
    }
  }
}
```

### Create Alternative Relationship
```graphql
mutation CreateAlternative($data: AlternativeCreateInput!) {
  createAlternative(data: $data) {
    id
    proprietaryTool { name }
    openSourceTool { name }
  }
}
```

**Example Variables**:
```json
{
  "data": {
    "proprietaryTool": { "connect": { "id": "proprietary-tool-id" } },
    "openSourceTool": { "connect": { "id": "open-source-tool-id" } },
    "similarityScore": 85,
    "notes": "Both provide similar functionality for X"
  }
}
```

## Permission System

### User Authentication Check
```graphql
query {
  authenticatedItem {
    __typename
    ... on User {
      id
      name
      email
      role {
        id
        name
        canManageTools
        canManageCategories
        canManageFeatures
        canManageAlternatives
      }
    }
  }
}
```

### Required Permissions for Operations
- **Tool Management**: `canManageTools: true`
- **Category Management**: `canManageCategories: true`
- **Feature Management**: `canManageFeatures: true`
- **Alternative Management**: `canManageAlternatives: true`

## Schema Introspection

### Get Input Type Fields
```graphql
query {
  __type(name: "ToolCreateInput") {
    inputFields {
      name
      type {
        name
        kind
      }
    }
  }
}
```

### Get Available Categories for Reference
```graphql
query {
  categories {
    id
    name
  }
}
```

## Data Management Best Practices

### Tool Creation Workflow
1. Check if category exists or create new category
2. Verify tool slug is unique
3. Create tool with proper category relationship
4. Add features via ToolFeature junction if applicable
5. Create alternative relationships if applicable

### Alternative Relationship Workflow
1. Ensure both proprietary and open source tools exist
2. Create Alternative record linking them
3. Set appropriate similarity score (1-100)
4. Add descriptive notes about the relationship

### Bulk Operations Strategy
Create TypeScript scripts for bulk operations rather than manual GraphQL calls:
- **Tool Import Script**: For adding multiple tools from JSON/CSV
- **Alternative Mapping Script**: For creating multiple alternative relationships
- **Category Management Script**: For organizing tool categories
- **Feature Assignment Script**: For bulk feature assignments

## GitHub Data Collection & Repository Analytics

### GitHub Integration Fields
The Tool model includes comprehensive GitHub repository analytics:

**Core Repository Data**:
- `repositoryUrl`: Full GitHub repository URL
- `githubStars`: Current star count
- `githubForks`: Number of repository forks
- `githubIssues`: Count of open issues
- `githubLastCommit`: Timestamp of last commit to main branch

### GitHub API Data Collection

**GitHub API Endpoints for Tool Data**:
```bash
# Get repository info
GET https://api.github.com/repos/{owner}/{repo}

# Response includes:
{
  "stargazers_count": 1234,
  "forks_count": 567,
  "open_issues_count": 89,
  "pushed_at": "2023-12-01T10:30:00Z",
  "description": "Tool description",
  "homepage": "https://tool-website.com",
  "license": { "name": "MIT" }
}
```

**Rate Limiting & Authentication**:
- GitHub API allows 60 requests/hour unauthenticated
- 5000 requests/hour with personal access token
- Use `Authorization: token YOUR_TOKEN` header

### Automated GitHub Data Scripts

**Repository Data Sync Script** (`scripts/sync-github-data.ts`):
```typescript
interface GitHubRepoData {
  stars: number;
  forks: number;
  openIssues: number;
  lastCommit: string;
  description?: string;
  license?: string;
}

async function fetchGitHubData(repoUrl: string): Promise<GitHubRepoData | null> {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  
  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');
  
  const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'User-Agent': 'OpenSourceBuilders-DataSync'
    }
  });
  
  if (!response.ok) return null;
  const data = await response.json();
  
  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    lastCommit: data.pushed_at,
    description: data.description,
    license: data.license?.name
  };
}
```

### Missing GitHub Data Detection

**Query to Find Tools Missing GitHub Data**:
```graphql
query ToolsMissingGitHubData {
  tools(where: { 
    AND: [
      { isOpenSource: { equals: true } }
      { repositoryUrl: { not: { equals: null } } }
      { OR: [
        { githubStars: { equals: null } }
        { githubForks: { equals: null } }
        { githubLastCommit: { equals: null } }
      ]}
    ]
  }) {
    id
    name
    slug
    repositoryUrl
    githubStars
    githubForks
    githubLastCommit
  }
}
```

**Data Quality Analysis**:
```typescript
// Check completion rates
const tools = await query(`
  query {
    tools(where: { isOpenSource: { equals: true } }) {
      totalCount
    }
    toolsWithStars: tools(where: { 
      isOpenSource: { equals: true }
      githubStars: { not: { equals: null } }
    }) {
      totalCount
    }
    toolsWithRepos: tools(where: { 
      isOpenSource: { equals: true }
      repositoryUrl: { not: { equals: null } }
    }) {
      totalCount
    }
  }
`);

const completionRate = {
  stars: (toolsWithStars.totalCount / tools.totalCount) * 100,
  repositories: (toolsWithRepos.totalCount / tools.totalCount) * 100
};
```

## Script Development Guidelines

When creating data management scripts:
1. Use TypeScript for type safety
2. Include proper error handling and validation
3. Support dry-run mode for testing
4. Log operations for audit trail
5. Handle authentication via environment variables
6. Implement batch processing for large datasets
7. **Include GitHub API integration for repository data**
8. **Implement rate limiting and retry logic for API calls**
9. **Cache GitHub responses to avoid redundant API calls**

### Example Script Structure
```typescript
// scripts/add-tools.ts
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION}`
  }
});

interface ToolInput {
  name: string;
  slug: string;
  description: string;
  isOpenSource: boolean;
  // ... other fields
}

async function createTool(toolData: ToolInput) {
  const mutation = `
    mutation CreateTool($data: ToolCreateInput!) {
      createTool(data: $data) { id name slug }
    }
  `;
  
  return await client.request(mutation, { data: toolData });
}
```

## Current Database State

**Existing Categories**:
- Development Tools (ID: cmbjbh3jp0019e6qfgvz44zgn)
- API Development
- Mobile Development
- Gaming & Game Development
- Additional Development Tools

**Key Proprietary Tools for Carousel**:
- Shopify (slug: "shopify")
- Notion (slug: "notion") 
- Tailwind Plus (slug: "tailwind-plus")
- Cursor (slug: "cursor") - Recently added

**Authentication**: Admin user "Junaid" with full tool management permissions

## Common Issues & Solutions

### Access Denied Errors
- Verify authentication cookie is valid and not expired
- Check user has required permissions for the operation
- Ensure proper role assignment in the system

### Schema Field Errors
- Use introspection queries to verify available fields
- Check field naming (e.g., `websiteUrl` not `website`)
- Validate relationship field syntax (`connect`, `create`, etc.)

### Relationship Creation
- Always verify related entities exist before creating relationships
- Use proper GraphQL relationship syntax for connections
- Handle many-to-many relationships via junction tables