#!/usr/bin/env tsx

/**
 * Introspect the GraphQL schema to understand available types and fields
 */

async function introspectSchema() {
  const introspectionQuery = `
    query IntrospectionQuery {
      __schema {
        queryType { name }
        mutationType { name }
        subscriptionType { name }
        types {
          ...FullType
        }
      }
    }

    fragment FullType on __Type {
      kind
      name
      description
      fields(includeDeprecated: true) {
        name
        description
        args {
          ...InputValue
        }
        type {
          ...TypeRef
        }
        isDeprecated
        deprecationReason
      }
      inputFields {
        ...InputValue
      }
      interfaces {
        ...TypeRef
      }
      enumValues(includeDeprecated: true) {
        name
        description
        isDeprecated
        deprecationReason
      }
      possibleTypes {
        ...TypeRef
      }
    }

    fragment InputValue on __InputValue {
      name
      description
      type { ...TypeRef }
      defaultValue
    }

    fragment TypeRef on __Type {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const response = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: introspectionQuery })
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors)
    throw new Error('Introspection failed')
  }

  const schema = result.data.__schema
  
  // Find Query type
  const queryType = schema.types.find((type: any) => type.name === 'Query')
  
  console.log('🔍 AVAILABLE QUERY FIELDS:')
  console.log('==========================')
  
  if (queryType?.fields) {
    queryType.fields
      .filter((field: any) => !field.name.startsWith('_'))
      .sort((a: any, b: any) => a.name.localeCompare(b.name))
      .forEach((field: any) => {
        console.log(`${field.name}: ${getTypeString(field.type)}`)
        if (field.description) {
          console.log(`  Description: ${field.description}`)
        }
      })
  }

  // Find relevant types (Tool, Category, Feature, etc.)
  console.log('\n🏗️  AVAILABLE TYPES:')
  console.log('===================')
  
  const relevantTypes = schema.types.filter((type: any) => 
    type.kind === 'OBJECT' && 
    !type.name.startsWith('_') &&
    !type.name.startsWith('Keystone') &&
    type.name !== 'Query' &&
    type.name !== 'Mutation'
  )

  relevantTypes
    .sort((a: any, b: any) => a.name.localeCompare(b.name))
    .forEach((type: any) => {
      console.log(`\n${type.name}:`)
      if (type.fields) {
        type.fields
          .slice(0, 10) // Show first 10 fields
          .forEach((field: any) => {
            console.log(`  ${field.name}: ${getTypeString(field.type)}`)
          })
        if (type.fields.length > 10) {
          console.log(`  ... and ${type.fields.length - 10} more fields`)
        }
      }
    })
}

function getTypeString(type: any): string {
  if (type.kind === 'NON_NULL') {
    return `${getTypeString(type.ofType)}!`
  }
  if (type.kind === 'LIST') {
    return `[${getTypeString(type.ofType)}]`
  }
  return type.name || 'Unknown'
}

async function main() {
  try {
    console.log('Introspecting GraphQL schema...\n')
    await introspectSchema()
    console.log('\n✅ Schema introspection complete!')
  } catch (error) {
    console.error('❌ Introspection failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}