import React from "react"
import { Link } from "gatsby"
import { Box } from "@chakra-ui/core"
import { withPlugin } from "tinacms"
import { createRemarkButton } from "gatsby-tinacms-remark"
import slugify from "slugify"
import Header from "./header"

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h3>
      )
    }
    return (
      <Box background="#EDF2F7" minHeight="100vh">
        <Header location={this.props.location} />
        <Box
          as="a"
          p={5}
          href="https://www.producthunt.com/posts/opensource-builders?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-opensource-builders"
          target="_blank"
          position="fixed"
          bottom={0}
          right={0}
          zIndex={2}
        >
          <Box
            as="img"
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=185805&theme=dark"
            alt="Opensource Builders - Find open-source alternatives to commercial apps | Product Hunt Embed"
            width="200px"
          />
        </Box>
        {/* <header>{header}</header> */}
        <Box as="main" height="100%">
          {children}
        </Box>
      </Box>
    )
  }
}

/**
 * This a is `create-content` plugin. It describes
 * a form for creating blog posts as as markdown files.
 * Registering this plugin reveals the `+` button in
 * the sidebar.
 */
const CreatePostPlugin = createRemarkButton({
  /**
   * Clicking the `+` button reveals a lost of content
   * types that can be created. This field sets the
   * label in that list.
   */
  label: "Post",
  /**
   * Clicking the `Post` in the `+` list opens a modal.
   * This modal contains a form with these fields.
   */
  fields: [{ name: "title", component: "text", label: "Title" }],
  /**
   * Tina needs to know where the new markdown file is
   * going to live. This `filename` function generates
   * that path from the form's values. This function is required.
   */
  filename(form) {
    let slug = slugify(form.title.toLowerCase())

    return `content/blog/${slug}/index.md`
  },
  /**
   * We can optionally generate default frontmatter for the
   * new post. This can be a combination of form data and
   * programmatically generated.
   */
  frontmatter(form) {
    return {
      title: form.title,
      date: new Date(),
      description: "",
    }
  },
  /**
   * Finally, we can generate a default body. Right now
   * we don't need to do that.
   */
  body(form) {
    return ""
  },
})

/**
 * Our `CreatePostPlugin` will be available any time the
 * `Layout` component is rendered in the site.
 */
export default withPlugin(Layout, CreatePostPlugin)
