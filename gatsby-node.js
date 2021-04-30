const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const altsData = require("./content/alts/alts.json")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const compTemplate = path.resolve(`./src/templates/comparisons.js`)
  altsData.alternatives.forEach((comp_object) => {
    comp_object.commercial.map((object) => {
      var path = object.main.replace(/\s+/g, "-").toLowerCase()
      createPage({
        path,
        component: compTemplate,
        context: {
          name: object.main,
          alternatives: comp_object.alts,
        },
      })
    })
  })

  const allData = []

  altsData.alternatives.map((comp, index) => {
    const flatComp = comp.commercial.map((a) => a.main)
    const flat = comp.alts.map((alt) => {
      return {
        ...alt,
        main: flatComp,
        mainID: comp.id,
        category: comp.category,
      }
    })
    allData.push(...flat)
  })

  const mainInfo = altsData.alternatives.map(
    ({ alts, ...keepAttrs }) => keepAttrs
  )

  createPage({
    path: `/`,
    component: path.resolve(`./src/templates/index-with-search.js`),
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
