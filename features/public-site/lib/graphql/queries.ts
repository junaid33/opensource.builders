import { gql } from 'graphql-request';

// Popular apps query
export const GET_POPULAR_APPS = gql`
  query GetPopularApps {
    proprietaryApplications(
      take: 9
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      websiteUrl
      simpleIconSlug
      simpleIconColor
    }
  }
`;

// Alternatives query
export const GET_ALTERNATIVES = gql`
  query GetAlternatives($slug: String!) {
    proprietaryApplications(where: { slug: { equals: $slug } }) {
      id
      name
      slug
      description
      websiteUrl
      simpleIconSlug
      simpleIconColor
      capabilities {
        capability {
          id
          name
          slug
          description
          category
          complexity
        }
      }
      openSourceAlternatives {
        id
        name
        slug
        description
        githubStars
        githubForks
        license
        websiteUrl
        repositoryUrl
        simpleIconSlug
        simpleIconColor
        capabilities {
          capability {
            id
            name
            slug
            description
            category
            complexity
          }
          implementationNotes
          githubPath
          documentationUrl
          implementationComplexity
          isActive
        }
      }
    }
  }
`;

// All proprietary apps query
export const GET_ALL_PROPRIETARY_APPS = gql`
  query GetAllProprietaryApps {
    proprietaryApplications(
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      websiteUrl
      simpleIconSlug
      simpleIconColor
    }
  }
`;

// Multi-model search query
export const MULTI_MODEL_SEARCH = gql`
  query MultiModelSearch($search: String!) {
    openSourceApplications(
      where: {
        OR: [
          { name: { contains: $search, mode: insensitive } }
          { slug: { contains: $search, mode: insensitive } }
          { description: { contains: $search, mode: insensitive } }
          { capabilities: { some: { capability: { name: { contains: $search, mode: insensitive } } } } }
        ]
      }
      take: 5
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      simpleIconSlug
      simpleIconColor
      repositoryUrl
      websiteUrl
    }
    
    proprietaryApplications(
      where: {
        OR: [
          { name: { contains: $search, mode: insensitive } }
          { slug: { contains: $search, mode: insensitive } }
          { description: { contains: $search, mode: insensitive } }
          { capabilities: { some: { capability: { name: { contains: $search, mode: insensitive } } } } }
        ]
      }
      take: 5
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      simpleIconSlug
      simpleIconColor
      websiteUrl
    }
    
    capabilities(
      where: {
        OR: [
          { name: { contains: $search, mode: insensitive } }
          { slug: { contains: $search, mode: insensitive } }
          { description: { contains: $search, mode: insensitive } }
        ]
      }
      take: 5
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      category
      complexity
    }
  }
`;

// OS alternatives query - get an open source app and other alternatives to the same proprietary app
export const GET_OS_ALTERNATIVES = gql`
  query GetOsAlternatives($slug: String!) {
    openSourceApplications(where: { slug: { equals: $slug } }) {
      id
      name
      slug
      description
      githubStars
      githubForks
      license
      websiteUrl
      repositoryUrl
      simpleIconSlug
      simpleIconColor
      capabilities {
        capability {
          id
          name
          slug
          description
          category
          complexity
        }
        implementationNotes
        githubPath
        documentationUrl
        implementationComplexity
        isActive
      }
      primaryAlternativeTo {
        id
        name
        slug
        description
        websiteUrl
        simpleIconSlug
        simpleIconColor
        capabilities {
          capability {
            id
            name
            slug
            description
            category
            complexity
          }
        }
        openSourceAlternatives {
          id
          name
          slug
          description
          githubStars
          githubForks
          license
          websiteUrl
          repositoryUrl
          simpleIconSlug
          simpleIconColor
          capabilities {
            capability {
              id
              name
              slug
              description
              category
              complexity
            }
            implementationNotes
            githubPath
            documentationUrl
            implementationComplexity
            isActive
          }
        }
      }
    }
  }
`;

// Capability applications query - get all apps that have a specific capability
export const GET_CAPABILITY_APPLICATIONS = gql`
  query GetCapabilityApplications($slug: String!) {
    capabilities(where: { slug: { equals: $slug } }) {
      id
      name
      slug
      description
      category
      complexity
      proprietaryApplications {
        proprietaryApplication {
          id
          name
          slug
          description
          websiteUrl
          simpleIconSlug
          simpleIconColor
        }
      }
      openSourceApplications {
        openSourceApplication {
          id
          name
          slug
          description
          githubStars
          githubForks
          license
          websiteUrl
          repositoryUrl
          simpleIconSlug
          simpleIconColor
        }
        implementationNotes
        githubPath
        documentationUrl
        implementationComplexity
        isActive
      }
    }
  }
`;

// All capabilities query - filtered to exclude feature count capabilities
export const GET_ALL_CAPABILITIES = gql`
  query GetAllCapabilities {
    capabilities(
      where: {
        AND: [
          {
            name: {
              not: {
                startsWith: "30+"
              }
            }
          }
          {
            name: {
              not: {
                startsWith: "34+"
              }
            }
          }
          {
            name: {
              not: {
                startsWith: "35+"
              }
            }
          }
          {
            name: {
              not: {
                startsWith: "50+"
              }
            }
          }
          {
            name: {
              not: {
                startsWith: "90+"
              }
            }
          }
          {
            name: {
              not: {
                contains: "Question Types"
              }
            }
          }
          {
            name: {
              not: {
                contains: "Themes"
              }
            }
          }
          {
            name: {
              not: {
                contains: "Building Blocks"
              }
            }
          }
          {
            name: {
              not: {
                contains: "Data Source Connectors"
              }
            }
          }
          {
            name: {
              not: {
                contains: "Notification Channels"
              }
            }
          }
        ]
      }
      orderBy: { name: asc }
      take: 12
    ) {
      id
      name
      slug
      description
      category
      complexity
    }
  }
`;

// Paginated alternatives query with count for hero section
export const GET_PAGINATED_ALTERNATIVES = gql`
  query GetPaginatedAlternatives($slug: String!, $take: Int!, $skip: Int!) {
    proprietaryApplications(where: { slug: { equals: $slug } }) {
      id
      name
      slug
      capabilities {
        capability {
          id
          name
          slug
          description
          category
          complexity
        }
      }
      openSourceAlternatives(take: $take, skip: $skip) {
        id
        name
        slug
        description
        githubStars
        githubForks
        license
        websiteUrl
        repositoryUrl
        simpleIconSlug
        simpleIconColor
        capabilities {
          capability {
            id
            name
            slug
            description
            category
            complexity
          }
          implementationNotes
          githubPath
          documentationUrl
          implementationComplexity
          isActive
        }
      }
      openSourceAlternativesCount
    }
  }
`;

// All open source applications query
export const GET_ALL_OPEN_SOURCE_APPS = gql`
  query GetAllOpenSourceApps {
    openSourceApplications(
      orderBy: { githubStars: desc }
      take: 12
    ) {
      id
      name
      slug
      description
      githubStars
      githubForks
      license
      websiteUrl
      repositoryUrl
      simpleIconSlug
      simpleIconColor
    }
  }
`;