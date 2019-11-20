import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import { remarkForm } from "gatsby-tinacms-remark"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <article>
          <header>
            <h1
              style={{
                marginTop: rhythm(1),
                marginBottom: 0,
              }}
            >
              {post.frontmatter.title}
            </h1>
            <p
              style={{
                ...scale(-1 / 5),
                display: `block`,
                marginBottom: rhythm(1),
              }}
            >
              {post.frontmatter.date}
            </p>
          </header>
          <section dangerouslySetInnerHTML={{ __html: post.html }} />
          <hr
            style={{
              marginBottom: rhythm(1),
            }}
          />
          <footer>
            <Bio />
          </footer>
        </article>

        <nav>
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </Layout>
    )
  }
}

/**
 * This object defines the form for editing blog post.
 */
const BlogPostForm = {
  /**
   * The list of fields tell us what the form looks like.
   */
  fields: [
    /**
     * This is a field definition. There are many types of
     * components available, including:
     *
     * * text
     * * textarea
     * * toggle
     * * date
     * * markdown
     * * color
     * * group
     * * group-list
     * * blocks
     */
    {
      //
      name: "frontmatter.title",
      component: "text",
      label: "Title",
      required: true,
    },
    { name: "frontmatter.date", component: "date", label: "Date" },
    {
      name: "frontmatter.description",
      component: "textarea",
      label: "Textarea",
    },
    { name: "rawMarkdownBody", component: "markdown", label: "Body" },
  ],
}

/**
 * The `remarkForm` higher order component wraps the `BlogPostTemplate`
 * and generates a new form from the data in the `markdownRemark` query.
 */
export default remarkForm(BlogPostTemplate, BlogPostForm)

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      ...TinaRemark
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
