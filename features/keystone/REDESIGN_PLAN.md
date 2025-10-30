# Keystone V2 Model Redesign Plan

## Overview
This redesign focuses on simplifying our data models to support three core functionalities:
1. **Find open source alternatives** to proprietary applications  
2. **Compare capabilities** between applications with clear feature matching
3. **Build page** for selecting applications and their capabilities for AI prompts

## Current Problems Being Solved

### 1. AI Tool Confusion
**Problem**: Current `Tool` model name conflicts with MCP AI tools, causing confusion in prompts
**Solution**: Rename `Tool` → `Application` 

### 2. Feature Matching Issues  
**Problem**: Complex `qualityScore` system causes "0 out of 36 features" display issues on homepage
**Current Logic**: Uses `qualityScore` and `verified` fields that are often incomplete
**Solution**: Simplify to capability presence/absence with implementation complexity

### 3. Deployment Model Complexity
**Problem**: `DeploymentOption` model adds unnecessary complexity 
**Solution**: Remove entirely - not needed for core functionalities

### 4. Build Page Enhancement Needs
**Problem**: Generic feature descriptions don't help users understand implementation
**Solution**: Add `githubPath` to link directly to implementing code

## New Model Architecture - Proprietary vs Open Source Split

### Key Insight: Separate Proprietary and Open Source Models
**Problem with current single `Tool` model**: 
- Bagisto (open source) is alternative to Shopify, BigCommerce, Webflow, etc.
- Currently need separate Tool records for each proprietary app
- Creates data duplication and maintenance overhead

**Solution**: Split into dedicated models with clear purposes

### 1. ProprietaryApplication Model
**Purpose**: Represents proprietary tools that users want alternatives to (homepage focus)

```typescript
interface ProprietaryApplication {
  id: string
  name: string // "Shopify", "Notion", "GitHub"
  slug: string 
  description: string
  
  // Visual identity for homepage:
  websiteUrl?: string
  simpleIconSlug?: string
  simpleIconColor?: string
  
  // Categorization:
  category: Category
  
  // Capabilities this proprietary app has (for comparison):
  capabilities: ProprietaryCapability[]
  
  // What open source tools are alternatives:
  alternatives: Alternative[] // Points to OpenSourceApplication
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

**What this model is for**:
- Homepage proprietary app selection  
- Displaying "Find alternatives to X"
- Capability comparison baseline
- Clean, minimal data focused on user selection

### 2. OpenSourceApplication Model  
**Purpose**: Rich open source tools with implementation details (build page focus)

```typescript
interface OpenSourceApplication {
  id: string
  name: string // "Bagisto", "AppFlowy", "GitLab" 
  slug: string
  description: string
  
  // Open source specific fields:
  repositoryUrl: string // Always present for open source
  license?: string
  githubStars?: number
  githubForks?: number
  githubLastCommit?: DateTime
  status: ApplicationStatus // Active, Maintenance, Deprecated
  
  // Visual identity:
  websiteUrl?: string
  simpleIconSlug?: string
  simpleIconColor?: string
  
  // Rich capabilities for build page:
  capabilities: OpenSourceCapability[]
  
  // What proprietary apps this is alternative to:
  alternativeTo: Alternative[] // Points to ProprietaryApplication
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

**What this model is for**:
- Build page application selection
- Rich capability data with GitHub links
- Implementation complexity and notes
- GitHub integration and activity tracking

**What Works Well Currently**: 
- Basic app metadata (name, description, icons)
- GitHub integration for stars/activity
- Category organization
- isOpenSource flag for filtering

**What We're Improving**:
- Clear naming (Application vs Tool)
- Simplified relationships
- Better alternative tracking

### 3. Simplified Capability Models

#### ProprietaryCapability Model
**Purpose**: What capabilities a proprietary app has (for percentage calculations)

```typescript
interface ProprietaryCapability {
  id: string
  proprietaryApplication: ProprietaryApplication
  capability: Capability
  
  // Simple tracking:
  isActive: boolean // Does this proprietary app have this capability?
  
  createdAt: DateTime
}
```

#### OpenSourceCapability Model  
**Purpose**: What capabilities an open source app has + implementation details

```typescript
interface OpenSourceCapability {
  id: string
  openSourceApplication: OpenSourceApplication
  capability: Capability
  
  // Basic status:
  isActive: boolean // Does this open source app have this capability?
  
  // Rich implementation details for build page:
  implementationNotes?: string
  githubPath?: string // "src/auth/providers/google.ts" 
  documentationUrl?: string
  implementationComplexity: ImplementationComplexity
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 4. Capability Model (renamed from Feature)
**Purpose**: Represents what applications can do (authentication, payments, etc.)

```typescript
// Current Feature model issues:
- Generic descriptions don't help with implementation
- FeatureType enum not well utilized
- No link to actual implementation code

// New Capability model:
interface Capability {
  id: string
  name: string // "User Authentication", "Payment Processing"
  slug: string // "user-authentication", "payment-processing"  
  description: string // Clear description of what this does
  
