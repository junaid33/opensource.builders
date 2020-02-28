import React from "react"
import { Link, graphql } from "gatsby"
import { Box, Avatar, Heading, Text } from "@chakra-ui/core"
import styled from "@emotion/styled"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { remarkForm } from "gatsby-tinacms-remark"

const BlogText = styled.section`
  position: relative;
  min-height: 230px;
  line-height: 1.6em;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 20px;
  padding-left: 60px;
  padding-right: 60px;
  padding-bottom: 20px;
  background: rgb(255, 255, 255);

  h2 {
    font-weight: 600;
    color: #11103e;
    margin-top: 48px;
    margin-bottom: 16px;
    font-size: 40px;
    line-height: 42px;
    letter-spacing: 0;
  }

  h3 {
    font-weight: 600;
    color: #11103e;
    margin-top: 20px;
    margin-bottom: 16px;
    font-size: 30px;
    line-height: 42px;
    letter-spacing: 0;
  }

  h4 {
    font-weight: 500;
    color: #11103e;
    margin-top: 20px;
    margin-bottom: 16px;
    font-size: 24px;
    line-height: 42px;
    letter-spacing: 0;
  }

  p {
    margin-top: 0;
    margin-bottom: 16px;
  }

  @media (max-width: 1170px) {
    padding: 4vw 7vw 0;
  }
  @media (max-width: 800px) {
    font-size: 1rem;
    padding: 1vw 7vw 0;
    h2 {
      font-size: 32px;
    }
  }
  @media (max-width: 500px) {
    padding: 0vw 7vw 0;
  }
`

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <>
        <Box
          bg="white"
          boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
        >
          <Box px={{ md: "2rem" }}>
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
              px="1rem"
            >
              <Box py={5}>
                <Heading as="h2" size="lg">
                  About Opensource.Builders
                </Heading>
                <Text fontSize="md" fontWeight={400} color="#939fae" mt={1}>
                  On a mission to find great open-source software
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <Box
          display="flex"
          flexWrap="wrap"
          ml="auto"
          mr="auto"
          maxWidth="60rem"
          py={4}
          px={2}
          // p="2.625rem 1.3125rem"
        >
          <Box
            width="100%"
            boxShadow="0px 1px 4px rgba(0, 0, 0, 0.16)"
            borderRadius="3px"
            bg="white"
          >
            <article>
              <BlogText dangerouslySetInnerHTML={{ __html: post.html }} />
              <footer>
                <Bio />
              </footer>
            </article>
          </Box>
        </Box>
      </>
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
