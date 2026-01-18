import { gql } from 'graphql-request';

// Query to get any application by slug (checks both proprietary and open source)
export const GET_APPLICATION_BY_SLUG = gql`
  query GetApplicationBySlug($slug: String!) {
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
    }
    openSourceApplications(where: { slug: { equals: $slug } }) {
      id
      name
      slug
      description
      repositoryUrl
      websiteUrl
      license
      githubStars
      githubForks
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
`;