  // New fields for build page:
  category: CapabilityCategory // AUTH, PAYMENT, STORAGE, etc.
  complexity: ImplementationComplexity // BASIC, INTERMEDIATE, ADVANCED
  
  // Relationships:
  applications: ApplicationCapability[] // Which apps have this capability
  
  createdAt: DateTime
  updatedAt: DateTime
}

enum CapabilityCategory {
  AUTHENTICATION = "authentication"
  PAYMENT = "payment" 
  STORAGE = "storage"
  COMMUNICATION = "communication"
  ANALYTICS = "analytics"
  UI_COMPONENTS = "ui_components"
  // ... more categories
}

enum ImplementationComplexity {
  BASIC = "basic"         // Simple to implement
  INTERMEDIATE = "intermediate"  // Moderate complexity
  ADVANCED = "advanced"   // Complex implementation
}
```

**What We're Improving**:
- Clearer naming (Capability vs Feature)
- Better categorization for build page
- Complexity levels for AI prompts

### 5. Simplified Alternative Relationship - Virtual Field Approach
**Key Insight**: Each open source app connects to ONE primary proprietary alternative

```typescript
interface OpenSourceApplication {
  id: string
  name: string 
  slug: string
  description: string
  
  // Direct connection to ONE proprietary app:
  primaryAlternativeTo: ProprietaryApplication  // Bagisto → Shopify
  
  // Virtual fields calculated from connected proprietary app:
  matchingCapabilitiesCount: Int    // Virtual field
  totalCapabilitiesCount: Int       // Virtual field  
  capabilityPercentage: Int         // Virtual field (0-100)
  
