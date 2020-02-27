/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { Box, Divider } from "@chakra-ui/core"

/**
 * STEP 1: Import the json hooks
 */
import { useLocalJsonForm, useGlobalJsonForm } from "gatsby-tinacms-json"

const Bio = () => {
  /**
   * STEP 2: Add the `fileRelativePath` and `rawJson` to your gatsby query
   */
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      author: dataJson(pk: { eq: "author" }) {
        title
        author
        description
        siteUrl
        social {
          twitter
        }
        ###############
        # Tina Fields #
        ###############
        fileRelativePath
        rawJson
      }
    }
  `)

  /**
   * STEP 3: Make the author editable with `useLocalJsonForm`
   *
   * Then checkout `useGlobalJsonForm`
   */

  const [{ author, social }] = useLocalJsonForm(data.author, {
    label: "Author bio",
    fields: [
      { name: "rawJson.author", label: "Author Name", component: "text" },

      {
        name: "rawJson.social",
        label: "Social Info",
        component: "group",
        fields: [{ label: "@Twitter", name: "twitter", component: "text" }],
      },
    ],
  })
  // const [{ name, social }] = useGlobalJsonForm(data.author, {
  //   label: "Author",
  //   fields: [{ name: "rawJson.author", label: "Name", component: "text" }],
  // })

  return (
    <>
      <Divider mb={0} />
      <Box display="flex" px="7vw" pt="20px" pb="20px">
        <Image
          fixed={data.avatar.childImageSharp.fixed}
          alt={author}
          style={{
            marginBottom: 0,
            minWidth: 50,
            borderRadius: `100%`,
          }}
          imgStyle={{
            borderRadius: `50%`,
          }}
        />
        <Box
          display="flex"
          flexDirection="column"
          textAlign="left"
          marginTop="8px"
          marginLeft="16px"
        >
          <Box display="flex" alignItems="center" mb={1}>
            <Box
              as="p"
              color="gray.700"
              fontSize="18px"
              lineHeight="16px"
              fontWeight={500}
            >
              {author}
            </Box>
            <Box pl={1} as="a" href={`https://github.com/junaid33`} target="_blank">
              <svg
                stroke="#718096"
                fill="#718096"
                strokeWidth="0"
                version="1.1"
                viewBox="0 0 32 32"
                height="1.2em"
                width="1.2em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 5.343c-6.196 0-11.219 5.023-11.219 11.219 0 4.957 3.214 9.162 7.673 10.645 0.561 0.103 0.766-0.244 0.766-0.54 0-0.267-0.010-1.152-0.016-2.088-3.12 0.678-3.779-1.323-3.779-1.323-0.511-1.296-1.246-1.641-1.246-1.641-1.020-0.696 0.077-0.682 0.077-0.682 1.126 0.078 1.72 1.156 1.72 1.156 1.001 1.715 2.627 1.219 3.265 0.931 0.102-0.723 0.392-1.219 0.712-1.498-2.49-0.283-5.11-1.246-5.11-5.545 0-1.226 0.438-2.225 1.154-3.011-0.114-0.285-0.501-1.426 0.111-2.97 0 0 0.941-0.301 3.085 1.15 0.894-0.25 1.854-0.373 2.807-0.377 0.953 0.004 1.913 0.129 2.809 0.379 2.14-1.453 3.083-1.15 3.083-1.15 0.613 1.545 0.227 2.685 0.112 2.969 0.719 0.785 1.153 1.785 1.153 3.011 0 4.31-2.624 5.259-5.123 5.537 0.404 0.348 0.761 1.030 0.761 2.076 0 1.5-0.015 2.709-0.015 3.079 0 0.299 0.204 0.648 0.772 0.538 4.455-1.486 7.666-5.69 7.666-10.645 0-6.195-5.023-11.219-11.219-11.219z" />
              </svg>
            </Box>
          </Box>
          <Box
            as="p"
            color="gray.500"
            fontSize="14px"
            lineHeight="18px"
            marginBottom="0"
          >
            Maintainer of Opensource.builders
          </Box>
        </Box>
        {/* <p>
        Written by <strong>{author}</strong> who lives and works in Canada
        building useful things.
        {` `}
        <a href={`https://twitter.com/${social.twitter}`}>
          You should follow him on Twitter
        </a>
      </p> */}
      </Box>
    </>
  )
}

export default Bio
