# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Development Issue ⚠️

**IMPORTANT**: The GraphQL API running on localhost:3000 is currently serving a Medusa e-commerce schema instead of the expected open source directory schema. This causes all frontend queries to fail.

**Expected Schema**: Tool, Category, Feature, Alternative, DeploymentOption models
**Actual Running**: Medusa e-commerce schema (Product, Order, Payment, etc.)

**Solution**: The API should be running on localhost:3003 (as mentioned by user). Check that:
1. Correct Keystone application is running on port 3003
2. Frontend queries point to the correct port
3. Database migrations are deployed to correct database

## Development Commands

- `npm run dev` - Build Keystone + migrate + start Next.js dev server
- `npm run build` - Build Keystone + migrate + build Next.js for production  
- `npm run start` - Start production Next.js server
- `npm run lint` - Run ESLint code quality checks
- `npm run migrate:gen` - Generate and apply new database migrations
- `npm run migrate` - Deploy existing migrations to database

## Architecture Overview

This is an **open source software directory** built with **Next.js 15 + KeystoneJS 6**, featuring a **dual dashboard architecture**:

- **Backend**: KeystoneJS 6 provides GraphQL API, authentication, and database operations
- **Frontend**: Two parallel admin interfaces sharing the same backend
  - `dashboard/` - Original KeystoneJS implementation (feature-complete)
  - `dashboard2/` - Refactored implementation (work in progress)
- **Public Site**: Landing page with tool directory (`features/landing/`)

**Current Issue**: Landing page shows "only Shopify alternatives" because API queries are failing due to schema mismatch.

## Key Directories

- `features/keystone/` - Backend configuration
  - `models/` - Keystone list definitions (Tool, Category, Feature, Alternative, DeploymentOption)
  - `access.ts` - Role-based permission logic
  - `mutations/` - Custom GraphQL mutations
  - `utils/logo-resolver.ts` - Logo resolution and utility functions

- `features/dashboard/` - Original admin interface (feature-complete)
  - `actions/` - Server actions for data operations
  - `components/` - Reusable UI components
  - `screens/` - Page-level components
  - `views/` - Field type implementations (extensive KeystoneJS field system)

- `features/dashboard2/` - Refactored admin interface (work in progress)
  - More modular architecture with improved TypeScript
  - `keystone-source-study/` - Analysis of KeystoneJS internals

- `features/landing/` - Public-facing directory
  - `components/` - Tool cards, alternatives lists, hero sections
  - `screens/` - Landing page implementation
  - **Issue**: `AlternativesQuery.tsx` and `ProprietarySoftware.tsx` have hardcoded fallbacks due to API schema mismatch

- `app/` - Next.js App Router with parallel routes for both dashboards
- `components/` - Shared UI components (Radix primitives, shadcn/ui)

## Data Models & Relationships

**Core Models**:
- `Tool` - Open source software entries with metadata, logos, relationships
- `Category` - Tool categorization system  
- `Feature` - Software features/capabilities
- `Alternative` - Proprietary ↔ open source alternative relationships
- `DeploymentOption` - Hosting and deployment methods

**Junction Models**: 
- `ToolFeature` - Many-to-many tools ↔ features with implementation notes and quality scores

**Auth Models**: 
- `User`, `Role` with sophisticated permission system

**Permission System**: Role-based access control with granular permissions:
- `canAccessDashboard`, `canManagePeople`, `canManageRoles`  
- `canManageTools`, `canManageCategories`, `canManageFeatures`
- `canManageAlternatives`, `canManageDeploymentOptions`

## GraphQL API & Client Integration

**API Endpoint**: `/api/graphql` (should be on port 3003, currently wrong schema on 3000)

**Key Query Patterns**:
```graphql
# Get tools with relationships
tools {
  id name slug description isOpenSource
  category { name }
  features { feature { name featureType } }
  proprietaryAlternatives { proprietaryTool { name } }
  openSourceAlternatives { openSourceTool { name } }
}

# Get alternatives for specific proprietary tool
alternatives(where: { 
  proprietaryTool: { name: { equals: $softwareName } } 
}) {
  openSourceTool { name slug description }
  similarityScore
}
```

**Client Library**: `features/landing/lib/osbClient.ts` handles GraphQL requests with error handling

## Architecture Patterns

**Field Controller Pattern**: KeystoneJS uses field controllers for data serialization, validation, GraphQL selection building, and React rendering.

**Conditional Field Modes**: Fields change behavior based on user permissions, other field values, and create/update context.

**Logo Resolution System**: Intelligent logo handling with fallback to generated letter avatars (`features/keystone/utils/logo-resolver.ts`).

**Dual Dashboard Pattern**: Two parallel admin interfaces allow for incremental refactoring while maintaining functionality.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: KeystoneJS 6, Prisma ORM, PostgreSQL  
- **UI**: Radix UI primitives, Tailwind CSS 4, Lucide React icons, shadcn/ui components
- **Data**: GraphQL (GraphQL Yoga), SWR for client state
- **Tools**: ESLint, Framer Motion for animations

## Current Project Status

**Database Schema State**:
- **167 tools** loaded with full metadata and relationships (per existing CLAUDE.md)
- **Alternative relationships** established (NocoDB↔Airtable, RustDesk↔TeamViewer, etc.)
- **Logo SVGs** integrated from mock data where available
- **Features**: 90+ features across categories
- **Schema**: Defined in `schema.prisma` with proper Tool/Category/Feature models

**Critical Issue - Schema Mismatch**:
- Prisma schema defines correct open source directory models
- Running API serves different (Medusa e-commerce) schema
- Frontend queries fail, causing "only Shopify alternatives" display
- Scripts in `/scripts` directory expect correct schema but fail with current API

**Next Phase - Fix API Schema**:
1. Ensure correct Keystone application runs on port 3003
2. Update frontend to query correct endpoint
3. Deploy database migrations if needed
4. Test that `AlternativesQuery.tsx` can fetch real data

## Development Scripts

The `/scripts` directory contains data analysis and management tools:
- `analyze-tool-data.ts` - Analyze tool data structure (currently fails due to schema mismatch)
- `check-actual-data.ts` - Diagnose schema mismatch issues
- `introspect-schema.ts` - GraphQL schema introspection
- Various e-commerce data scripts (may be outdated)

## Debugging Schema Issues

1. **Check running services**: Ensure correct Keystone app on port 3003
2. **Verify database**: Run `npm run migrate` to deploy schema
3. **Test API**: Use `npx tsx check-actual-data.ts` to diagnose schema
4. **Update endpoints**: Frontend may need to point to :3003 instead of :3000

## Key Files for Schema Resolution

- `keystone.ts` - Main Keystone entry point
- `features/keystone/index.ts` - Keystone configuration
- `features/keystone/models/` - All data model definitions
- `schema.prisma` - Generated Prisma schema (correct models)
- `features/landing/lib/osbClient.ts` - GraphQL client (may need endpoint update)