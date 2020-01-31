import React from "react"
import { Link, graphql } from "gatsby"
import { Box, Badge, Icon } from "@chakra-ui/core"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useLocalJsonForm, useGlobalJsonForm } from "gatsby-tinacms-json"

const Index = ({ data, location }) => {
  console.log(data)
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
                label: "Repo",
                name: "repo",
                component: "text",
              },
            ],
          },
        ],
      },
    ],
  })
  return (
    <>
      <SEO title="All comparisons" />
      {data.altsJson.alternatives.map(comp => (
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          width="100%"
          borderRadius={5}
          boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
          mb={2}
          bg="#FFFFFF"
          {...{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E\")",
          }}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexBasis="15rem"
            minWidth="15rem"
            height="12rem"
          >
            <Link to={comp.main.replace(/\s+/g, "-").toLowerCase()}>
              <Box
                as="img"
                width="15rem"
                py={3}
                px="20px"
                mb="0"
                borderTopLeftRadius={5}
                borderBottomLeftRadius={5}
                src={comp.svg}
                alt=""
              />
            </Link>
          </Box>
          <Box
            borderTopRightRadius={5}
            borderBottomRightRadius={5}
            bg="white"
            display="flex"
            width="100%"
            minHeight="100%"
            px={2}
          >
            {comp.alts.map(alt => (
              <Box
                as="a"
                href={`https://github.com/${alt.repo}`}
                target="_blank"
                display="flex"
                flexDirection="column"
                alignItems="stretch"
                p={2}
                width={{ base: "50%", md: "33%" }}
              >
                <Box
                  height="100%"
                  display="flex"
                  justifyContent="center"
                  bg="#FFFFFF"
                  boxShadow="rgba(46, 41, 51, 0.08) 0px 1px 2px, rgba(71, 63, 79, 0.08) 0px 2px 4px"
                  borderRadius={5}
                >
                  <Box
                    as="img"
                    py={5}
                    px={5}
                    maxHeight="152px"
                    objectFit="contain"
                    src={alt.svg}
                    alt=""
                  />
                </Box>
                <Box display="flex">
                  <Box flex={1}>
                    <Box
                      mt={1}
                      fontFamily="Inter"
                      {...{
                        color: "#78757a",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                      }}
                    >
                      {alt.repo && alt.repo.split("/")[0]} /
                    </Box>
                    <Box
                      fontFamily="Inter"
                      {...{
                        // color: "#fff",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                      lineHeight=".8"
                    >
                      {alt.repo && alt.repo.split("/")[1].toLowerCase()}
                    </Box>
                  </Box>
                  <Box mt={2} display="flex" flexDirection="column" ml="auto">
                    <Badge
                      ml="auto"
                      borderRadius={25}
                      px={2}
                      variant="subtle"
                      fontSize=".5rem"
                      variantColor="blue"
                    >
                      {alt.license}
                    </Badge>
                    <Box
                      fontFamily="Inter"
                      fontSize={12}
                      ml="auto"
                      color="#fe8f0c"
                      display="flex"
                      alignItems="center"
                      fontWeight={500}
                    >
                      <Icon name="star" size={2} mr={1} /> {alt.stars}
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </>
  )
}

export default Index

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
        alts {
          name
          license
          stars
          svg
          repo
        }
      }
      rawJson
      fileRelativePath
    }
  }
`
