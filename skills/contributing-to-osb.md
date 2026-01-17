# Contributing to Open Source Builders - AI Skill Guide

This skill enables an AI assistant to add new proprietary applications and their open source alternatives to the Open Source Builders directory.

---

## Prerequisites

Before you can add anything to the database, you need:

1. **API Endpoint**: `https://opensource.builders/api/graphql`
2. **Authentication**: A valid session token (user must provide email/password)

---

## CRITICAL: Shell Glob Expansion Warning

The session token contains `**` which zsh/bash interprets as a glob pattern. **You MUST disable glob expansion** before any curl command:

```bash
set -o noglob; curl -s -X POST ...
```

Without `set -o noglob`, your curl commands will fail with glob expansion errors.

---

## Step 1: Authenticate

The user must provide their credentials. Use this to get a session token:

```bash
curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  --data '{"query": "mutation { authenticateUserWithPassword(email: \"USER_EMAIL\", password: \"USER_PASSWORD\") { ... on UserAuthenticationWithPasswordSuccess { sessionToken item { id name email } } ... on UserAuthenticationWithPasswordFailure { message } } }"}'
```

Save the `sessionToken` from the response. Use it in all subsequent requests as a cookie:
```
Cookie: keystonejs-session=YOUR_SESSION_TOKEN_HERE
```

---

## Database Schema

The database has these core models you'll be working with:

### ProprietaryApplication
Commercial/proprietary software (e.g., Notion, Figma, Slack)

| Field | Type | Description |
|-------|------|-------------|
| name | String (required) | Display name (e.g., "Screen Studio") |
| slug | String (required, unique) | URL-friendly identifier (e.g., "screen-studio") |
| description | Text | What the app does |
| websiteUrl | String | Official website URL |
| simpleIconSlug | String | Icon slug from simpleicons.org (e.g., "notion") |
| simpleIconColor | String | Hex color for the icon (e.g., "#000000") |
| category | Relationship | Link to Category |

### OpenSourceApplication
Open source alternatives to proprietary software

| Field | Type | Description |
|-------|------|-------------|
| name | String (required) | Display name (e.g., "AppFlowy") |
| slug | String (required, unique) | URL-friendly identifier |
| description | Text | What the app does |
| repositoryUrl | String | GitHub/GitLab URL |
| websiteUrl | String | Project website (if different from repo) |
| license | String | License type (MIT, Apache-2.0, GPL-3.0, etc.) |
| githubStars | Integer | Current star count |
| githubForks | Integer | Current fork count |
| githubIssues | Integer | Open issues count |
| githubLastCommit | Timestamp | When last commit was made |
| status | Enum | One of: active, maintenance, deprecated, beta |
| simpleIconSlug | String | Icon slug from simpleicons.org |
| simpleIconColor | String | Hex color for the icon |
| primaryAlternativeTo | Relationship | The ProprietaryApplication this replaces |

### Capability
Feature definitions that can be shared across apps

| Field | Type | Description |
|-------|------|-------------|
| name | String (required) | Feature name (e.g., "Screen Recording") |
| slug | String (required, unique) | URL-friendly identifier |
| description | Text | What this capability does |
| category | Enum | See capability categories below |
| complexity | Enum | basic, intermediate, or advanced |

### Capability Categories
Use one of these when creating capabilities:
- `authentication` - Login, SSO, OAuth, MFA
- `payment` - Payments, subscriptions, invoicing
- `storage` - File storage, cloud sync, backups
- `communication` - Chat, email, notifications
- `analytics` - Tracking, metrics, dashboards
- `ui_components` - UI libraries, components
- `database` - Database management, queries
- `email` - Email sending, templates
- `search` - Full-text search, indexing
- `media` - Video, audio, image processing
- `security` - Encryption, access control
- `deployment` - CI/CD, hosting
- `monitoring` - Logging, error tracking
- `testing` - Unit tests, E2E tests
- `other` - Anything else

### ProprietaryCapability (Junction Table)
Links a ProprietaryApplication to a Capability

| Field | Type | Description |
|-------|------|-------------|
| proprietaryApplication | Relationship | The proprietary app |
| capability | Relationship | The capability it has |
| isActive | Boolean | Whether this feature is currently available |

### OpenSourceCapability (Junction Table)
Links an OpenSourceApplication to a Capability with implementation details

