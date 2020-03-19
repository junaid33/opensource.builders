import React from "react"
import { graphql } from "gatsby"
import { useLocalJsonForm } from "gatsby-tinacms-json"
import ClientSearch from "../components/ClientSearch"

const SearchTemplate = props => {
  const {  data, location } = props

  const [{ alternatives }] = useLocalJsonForm(data.altsJson, {
    label: "Add an app comparison",
    fields: [
      {
        label: "Comparisons",
        name: "rawJson.alternatives",
        component: "group-list",
        description: "Comparisons List",
        itemProps: item => ({
          label: item.main,
        }),
        defaultItem: () => ({
          main: "New Comparison",
          alts: [],
          id: Math.random()
            .toString(36)
            .substr(2, 9),
        }),
        fields: [
          {
            label: "Main Application",
            name: "main",
            component: "text",
          },
          {
            label: "Website",
            name: "website",
            component: "text",
          },
          {
            label: "Logo URL",
            name: "svg",
            component: "text",
          },
          {
            label: "Opensource Alternatives",
            name: "alts",
            component: "group-list",
            description: "Alternatives List",
            itemProps: item => ({
              label: item.name,
            }),
            fields: [
              {
                label: "Name",
                name: "name",
                component: "text",
              },
              {
                label: "Stars",
                name: "stars",
                component: "text",
              },
              {
                label: "License",
                name: "license",
                component: "text",
              },
              {
                label: "Logo URL",
                name: "svg",
                component: "text",
              },
              {
                label: "Site",
                name: "site",
                component: "text",
              },
              {
                label: "Language",
                name: "language",
                component: "text",
              },
              {
                label: "Repo",
                name: "repo",
                component: "text",
              },
              {
                label: "Deploy",
                name: "deploy",
                component: "text",
              },
            ],
          },
        ],
      },
    ],
  })

  const allData = []

  data.altsJson.alternatives.map(comp => {
    const flat = comp.alts.map(alt => {
      return { ...alt, main: comp.main, mainID: comp.id }
    })
    allData.push(...flat)
  })

const mainInfo = data.altsJson.alternatives.map(({alts, ...keepAttrs}) => keepAttrs)


  return (
    <>
      <ClientSearch comps={allData} mainInfo={mainInfo}/>
    </>
  )
}
export default SearchTemplate


export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    altsJson {
      alternatives {
        main
        svg
        website
        id
        alts {
          name
          license
          stars
          svg
          repo
          site
          language
          deploy
        }
      }
      rawJson
      fileRelativePath
    }
  }
`