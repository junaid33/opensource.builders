# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Build Keystone + migrate + start Next.js dev server
- `npm run build` - Build Keystone + migrate + build Next.js for production
- `npm run migrate:gen` - Generate and apply new database migrations
- `npm run migrate` - Deploy existing migrations to database

## Architecture Overview

This is a Next.js 15 + KeystoneJS 6 application with a **dual dashboard architecture**:

- **Backend**: KeystoneJS 6 provides GraphQL API, authentication, and database operations
- **Frontend**: Two parallel admin interfaces sharing the same backend
  - `dashboard/` - Original KeystoneJS implementation (feature-complete)
  - `dashboard2/` - Refactored implementation (work in progress)

## Key Directories

- `features/keystone/` - Backend configuration
  - `models/` - Keystone list definitions (User, Role, Todo)
  - `access.ts` - Role-based permission logic
  - `mutations/` - Custom GraphQL mutations

- `features/dashboard/` - Original admin interface
  - `actions/` - Server actions for data operations
  - `components/` - Reusable UI components
  - `screens/` - Page-level components
  - `views/` - Field type implementations

- `features/dashboard2/` - Refactored admin interface (in development)
  - More modular architecture with improved TypeScript

- `app/` - Next.js App Router with parallel routes for both dashboards

## Data Models & Permissions

**Core Models**: User, Role, Todo with sophisticated relationship handling

**Permission System**: Role-based access control with granular permissions:
- `canAccessDashboard`, `canManagePeople`, `canManageRoles`
- `canCreateTodos`, `canManageAllTodos`
- `canSeeOtherPeople`, `canEditOtherPeople`

## Architecture Patterns

**Field Controller Pattern**: KeystoneJS uses field controllers that handle data serialization, validation, GraphQL selection building, and React rendering.

**Conditional Field Modes**: Fields change behavior based on user permissions, other field values, and create/update context.

**GraphQL Integration**: Dynamic query building from field controllers with SWR for client-side data fetching.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: KeystoneJS 6, Prisma ORM, PostgreSQL
- **UI**: Radix UI primitives, Tailwind CSS, Lucide React icons
- **Data**: GraphQL (GraphQL Yoga), SWR for client state

## Development Notes

- GraphQL endpoint available at `/api/graphql`
- Both dashboards share the same Keystone backend
- Use server actions for data mutations in dashboard components
- Field implementations follow KeystoneJS controller patterns
- Permission checks integrated throughout the UI layer