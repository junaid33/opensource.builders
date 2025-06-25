/**
 * Field Views Registry - Following Keystone's exact pattern
 * Maps viewsIndex to field implementations
 */

import * as text from './text'
import * as id from './id'
import * as password from './password'
import * as relationship from './relationship'
import * as checkbox from './checkbox'
import * as document from './document'
import * as integer from './integer'
import * as bigInt from './bigInt'
import * as float from './float'
import * as decimal from './decimal'
import * as select from './select'
import * as timestamp from './timestamp'
import * as json from './json'

// Type definition matching Keystone exactly
export type FieldViews = Record<
  number,
  {
    Field: React.ComponentType<any>
    Cell: React.ComponentType<any>
    CardValue: React.ComponentType<any>
    controller: (config: any) => any
  }
>

// Field views array indexed by viewsIndex - matching your mapping exactly
export const fieldViews: FieldViews = {
  0: id,        // id
  1: text,      // text  
  2: password,  // password
  3: relationship, // relationship
  4: checkbox,  // checkbox
  5: document,  // document
  6: integer,   // integer
  7: bigInt,    // bigInt
  8: float,     // float
  9: decimal,   // decimal
  10: select,   // select
  11: timestamp, // timestamp
  12: json,     // json
}

/**
 * Get field implementation by viewsIndex - following Keystone pattern
 */
export function getFieldViews(viewsIndex: number) {
  const views = fieldViews[viewsIndex]
  if (!views) {
    throw new Error(`Field views for index ${viewsIndex} not found`)
  }
  return views
}

/**
 * Validate field views have required exports - following Keystone validation
 */
const expectedExports = new Set(['Field', 'controller'])

export function validateFieldViews() {
  for (const [viewsIndex, views] of Object.entries(fieldViews)) {
    for (const exportName of expectedExports) {
      if (!(views as any)[exportName]) {
        throw new Error(
          `Field view at index ${viewsIndex} is missing the ${exportName} export`
        )
      }
    }
  }
}

// Run validation on import
validateFieldViews()