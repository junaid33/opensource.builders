# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Build Keystone + migrate + start Next.js dev server
- `npm run build` - Build Keystone + migrate + build Next.js for production
- `npm run start` - Start production Next.js server
- `npm run lint` - Run ESLint code quality checks
- `npm run migrate:gen` - Generate and apply new database migrations
- `npm run migrate` - Deploy existing migrations to database

## Architecture Overview

This is an **open source software directory** built with Next.js 15 + KeystoneJS 6, featuring a **dual dashboard architecture**:

- **Backend**: KeystoneJS 6 provides GraphQL API, authentication, and database operations
- **Frontend**: Two parallel admin interfaces sharing the same backend
  - `dashboard/` - Original KeystoneJS implementation (feature-complete)
  - `dashboard2/` - Refactored implementation (work in progress)
- **Public Site**: Landing page with tool directory (`features/landing/`)

## Key Directories

- `features/keystone/` - Backend configuration
  - `models/` - Keystone list definitions for tools, categories, features, etc.
  - `access.ts` - Role-based permission logic
  - `mutations/` - Custom GraphQL mutations
  - `utils/` - Logo resolution and utility functions

- `features/dashboard/` - Original admin interface
  - `actions/` - Server actions for data operations
  - `components/` - Reusable UI components
  - `screens/` - Page-level components
  - `views/` - Field type implementations (extensive KeystoneJS field system)

- `features/dashboard2/` - Refactored admin interface (in development)
  - More modular architecture with improved TypeScript
  - `keystone-source-study/` - Analysis of KeystoneJS internals

- `features/landing/` - Public-facing directory
  - `components/` - Tool cards, alternatives lists, hero sections
  - `screens/` - Landing page implementation

- `app/` - Next.js App Router with parallel routes for both dashboards
- `components/` - Shared UI components (Radix primitives, shadcn/ui)

## Data Models & Relationships

**Primary Models**:
- `Tool` - Open source software entries with metadata, logos, relationships
- `Category` - Tool categorization system
- `Feature` - Software features/capabilities
- `Alternative` - Proprietary/open source alternative relationships
- `TechStack` - Technology stack associations
- `Flow` - User journey/workflow associations
- `DeploymentOption` - Hosting and deployment methods

**Junction Models**: `ToolFeature`, `ToolTechStack`, `ToolFlow` for many-to-many relationships

**Auth Models**: `User`, `Role` with sophisticated permission system

**Permission System**: Role-based access control with granular permissions:
- `canAccessDashboard`, `canManagePeople`, `canManageRoles`  
- `canManageTools`, `canManageCategories`
- `canSeeOtherPeople`, `canEditOtherPeople`

## Architecture Patterns

**Field Controller Pattern**: KeystoneJS uses field controllers that handle data serialization, validation, GraphQL selection building, and React rendering.

**Conditional Field Modes**: Fields change behavior based on user permissions, other field values, and create/update context.

**GraphQL Integration**: Dynamic query building from field controllers with SWR for client-side data fetching.

**Logo Resolution System**: Intelligent logo handling with fallback to generated letter avatars (`features/keystone/utils/logo-resolver.ts`).

**Dual Dashboard Pattern**: Two parallel admin interfaces allow for incremental refactoring while maintaining functionality.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: KeystoneJS 6, Prisma ORM, PostgreSQL  
- **UI**: Radix UI primitives, Tailwind CSS 4, Lucide React icons, shadcn/ui components
- **Data**: GraphQL (GraphQL Yoga), SWR for client state
- **Tools**: ESLint, motion-primitives for animations

## Development Notes

- GraphQL endpoint available at `/api/graphql`
- Both dashboards share the same Keystone backend
- Use server actions for data mutations in dashboard components
- Field implementations follow KeystoneJS controller patterns
- Permission checks integrated throughout the UI layer
- The `views/` directories contain extensive field type implementations - understand the controller pattern before modifying
- Logo resolution handles URL, SVG, and generated letter avatars automatically
- Database migrations are handled via Prisma - always run `migrate:gen` after schema changes

## Current Project Status

**Database State (as of 2025-06-25)**:
- **167 tools** loaded with full metadata and relationships
- **Alternative relationships** established (NocoDB↔Airtable, RustDesk↔TeamViewer, etc.)
- **Logo SVGs** integrated from mock data where available
- **Features**: 90+ features across categories (some cleanup needed)
- **Flows**: 90+ flows (many redundant, recommend simplifying to features only)

**Next Phase - UI Data Integration**:
- Replace mock data in landing page with real GraphQL queries
- `ProprietarySoftware.tsx` - currently uses hardcoded `proprietarySoftware` array
- `AlternativesQuery.tsx` - currently uses hardcoded `mockAlternatives` array
- Add feature/similarity scoring to alternative cards

**Recommendation - Data Model Simplification**:
Consider dropping complex "flows" in favor of simple **similarity scores (1-10)** plus **key differentiators**:
- Example: "WooCommerce vs Shopify: 8/10 similarity"
- Missing features clearly listed: "Hosted solution, Advanced analytics"
- More user-friendly than tracking 90+ complex flows with personas/difficulty