| Field | Type | Description |
|-------|------|-------------|
| openSourceApplication | Relationship | The open source app |
| capability | Relationship | The capability it implements |
| isActive | Boolean | Whether this feature works |
| implementationNotes | Text | How this app implements the feature |
| githubPath | String | Path to code implementing this (e.g., "src/auth/") |
| documentationUrl | String | Link to docs for this feature |
| implementationComplexity | Enum | basic, intermediate, or advanced |

### Category
Grouping for proprietary applications

| Field | Type | Description |
|-------|------|-------------|
| name | String (required) | Category name |
| slug | String (required, unique) | URL-friendly identifier |
| description | Text | What this category covers |
| icon | String | Icon identifier |
| color | String | Hex color |

---

## Complete Workflow

When a user says something like "I found an open source alternative to X called Y", follow this workflow:

### Phase 1: Research the Open Source Project

**You MUST research the GitHub repository to gather:**

1. **Fetch the GitHub README** - Use web search or fetch the repository URL to understand:
   - What the project does
   - Key features and capabilities
   - Technology stack
   - Current status (actively maintained?)

2. **Get GitHub statistics** - You need:
   - Star count
   - Fork count
   - Open issues count
   - Last commit date
   - License type

3. **Identify capabilities** - From the README and features list, determine:
   - What features does this app have?
   - How do they compare to the proprietary alternative?
   - What's the implementation complexity?

**Example research for a project:**
```
Project: https://github.com/AppFlowy-IO/AppFlowy
- Name: AppFlowy
- Description: Open-source alternative to Notion
- Stars: 45,000+
- License: AGPL-3.0
- Key features: Rich text editing, databases, kanban boards, calendar view
- Status: Active (commits within last week)
- Website: https://appflowy.io
```

### Phase 2: Research the Proprietary Application

**If the proprietary app doesn't exist in the database, research it:**

1. **Visit the official website** to gather:
   - Official name and description
   - Key features/capabilities
   - Pricing model (helps understand what features matter)

2. **Find the icon** - Check https://simpleicons.org for:
   - The icon slug (e.g., "notion", "figma", "slack")
   - The brand color

3. **Identify the category** - What type of software is this?
   - Productivity, Design, Development, Communication, etc.

### Phase 3: Check for Existing Records

**ALWAYS check before creating to avoid duplicates:**

#### Check for existing Proprietary Application:
```graphql
query {
  proprietaryApplications(where: {
    OR: [
      { name: { contains: "App Name" } }
      { slug: { equals: "app-slug" } }
    ]
  }) {
    id
    name
    slug
    capabilities {
      capability {
        id
        name
        slug
      }
    }
  }
}
```

#### Check for existing Open Source Application:
```graphql
query {
  openSourceApplications(where: {
    OR: [
      { name: { contains: "App Name" } }
      { slug: { equals: "app-slug" } }
      { repositoryUrl: { contains: "github.com/owner/repo" } }
    ]
  }) {
    id
    name
    slug
    repositoryUrl
  }
}
```

#### Check for existing Capabilities:
```graphql
query {
  capabilities(where: {
    OR: [
      { name: { contains: "Feature Name" } }
      { slug: { equals: "feature-slug" } }
    ]
  }) {
    id
    name
    slug
    category
    complexity
  }
}
```

#### Check for existing Categories:
```graphql
query {
  categories(where: {
    OR: [
      { name: { contains: "Category Name" } }
      { slug: { equals: "category-slug" } }
    ]
  }) {
    id
    name
    slug
  }
}
```

### Phase 4: Create Missing Entities

Create entities in this order (respecting dependencies):

#### 1. Create Category (if needed)
```graphql
mutation {
  createCategory(data: {
    name: "Productivity"
    slug: "productivity"
    description: "Tools for getting work done"
    icon: "briefcase"
    color: "#4F46E5"
  }) {
    id
    name
    slug
  }
}
```

#### 2. Create Proprietary Application (if needed)
```graphql
mutation {
  createProprietaryApplication(data: {
    name: "Notion"
    slug: "notion"
    description: "All-in-one workspace for notes, docs, wikis, and project management"
    websiteUrl: "https://notion.so"
    simpleIconSlug: "notion"
    simpleIconColor: "#000000"
    category: { connect: { id: "CATEGORY_ID" } }
  }) {
    id
    name
    slug
  }
}
```

