/**
 * document field type
 *
 * This file re-exports client, server, and shared implementations
 * to support the unified getField function.
 */

// Import client and server implementations
import * as client from './client'
import * as server from './server'

// Import shared implementations
import * as graphql from './graphql'
import * as filterTypes from './filterTypes'

// Export everything as a single module
export {
  // Client exports
  client,

  // Server exports
  server,

  // Shared exports
  graphql,
  filterTypes
}

// Re-export component-blocks for convenience
export { component, fields, NotEditable } from './client/component-blocks'
export type {
  ArrayField,
  ChildField,
  ComponentBlock,
  ComponentSchema,
  ConditionalField,
  FormField,
  InferRenderersForComponentBlocks,
  ObjectField,
  RelationshipData,
  RelationshipField,
} from './client/component-blocks'

// Re-export structure
export { structure } from './client/structure'

// Re-export relationship-data
export { addRelationshipData } from './client/relationship-data'
