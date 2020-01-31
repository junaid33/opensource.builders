import React from "react"

export default ({ data }) => {
  var comp = data.allSitePage.edges[0].node.context
  return <div>{comp.main}</div>
}

export const query = graphql`
  query($path: String!) {
    allSitePage(filter: { path: { eq: $path } }) {
      edges {
        node {
          context {
            main
            alts {
              name
              stars
              license
            }
          }
        }
      }
    }
  }
`