#### 3. Create Capabilities (if needed)
```graphql
mutation {
  createCapability(data: {
    name: "Rich Text Editor"
    slug: "rich-text-editor"
    description: "WYSIWYG text editing with formatting, embeds, and blocks"
    category: "ui_components"
    complexity: "intermediate"
  }) {
    id
    name
    slug
  }
}
```

#### 4. Create ProprietaryCapability junctions
```graphql
mutation {
  createProprietaryCapability(data: {
    proprietaryApplication: { connect: { id: "PROPRIETARY_APP_ID" } }
    capability: { connect: { id: "CAPABILITY_ID" } }
    isActive: true
  }) {
    id
  }
}
```

#### 5. Create Open Source Application
```graphql
mutation {
  createOpenSourceApplication(data: {
    name: "AppFlowy"
    slug: "appflowy"
    description: "Open-source alternative to Notion - AI-powered secure workspace"
    repositoryUrl: "https://github.com/AppFlowy-IO/AppFlowy"
    websiteUrl: "https://appflowy.io"
    license: "AGPL-3.0"
    githubStars: 45000
    githubForks: 2900
    githubIssues: 800
    status: "active"
    simpleIconSlug: "appflowy"
    simpleIconColor: "#00BCF0"
    primaryAlternativeTo: { connect: { id: "PROPRIETARY_APP_ID" } }
  }) {
    id
    name
    slug
  }
}
```

#### 6. Create OpenSourceCapability junctions
```graphql
mutation {
  createOpenSourceCapability(data: {
    openSourceApplication: { connect: { id: "OPENSOURCE_APP_ID" } }
    capability: { connect: { id: "CAPABILITY_ID" } }
    isActive: true
    implementationComplexity: "intermediate"
    implementationNotes: "Uses Rust-based editor with Slate-like architecture"
    githubPath: "frontend/appflowy_flutter/lib/plugins/document"
    documentationUrl: "https://docs.appflowy.io/docs/documentation"
  }) {
    id
  }
}
```

### Phase 5: Verify and Report

After creating all entities, verify the data was created correctly:

```graphql
query {
  openSourceApplication(where: { slug: "appflowy" }) {
    id
    name
    slug
    repositoryUrl
    primaryAlternativeTo {
      name
      slug
    }
    capabilities {
      capability {
        name
      }
      isActive
      implementationComplexity
    }
  }
}
```

Report back to the user with:
- What was created (new apps, capabilities)
- What was linked (alternatives, capabilities)
- The URL where they can view the new entry

---

## Tested Curl Commands

**IMPORTANT**: Always prefix curl commands with `set -o noglob;` to prevent glob expansion errors from the `**` in session tokens.

### Query: List Proprietary Applications
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { proprietaryApplications(take: 10) { id name slug description category { name } } }"}'
```

### Query: List Open Source Applications
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { openSourceApplications(take: 10) { id name slug repositoryUrl license githubStars status primaryAlternativeTo { name } } }"}'
```

### Query: List All Categories
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { categories { id name slug } }"}'
```

### Query: List Capabilities
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { capabilities(take: 20) { id name slug category complexity } }"}'
```

