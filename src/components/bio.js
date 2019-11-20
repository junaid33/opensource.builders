/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

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
      { name: 'rawJson.author' , label: "Author Name", component: "text" },
      
      { name: 'rawJson.social', label: 'Social Info', component: 'group', fields: [
        {label: "@Twitter", name: "twitter", component: "text"}
      ]}
    ]
  })
  // const [{ name, social }] = useGlobalJsonForm(data.author, {
  //   label: "Author",
  //   fields: [{ name: "rawJson.author", label: "Name", component: "text" }],
  // })

  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
      }}
    >
     <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <p>
        Written by <strong>{author}</strong> who lives and works in Canada
        building useful things.
        {` `}
        <a href={`https://twitter.com/${social.twitter}`}>
          You should follow him on Twitter
        </a>
      </p>
    </div>
  )
}

export default Bio
