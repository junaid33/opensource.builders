# Relationship Field with SWR

This is an implementation of the Relationship field using SWR for data fetching. SWR provides a lightweight and efficient way to handle data fetching and caching.

## API Integration

This implementation relies on the following:

1. **GraphQL API** - Connects to your GraphQL endpoint at `http://localhost:3000/api/graphql`
2. **getGqlNames function** - Uses the `getGqlNames` function from `lib/get-names-from-list.ts` to dynamically generate the correct GraphQL query names based on the list key
3. **API Key Authentication** - Uses your API key for authentication with the `x-api-key` header

## Components Structure

- **index.tsx**: Main entry point that exports the Field, Cell, and CardValue components and controller.
- **components/RelationshipSelect.tsx**: Component for selecting items in a relationship.
- **components/Cards.tsx**: Component for displaying items in card view.
- **components/CreateItemDrawer.tsx**: Component for creating new items in a relationship.

## Data Fetching Implementation

The implementation uses SWR with these custom hooks:

1. **useListData** - Fetches list metadata and dynamically generates GraphQL query names
2. **useAuthenticatedItem** - Gets the current authenticated user
3. **useRelationshipFilterValues** - Gets filter values for relationships

Each component builds GraphQL queries based on the list's metadata and the generated query names.

## Features

- Uses SWR for data fetching with automatic revalidation
- Supports both "one" and "many" relationship types
- Provides card view and select view modes
- Supports inline editing, linking, and creation of items
- Handles loading and error states
- Proper TypeScript support
- Dynamically generates GraphQL queries based on list keys
- Fallbacks to sensible defaults when metadata is incomplete

## Usage

The components are used by the field controller, which is configured based on the field metadata. The controller provides the necessary props to the Field, Cell, and CardValue components.

### Key Customizations

1. **Data Fetching**: Uses `fetchGraphQL` and `getList` from `lib/graphql` instead of Apollo Client hooks
2. **Custom Hooks**: Implements custom hooks like `useListData` and `useAuthenticatedItem` using SWR
3. **Component Composition**: Separates UI components from data fetching and state management
4. **Relationship Select**: Uses a custom select component with search functionality
5. **Cards View**: Provides a card-based interface for viewing and editing relationships

## Implementing in a New Project

1. Ensure SWR is installed: `npm install swr`
2. Implement the `fetchGraphQL` and `getList` functions in `lib/graphql`
3. Add the components to your project structure
4. Configure the field controller in your field definitions

## Customization

You can customize the appearance and behavior of the components by modifying the CSS classes and component props. The implementation provides a foundation that can be extended to fit your specific requirements. 