  // Other fields...
  repositoryUrl: string
  githubStars?: number
  capabilities: OpenSourceCapability[]
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

## **Homepage Percentage Calculation - VIRTUAL FIELD APPROACH**

### Virtual Field Implementation (Keystone.js):
```typescript
// In OpenSourceApplication model:
export const OpenSourceApplication = list({
  fields: {
    name: text({ validation: { isRequired: true } }),
    slug: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    
    // Direct connection to primary proprietary alternative:
    primaryAlternativeTo: relationship({
      ref: 'ProprietaryApplication.openSourceAlternatives',
      ui: { displayMode: 'select' }
    }),
    
    // Virtual fields for homepage display:
    matchingCapabilitiesCount: virtual({
      field: graphql.field({
        type: graphql.Int,
        resolve: async (item, args, context) => {
          const openSourceApp = await context.query.OpenSourceApplication.findOne({
            where: { id: item.id },
            query: {
              capabilities: {
                where: { isActive: { equals: true } },
                query: { capability: { id: true } }
              },
              primaryAlternativeTo: {
                capabilities: {
                  where: { isActive: { equals: true } },
                  query: { capability: { id: true } }
                }
              }
            }
          })
          
          if (!openSourceApp?.primaryAlternativeTo) return 0
          
          const proprietaryCapIds = openSourceApp.primaryAlternativeTo.capabilities.map(c => c.capability.id)
          const matchingCount = openSourceApp.capabilities.filter(osc => 
            proprietaryCapIds.includes(osc.capability.id)
          ).length
          
          return matchingCount
        }
      })
    }),
    
    totalCapabilitiesCount: virtual({
      field: graphql.field({
        type: graphql.Int,
        resolve: async (item, args, context) => {
          const openSourceApp = await context.query.OpenSourceApplication.findOne({
            where: { id: item.id },
            query: {
              primaryAlternativeTo: {
                capabilities: {
                  where: { isActive: { equals: true } },
                  query: { id: true }
                }
              }
            }
          })
          
          return openSourceApp?.primaryAlternativeTo?.capabilities.length || 0
        }
      })
    }),
    
    capabilityPercentage: virtual({
      field: graphql.field({
        type: graphql.Int,
        resolve: async (item, args, context) => {
          // Get the other virtual fields we just calculated
          const matching = await context.query.OpenSourceApplication.findOne({
            where: { id: item.id },
            query: { matchingCapabilitiesCount: true, totalCapabilitiesCount: true }
          })
          
          const total = matching?.totalCapabilitiesCount || 0
          const matches = matching?.matchingCapabilitiesCount || 0
          
          return total > 0 ? Math.round((matches / total) * 100) : 0
        }
      })
    })
  }
})
```

### Why Virtual Fields Fix Everything:
1. **No complex queries**: Homepage just reads `capabilityPercentage: 94`
2. **Always reliable**: Calculated from actual data relationships  
3. **Automatic updates**: Recalculated when capabilities change
4. **No 0/36 issues**: Always returns valid numbers
5. **Simple frontend**: No complex filtering logic needed

### Homepage Usage (Super Simple):
```typescript
// GraphQL query becomes trivial:
query GetAlternativesTo($proprietarySlug: String!) {
  proprietaryApplication(where: { slug: $proprietarySlug }) {
    name
    openSourceAlternatives {
      id
      name
      slug
      githubStars
      simpleIconSlug
      simpleIconColor
      
      # Virtual fields - calculated automatically:
      matchingCapabilitiesCount    # 34
      totalCapabilitiesCount       # 36  
      capabilityPercentage         # 94
    }
  }
}

// Frontend display code:
const { matchingCapabilitiesCount, totalCapabilitiesCount, capabilityPercentage } = openSourceApp
return <div>{matchingCapabilitiesCount}/{totalCapabilitiesCount} ({capabilityPercentage}%)</div>
// Displays: "34/36 (94%)"
```

### Example Data Structure:
```
Shopify (ProprietaryApplication):
├── id: "shopify-1"
├── capabilities: [cap1, cap2, cap3... cap36] (36 total)
└── openSourceAlternatives: [bagisto, woocommerce, medusa]

Bagisto (OpenSourceApplication):
├── id: "bagisto-1"  
├── primaryAlternativeTo: → shopify-1
├── capabilities: [cap1, cap2, cap4... cap34] (matches 34/36)
└── VIRTUAL FIELDS (auto-calculated):
    ├── matchingCapabilitiesCount: 34
    ├── totalCapabilitiesCount: 36
    └── capabilityPercentage: 94
```

### 6. ApplicationCapability Model (renamed from ToolFeature)
**Purpose**: Links applications to their capabilities with implementation details

```typescript
// Current ToolFeature issues:
- QualityScore (1-10) causes 0/36 display issues
- Verified boolean not consistently used
- No link to actual implementation

// New ApplicationCapability model:
interface ApplicationCapability {
  id: string
  
  // Core relationships:
  application: Application
  capability: Capability
  
  // Implementation details for build page:
  implementationNotes?: string // How this app implements the capability
  githubPath?: string // Direct link to code: "github.com/supabase/auth/blob/main/src/auth.ts"
  documentationUrl?: string // Link to docs for this capability
  
  // Complexity and status:
  implementationComplexity: ImplementationComplexity
  isActive: boolean // Simply: does this app currently support this capability?
  
  // Metadata:
  lastVerified?: DateTime // When we last checked this capability exists
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Homepage Logic Fix**:
```typescript
// OLD (causing 0/36 issues):
const matchingFeatures = openSourceApp.features.filter(f => f.qualityScore >= 7 && f.verified)
const totalFeatures = proprietaryApp.features.filter(f => f.qualityScore >= 7 && f.verified)

// NEW (simple and reliable):
const proprietaryCapabilities = proprietaryApp.capabilities.filter(c => c.isActive)
const matchingCapabilities = openSourceApp.capabilities.filter(oc => 
  oc.isActive && proprietaryCapabilities.some(pc => pc.capability.id === oc.capability.id)
)
// Display: `${matchingCapabilities.length}/${proprietaryCapabilities.length} capabilities`
```

**Build Page Enhancement**:
```typescript
// Generate better AI prompts with direct code links:
if (appCapability.githubPath) {
  prompt += `See implementation at: ${appCapability.githubPath}`
}
```

### 4. Alternative Model (keep mostly the same)
**Purpose**: Represents relationships between proprietary and open source applications

```typescript
// Current model works well, minor improvements:
interface Alternative {
  id: string
  
