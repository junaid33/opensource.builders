const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const altsData = require("./content/alts/alts.json")



exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const compTemplate = path.resolve(`./src/templates/comparisons.js`)
  altsData.alternatives.forEach(comp_object => {
    var path = comp_object.main.replace(/\s+/g, "-").toLowerCase()
    createPage({
      path,
      component: compTemplate,
      context: comp_object,
    })
  })

  const allData = []

  altsData.alternatives.map(comp => {
    const flat = comp.alts.map(alt => {
      return { ...alt, main: comp.main, mainID: comp.id }
    })
    allData.push(...flat)
  })

  const mainInfo = altsData.alternatives.map(
    ({ alts, ...keepAttrs }) => keepAttrs
  )

  createPage({
    path: `/`,
    component: path.resolve(`./src/templates/ClientSearchTemplate.js`),
    context: {
      compData: {
        allComps: allData,
        mainInfo: mainInfo,
        options: {  
          indexStrategy: `Prefix match`,
          searchSanitizer: `Lower Case`,
          TitleIndex: true,
          AuthorIndex: true,
          SearchByTerm: true,
        },
      },
    },
  })

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
