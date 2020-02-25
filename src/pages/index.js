import React from "react"
import { Link, graphql, Img } from "gatsby"
import {
  Box,
  Badge,
  Icon,
  Heading,
  Divider,
  Text,
  Tooltip,
} from "@chakra-ui/core"
import SEO from "../components/seo"
import Github from "../components/Github"

import { useLocalJsonForm } from "gatsby-tinacms-json"

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
            ],
          },
        ],
      },
    ],
  })
  return (
    <>
      <SEO title="All comparisons" />
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
                Open-source alternatives
              </Heading>
              <Text fontSize="md" fontWeight={400} color="#939fae" mt={1}>
                Find open-source alternatives for your favorite apps
              </Text>
            </Box>
            {/* <Box display="flex">
              <Button
                leftIcon="add"
                variantColor="cyan"
                variant="solid"
                size="sm"
              >
                Add Comparison
              </Button>
            </Box> */}
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        flexWrap="wrap"
        ml="auto"
        mr="auto"
        maxWidth="60rem"
        p="2.625rem 1.3125rem"
      >
        {data.altsJson.alternatives.map(comp => (
          <Box mb={16} width={{ base: "100%", md: "50%" }}>
            <Box mx={3}>
              <Box
                as="img"
                height="4rem"
                py={3}
                px={4}
                borderTopLeftRadius={5}
                borderBottomLeftRadius={5}
                src={comp.svg}
                alt=""
              />
              <Divider borderColor="gray.400" />
              <Box display="flex" flexWrap="wrap">
                {comp.alts.map(alt => (
                  <Box width={{ base: "100%" }}>
                    <Box
                      display="flex"
                      borderRadius="4px"
                      p={2}
                      m={2}
                      boxShadow="0px 1px 4px rgba(0, 0, 0, 0.16)"
                      bg="white"
                    >
                      <Box
                        as="img"
                        height="56px"
                        width="56px"
                        // p={1}
                        mr={3}
                        borderRadius="4px"
                        boxShadow="0px 1px 4px rgba(0, 0, 0, 0.16)"
                        src={alt.svg}
                      />
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        lineHeight="21px"
                      >
                        <Text fontSize="md" fontWeight={500}>
                          {alt.name}
                        </Text>
                        <Box
                          // fontFamily="Inter"
                          fontSize={14}
                          color="#D69E2E"
                          display="flex"
                          alignItems="center"
                          fontWeight={600}
                          mt={1}
                        >
                          <Icon name="star" size={3} mr={1} /> {alt.stars}
                          <Tooltip hasArrow label="Language" placement="top">
                            <Badge ml={3} variantColor="green">
                              {alt.language}
                            </Badge>
                          </Tooltip>
                          <Tooltip hasArrow label="License" placement="top">
                            <Badge ml={3} variantColor="blue">
                              {alt.license}
                            </Badge>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Box ml="auto" display="flex" alignItems="center">
                        <Tooltip hasArrow label="Repo" placement="top">
                          <Box
                            as="a"
                            href={`https://github.com/${alt.repo}`}
                            target="_blank"
                          >
                            <Github />
                          </Box>
                        </Tooltip>
                        <Tooltip hasArrow label="Website" placement="top">
                          <Box
                            size={5}
                            mx={3}
                            as="a"
                            href={alt.site}
                            target="_blank"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              focusable="false"
                              role="presentation"
                            >
                              <path
                                fill="#718096"
                                d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                              ></path>
                            </svg>
                          </Box>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
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
          site
          language
        }
      }
      rawJson
      fileRelativePath
    }
  }
`