### Query: Search for Proprietary App by Slug
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { proprietaryApplications(where: { slug: { equals: \"notion\" } }) { id name slug capabilities { id capability { id name } } } }"}'
```

### Query: Search for Open Source App by Repository URL
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { openSourceApplications(where: { repositoryUrl: { contains: \"github.com/AppFlowy\" } }) { id name slug repositoryUrl } }"}'
```

### Mutation: Create Proprietary Application
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { createProprietaryApplication(data: { name: \"App Name\", slug: \"app-name\", description: \"Description here\", websiteUrl: \"https://example.com\", simpleIconSlug: \"icon-slug\", simpleIconColor: \"#000000\", category: { connect: { id: \"CATEGORY_ID\" } } }) { id name slug } }"}'
```

### Mutation: Create Open Source Application
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { createOpenSourceApplication(data: { name: \"App Name\", slug: \"app-name\", description: \"Description\", repositoryUrl: \"https://github.com/owner/repo\", websiteUrl: \"https://example.com\", license: \"MIT\", githubStars: 1000, githubForks: 100, githubIssues: 50, status: \"active\", primaryAlternativeTo: { connect: { id: \"PROPRIETARY_APP_ID\" } } }) { id name slug } }"}'
```

### Mutation: Create Capability
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { createCapability(data: { name: \"Feature Name\", slug: \"feature-name\", description: \"What it does\", category: \"other\", complexity: \"intermediate\" }) { id name slug } }"}'
```

### Mutation: Create Proprietary Capability Junction
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { createProprietaryCapability(data: { proprietaryApplication: { connect: { id: \"PROP_APP_ID\" } }, capability: { connect: { id: \"CAP_ID\" } }, isActive: true }) { id } }"}'
```

### Mutation: Create Open Source Capability Junction
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { createOpenSourceCapability(data: { openSourceApplication: { connect: { id: \"OS_APP_ID\" } }, capability: { connect: { id: \"CAP_ID\" } }, isActive: true, implementationComplexity: \"intermediate\", implementationNotes: \"How it works\", githubPath: \"src/feature\", documentationUrl: \"https://docs.example.com\" }) { id } }"}'
```

### Mutation: Create Category
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { createCategory(data: { name: \"Category Name\", slug: \"category-name\", description: \"What this category covers\" }) { id name slug } }"}'
```

**Tips:**
- Always use `set -o noglob;` before curl to prevent `**` glob expansion
- Escape double quotes in JSON with `\"`
- Use `| jq .` at the end to format JSON responses
- Replace `YOUR_SESSION_TOKEN` with the actual token from authentication

---

## Slug Conventions

Always use lowercase, hyphen-separated slugs:
- "Screen Studio" → `screen-studio`
- "VS Code" → `vs-code`  
- "OBS Studio" → `obs-studio`
- "Rich Text Editor" → `rich-text-editor`

---

## Finding Icons

1. Go to https://simpleicons.org
2. Search for the brand name
3. The slug is the lowercase name shown (e.g., "notion", "figma")
4. The color is shown in hex format (e.g., "#000000")

If no icon exists:
- Set `simpleIconSlug` to `null`
- Set `simpleIconColor` to a brand-appropriate color

---

## Status Values for Open Source Apps

- `active` - Actively maintained, regular commits
- `beta` - In development, not production-ready
- `maintenance` - Stable but minimal new development
- `deprecated` - No longer maintained, archived

---

## Complexity Levels

- `basic` - Simple to implement, few dependencies, well-documented
- `intermediate` - Moderate complexity, some setup required
- `advanced` - Complex implementation, many dependencies, steep learning curve

---

## Error Handling

### Authentication Issues
- If requests return empty or 401, the session may have expired
- Re-authenticate to get a new session token

### Duplicate Slug Errors
- Always query existing records before creating
- If a slug exists, use the existing record's ID

### Missing Relationships
- Create parent entities before children
- Categories and Capabilities must exist before linking

---

## Example: Complete Flow

**User says:** "I found an open source alternative to Screen Studio called OBS Studio"

**AI workflow:**

1. **Research OBS Studio** (GitHub: obsproject/obs-studio)
   - Stars: 55,000+
   - License: GPL-2.0
   - Features: Screen recording, streaming, scene composition, audio mixing
   - Status: active

2. **Research Screen Studio** (proprietary)
   - Website: screen.studio
   - Features: Screen recording, zoom effects, auto-crop, smooth animations
   - Category: Media/Productivity

3. **Check existing records**
   - Query for "Screen Studio" → not found
   - Query for "OBS Studio" → not found
   - Query for capabilities like "screen-recording" → may exist

4. **Create entities in order:**
   - Create/find Category "Media Tools"
   - Create ProprietaryApplication "Screen Studio"
   - Create Capabilities: Screen Recording, Video Export, Audio Recording
   - Link Screen Studio to capabilities via ProprietaryCapability
   - Create OpenSourceApplication "OBS Studio" linked to Screen Studio
   - Link OBS Studio to capabilities via OpenSourceCapability with implementation details

5. **Verify and report:**
   - Show the user what was created
   - Provide link: https://opensource.builders/alternatives/screen-studio

---

## Summary Checklist

Before marking the task complete, verify:

- [ ] Authenticated with valid session token
- [ ] Researched the open source project (GitHub stats, features, license)
- [ ] Researched the proprietary app (if new)
- [ ] Checked for existing records (no duplicates)
- [ ] Created entities in correct order (categories → apps → capabilities → junctions)
- [ ] Used proper slugs (lowercase, hyphenated)
- [ ] Set appropriate status and complexity values
- [ ] Linked open source app to proprietary app via `primaryAlternativeTo`
- [ ] Added capability junctions for both apps
- [ ] Verified data was created correctly
- [ ] Reported results to user
