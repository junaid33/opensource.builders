# CLAUDE.md - Open Source Builders AI Assistant Guide

**⚠️ AUTHENTICATION REQUIRED**: When using this guide, you must provide:
1. **API Endpoint**: The GraphQL endpoint URL
2. **Session Cookie**: Your KeystoneJS session cookie

## Quick Start for AI Assistants

### Essential First Steps
1. **Always start by checking current data** - Run discovery queries to understand existing tools/categories
2. **Verify authentication** - Check if session cookie is valid
3. **Research before creating** - Use search queries to avoid duplicates
4. **Follow the workflow** - Discovery → Validation → Creation → Verification

---

## 🔍 DISCOVERY QUERIES (Run These First)

### Check Authentication Status
```graphql
query CheckAuth {
  authenticatedItem {
    __typename
    ... on User {
      id
      name
      email
      role {
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

### Get All Categories (Essential Reference)
```graphql
query GetAllCategories {
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

### Search for Existing Tools (Prevent Duplicates)
```graphql
query SearchTools($searchTerm: String!) {
  tools(where: { 
    OR: [
      { name: { contains: $searchTerm, mode: insensitive } }
      { slug: { contains: $searchTerm, mode: insensitive } }
      { description: { contains: $searchTerm, mode: insensitive } }
    ]
  }) {
    id
    name
    slug
    description
    isOpenSource
    websiteUrl
    repositoryUrl
    category {
      name
    }
  }
}
```

### Get Tool Details by Slug
```graphql
query GetToolBySlug($slug: String!) {
  tool(where: { slug: $slug }) {
    id
    name
    slug
    description
    isOpenSource
    websiteUrl
    repositoryUrl
    simpleIconSlug
    simpleIconColor
    license
    githubStars
    githubForks
    githubIssues
    githubLastCommit
    status
    pricingModel
    category {
      id
      name
    }
    features {
      id
      feature {
        id
        name
        description
        featureType
      }
      implementationNotes
      qualityScore
    }
    proprietaryAlternatives {
      id
      proprietaryTool {
        id
        name
        slug
        description
      }
      similarityScore
      notes
    }
    openSourceAlternatives {
      id
      openSourceTool {
        id
        name
        slug
        description
      }
      similarityScore
      notes
    }
  }
}
```

### Get All Features (For Adding to Tools)
```graphql
query GetAllFeatures {
  features {
    id
    name
    description
    featureType
  }
}
```

---

## 🛠️ CREATION MUTATIONS

### Create New Tool
```graphql
mutation CreateTool($data: ToolCreateInput!) {
  createTool(data: $data) {
    id
    name
    slug
    description
    isOpenSource
    websiteUrl
    repositoryUrl
    category {
      name
    }
  }
}
```

**Variables Template**:
```json
{
  "data": {
    "name": "Tool Name",
    "slug": "tool-slug",
    "description": "Comprehensive tool description",
    "isOpenSource": true,
    "websiteUrl": "https://example.com",
    "repositoryUrl": "https://github.com/org/repo",
    "simpleIconSlug": "simpleicons-slug",
    "simpleIconColor": "#000000",
    "license": "MIT",
    "githubStars": 0,
    "githubForks": 0,
    "githubIssues": 0,
    "status": "Active",
    "pricingModel": "Free",
    "category": {
      "connect": { "id": "category-id-here" }
    }
  }
}
```

### Update Existing Tool
```graphql
mutation UpdateTool($where: ToolWhereUniqueInput!, $data: ToolUpdateInput!) {
  updateTool(where: $where, data: $data) {
    id
    name
    slug
    githubStars
    githubForks
    githubLastCommit
  }
}
```

### Create New Category
```graphql
mutation CreateCategory($data: CategoryCreateInput!) {
  createCategory(data: $data) {
    id
    name
    description
  }
}
```

### Create New Feature
```graphql
mutation CreateFeature($data: FeatureCreateInput!) {
  createFeature(data: $data) {
    id
    name
    description
    featureType
  }
}
```

### Add Feature to Tool
```graphql
mutation AddFeatureToTool($data: ToolFeatureCreateInput!) {
  createToolFeature(data: $data) {
    id
    tool {
      name
    }
    feature {
      name
    }
    implementationNotes
    qualityScore
  }
}
```

**Variables Template**:
```json
{
  "data": {
    "tool": { "connect": { "id": "tool-id" } },
    "feature": { "connect": { "id": "feature-id" } },
    "implementationNotes": "How this feature is implemented",
    "qualityScore": 8
  }
}
```

### Create Alternative Relationship
```graphql
mutation CreateAlternative($data: AlternativeCreateInput!) {
  createAlternative(data: $data) {
    id
    proprietaryTool {
      name
    }
    openSourceTool {
      name
    }
    similarityScore
    notes
  }
}
```

---

## 📊 CURRENT DATABASE STATE

### Known Category IDs
- **Development Tools**: `cmbjbh3jp0019e6qfgvz44zgn`
- **API Development**: `[run GetAllCategories to get current ID]`
- **Mobile Development**: `[run GetAllCategories to get current ID]`
- **Gaming & Game Development**: `[run GetAllCategories to get current ID]`

### Featured Proprietary Tools (For Carousel)
- **Shopify** (slug: "shopify")
- **Notion** (slug: "notion")
- **Tailwind Plus** (slug: "tailwind-plus")
- **Cursor** (slug: "cursor")

---

## 🔧 MAINTENANCE QUERIES

### Find Tools Missing GitHub Data
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

### Find Tools Without Categories
```graphql
query ToolsWithoutCategories {
  tools(where: { category: { equals: null } }) {
    id
    name
    slug
    description
    isOpenSource
  }
}
```

### Find Tools Without Features
```graphql
query ToolsWithoutFeatures {
  tools(where: { features: { none: {} } }) {
    id
    name
    slug
    description
    isOpenSource
    category {
      name
    }
  }
}
```

---

## 🎯 COMMON AI TASK WORKFLOWS

### Adding a New Tool
1. **Research**: Search for existing tools with similar names
2. **Validate**: Check if category exists, create if needed
3. **Create**: Use CreateTool mutation with proper data
4. **Enhance**: Add features, GitHub data, alternatives if applicable
5. **Verify**: Query the created tool to confirm all data

### Updating GitHub Data
1. **Discover**: Find tools missing GitHub data
2. **Fetch**: Get GitHub API data for each repository
3. **Update**: Use UpdateTool mutation with new GitHub stats
4. **Verify**: Confirm updates were applied correctly

### Adding Features to Tools
1. **Research**: Check existing features, create new ones if needed
2. **Map**: Identify which tools should have which features
3. **Connect**: Use AddFeatureToTool mutation with quality scores
4. **Verify**: Query tool features to confirm relationships

### Feature Splitting Strategy
When tools have overlapping but different capabilities, split generic features into specific ones:

**Example Problem**: Shopify and Gumroad both "sell products online"
- ❌ Generic: "E-commerce functionality" 
- ✅ Split into: "Sell physical products" vs "Sell digital products"

**Example Problem**: Shopify and NFT platform both handle transactions
- ❌ Generic: "Payment processing"
- ✅ Split into: "Traditional payment processing" vs "Cryptocurrency payments"

**When to Split Features**:
- Two tools have same feature but different implementations
- One tool has limitations the other doesn't
- Different target use cases despite similar functionality
- Quality scores would be significantly different (8+ vs 5-)

**Feature Splitting Process**:
1. Identify the overly broad feature
2. Research specific capabilities of each tool
3. Create 2+ specific features to replace the generic one
4. Update all affected tools with new specific features
5. Remove the old generic feature if no longer needed

---

## 🧠 RESEARCH AI PROMPT TEMPLATE

When you need comprehensive research on a tool before adding it to the database, use this prompt:

```
I need comprehensive research on [TOOL_NAME] for the Open Source Builders directory. Please gather:

**Basic Information:**
- Official name and description
- Website URL
- Repository URL (if open source)
- Current GitHub stars/forks (if applicable)
- License type
- Development status (Active, Maintenance, Deprecated)
- Pricing model (Free, Freemium, Paid, Open Source)

**Categorization:**
- Primary category (Development Tools, API Development, Mobile Development, etc.)
- Key features and capabilities
- Feature quality scores (1-10 scale)

**Integration Data:**
- Simple Icons slug (check https://simpleicons.org/)
- Brand color hex code
- Alternative tools (both proprietary and open source)

**Technical Details:**
- Installation/deployment options
- System requirements
- Integration capabilities
- API availability

**Market Position:**
- Main competitors
- Unique selling points
- Target audience
- Community size/activity

Please format the response as structured data that can be directly used in GraphQL mutations for the Open Source Builders database.
```

---

## 📋 SCHEMA REFERENCE

### Tool Model Complete Fields
```typescript
interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  isOpenSource: boolean;
  websiteUrl?: string;
  repositoryUrl?: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
  license?: string;
  githubStars?: number;
  githubForks?: number;
  githubIssues?: number;
  githubLastCommit?: string;
  status?: string;
  pricingModel?: string;
  category?: Category;
  features?: ToolFeature[];
  proprietaryAlternatives?: Alternative[];
  openSourceAlternatives?: Alternative[];
  deploymentOptions?: DeploymentOption[];
}
```

### Common Status Values
- `"Active"` - Actively maintained
- `"Maintenance"` - Bug fixes only
- `"Deprecated"` - No longer recommended
- `"Beta"` - Pre-release version
- `"Stable"` - Production ready

### Common Pricing Models
- `"Free"` - Completely free
- `"Open Source"` - Free with open source license
- `"Freemium"` - Free tier with paid upgrades
- `"Paid"` - Commercial license required
- `"Enterprise"` - Custom enterprise pricing

---

## 🚨 ERROR HANDLING & COMMON MISTAKES

### Critical: Don't Assume Errors = Access Issues

**MOST ERRORS ARE NOT PERMISSION PROBLEMS** - They're usually:
- Trying to create a tool that already exists
- Trying to create a feature that already exists  
- Trying to create a category that already exists
- Not using `connect` to link existing entities

### Common AI Mistakes and Solutions

**"Tool already exists" errors**:
- **Always search first** using SearchTools query
- If tool exists, update it instead of creating new one
- Check by name, slug, and similar variations

**"Feature already exists" errors**:
- **Always check existing features** using GetAllFeatures query
- Use `connect` to link existing features to tools
- Don't create new features if similar ones exist

**"Category already exists" errors**:
- **Always get categories first** using GetAllCategories query
- Use `connect` to assign existing categories to tools
- Only create new categories if genuinely needed

**Authentication Errors**:
- Verify session cookie is provided and valid
- Check user permissions for the operation

**Duplicate Key Errors**:
- Always search for existing tools/categories first
- Use unique slugs (auto-generate from name if needed)

**Relation Errors**:
- Verify related entities exist before creating relationships
- Use proper `connect` syntax for existing relations
- Use `create` syntax for new nested entities

**GitHub API Rate Limits**:
- Implement delays between requests
- Use authenticated requests for higher limits
- Cache responses to avoid redundant calls

---

## 💡 BEST PRACTICES FOR AI ASSISTANTS

1. **Always query before creating** - Avoid duplicates
2. **Use consistent naming** - Follow existing patterns
3. **Validate relationships** - Ensure referenced entities exist
4. **Provide comprehensive data** - Fill as many fields as possible
5. **Verify operations** - Query created/updated entities to confirm
6. **Handle errors gracefully** - Provide clear error messages
7. **Batch operations** - Group related changes together
8. **Use semantic slugs** - Create meaningful URL identifiers
9. **Maintain data quality** - Regular cleanup and validation
10. **Document changes** - Keep track of what was modified

---

*This guide is designed for AI assistants to efficiently manage the Open Source Builders database. Always start with discovery queries and provide the session cookie when making requests.*