  proprietaryTool: Application // renamed relationship
  openSourceTool: Application  // renamed relationship
  
  similarityScore: Float // Keep this - works well for homepage %
  comparisonNotes: String // Keep this - good for detailed comparisons
  
  // Optional enhancements:
  lastUpdated?: DateTime // When comparison was last reviewed
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

**What Works Well Currently**:
- `similarityScore` drives the percentage display on homepage
- `comparisonNotes` provides detailed comparison context
- Clear one-to-one relationships

### 5. Category Model (keep the same)
**Purpose**: Organize applications into categories

```typescript
// Current model works perfectly:
interface Category {
  id: string
  name: string // "E-commerce Platforms", "Development Tools"
  description: string
  slug: string
  
  applications: Application[] // renamed from tools
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

**What Works Well Currently**:
- Good category structure
- Clear descriptions
- Proper relationships

## Model Changes Summary

| Current Model | New Model | Key Changes |
|---------------|-----------|-------------|
| `Tool` | `Application` | Rename to avoid AI tool confusion |
| `Feature` | `Capability` | Rename + add complexity levels |
| `ToolFeature` | `ApplicationCapability` | Remove qualityScore, add githubPath |
| `Alternative` | `Alternative` | Update relationship names only |
| `Category` | `Category` | Update relationship names only |
| `DeploymentOption` | **REMOVED** | Not needed for core functionality |

## Database Migration Strategy

### Phase 1: Create New Models
1. Create new models alongside existing ones
2. Migrate data from old models to new models
3. Update GraphQL schema gradually

### Phase 2: Update Frontend
1. Update all queries to use new field names
2. Fix homepage capability counting logic
3. Enhance build page with new fields

### Phase 3: Cleanup
1. Remove old models after migration complete
2. Remove unused DeploymentOption references
3. Update any remaining Tool/Feature references

## GraphQL Query Examples

### Homepage Alternatives Display
```graphql
query GetAlternatives($proprietarySlug: String!) {
  alternatives(where: { 
    proprietaryTool: { slug: { equals: $proprietarySlug } } 
  }) {
    id
    similarityScore
    comparisonNotes
    openSourceTool {
      id
      name
      slug
      description
      simpleIconSlug
      simpleIconColor
      capabilities(where: { isActive: { equals: true } }) {
        capability {
          id
          name
        }
      }
    }
    proprietaryTool {
      capabilities(where: { isActive: { equals: true } }) {
        capability {
          id  
          name
        }
      }
    }
  }
}
```

### Build Page Application Search
```graphql
query SearchApplications($search: String!) {
  applications(where: {
    OR: [
      { name: { contains: $search, mode: insensitive } }
      { description: { contains: $search, mode: insensitive } }
    ]
    isOpenSource: { equals: true }
  }) {
    id
    name
    slug
    description
    repositoryUrl
    capabilities(where: { isActive: { equals: true } }) {
      id
      implementationNotes
      githubPath
      documentationUrl
      implementationComplexity
      capability {
        id
        name
        description
        category
        complexity
      }
    }
  }
}
```

## Files to Update

### Models Directory (`features/keystone-v2/models/`)
- [x] Copy existing models
- [ ] Rename `Tool.ts` → `Application.ts`
- [ ] Rename `Feature.ts` → `Capability.ts` 
- [ ] Rename `ToolFeature.ts` → `ApplicationCapability.ts`
- [ ] Update `Alternative.ts` relationship names
- [ ] Update `Category.ts` relationship names
- [ ] Remove `DeploymentOption.ts`
- [ ] Update `index.ts` exports

### Access Control (`features/keystone-v2/access.ts`)
- [ ] Update permission names:
  - `canManageTools` → `canManageApplications`
  - `canManageFeatures` → `canManageCapabilities`
  - Remove `canManageDeploymentOptions`

### Mutations (`features/keystone-v2/mutations/`)
- [ ] Update any custom mutations to use new model names

This redesign will solve the homepage display issues, eliminate AI tool naming conflicts, enhance the build page functionality, and simplify the overall architecture while maintaining all the current functionality that works well.