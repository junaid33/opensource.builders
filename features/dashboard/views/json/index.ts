/**
 * json field type
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

 
