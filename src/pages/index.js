import React, { useEffect, useState } from "react"
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
import styled from "@emotion/styled"
import { useLocalJsonForm } from "gatsby-tinacms-json"
import SEO from "../components/seo"

const deployLogo = deploy => {
  if (deploy.includes("heroku.com")) {
    return (
      <Tooltip
        bg="rgb(45, 55, 72)"
        color="rgba(255, 255, 255, 0.92);"
        hasArrow
        label={"Deploy via Heroku"}
        placement="top"
      >
        <Box>
          <svg
            width="10px"
            viewBox="0 0 256 400"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMinYMin meet"
          >
            <path
              d="M28.083 398.289V363.51c0-2.452-1.798-3.51-3.917-3.51-4.248 0-9.554 1.058-14.37 3.181v35.108H0v-64.576h9.795v21.304c4.656-1.712 10.206-3.18 15.758-3.18 8.898 0 12.246 5.469 12.246 12.976v33.476h-9.716zm27.999-21.063c.326 11.674 2.613 13.961 9.794 13.961 5.634 0 12.002-1.879 16.902-3.757l1.632 7.346c-5.226 2.37-11.593 4.655-19.183 4.655-16.33 0-18.862-8.978-18.862-23.268 0-7.835.573-14.939 2.45-21.47 4.898-1.878 11.43-2.857 19.673-2.857 13.393 0 17.473 7.43 17.473 20.41v4.98H56.082zM68.488 360c-2.935 0-7.59.082-11.427.813-.406 1.96-.899 4.655-1.062 9.636h20.41c0-6.778-1.225-10.449-7.921-10.449zm35.837 3.181v35.108h-9.797v-39.515c8.246-4.489 16.981-5.877 22.698-6.285v8.164c-4 .326-9.064.816-12.9 2.528zm38.778 36.25c-14.616 0-21.228-7.183-21.228-23.594 0-17.389 8.735-24 21.228-24 14.612 0 21.226 7.182 21.226 23.592 0 17.39-8.737 24.002-21.226 24.002zm0-39.43c-7.512 0-11.675 4.325-11.675 15.836 0 12.574 3.51 15.35 11.675 15.35 7.51 0 11.674-4.247 11.674-15.758 0-12.574-3.51-15.429-11.674-15.429zm68.49 38.288H200.08c-2.692-7.184-6.45-14.532-12.246-20.9h-5.144v20.9h-9.796v-64.576h9.796v37.062h4.573c4.98-5.144 8.816-11.509 11.511-17.797h11.02c-3.754 7.593-8.57 14.287-13.959 19.757 6.45 8.164 11.511 16.818 15.757 25.554zm18.363 1.142c-8.897 0-12.244-5.468-12.244-12.98v-33.473h9.714v34.697c0 2.452 1.794 3.512 3.917 3.512 4.246 0 10.042-1.06 14.86-3.184v-35.025H256v39.35c-11.593 6.369-20.493 7.103-26.044 7.103zM225.628 317.253H30.258C13.545 317.253 0 303.708 0 286.998V30.256C0 13.546 13.546 0 30.257 0h195.37c16.71 0 30.26 13.546 30.26 30.256v256.742c0 16.71-13.55 30.255-30.26 30.255z"
              fill="#6762A6"
            />
            <path
              d="M160.36 273.6V147.61s8.195-30.15-100.943 12.334c-.2.539-.2-116.504-.2-116.504l35.66-.22v74.991s99.846-39.325 99.846 29.824V273.6h-34.362zm20.32-184.994h-37.824c13.615-16.646 25.94-45.167 25.94-45.167h39.11s-6.696 18.587-27.225 45.167zM59.865 273.382v-71.748l35.878 35.877-35.878 35.871z"
              fill="#FFF"
            />
          </svg>
        </Box>
      </Tooltip>
    )
  }
  if (deploy.includes("digitalocean")) {
    return (
      <Tooltip
        bg="rgb(45, 55, 72)"
        color="rgba(255, 255, 255, 0.92);"
        hasArrow
        label={"Deploy via DigitalOcean"}
        placement="top"
      >
        <Box>
          <svg
            width="12px"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -3.954 53.927 53.954"
          >
            <g fill="#0080ff" fill-rule="evenodd">
              <path d="M24.915 50v-9.661c10.226 0 18.164-10.141 14.237-20.904a14.438 14.438 0 0 0-8.615-8.616C19.774 6.921 9.633 14.83 9.633 25.056H0C0 8.758 15.763-3.954 32.853 1.384 40.311 3.73 46.271 9.661 48.588 17.12 53.927 34.237 41.243 50 24.915 50" />
              <path d="M15.339 40.367h9.604v-9.604H15.34zm-7.401 7.401h7.4v-7.4h-7.4zm-6.187-7.4h6.187V34.18H1.751z" />
            </g>
          </svg>
        </Box>
      </Tooltip>
    )
  }
  if (deploy.includes("zeit.co")) {
    return (
      <Tooltip
        bg="rgb(45, 55, 72)"
        color="rgba(255, 255, 255, 0.92);"
        hasArrow
        label={"Deploy via Now.sh"}
        placement="top"
      >
        <Box size={3}>
          <svg
            viewBox="0 0 114 100"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                x1="100.929941%"
                y1="181.283245%"
                x2="41.7687834%"
                y2="100%"
                id="linearGradient-1"
              >
                <stop stop-color="#FFFFFF" offset="0%"></stop>
                <stop stop-color="#000000" offset="100%"></stop>
              </linearGradient>
            </defs>
            <g
              id="Page-1"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <g
                id="Black-Triangle"
                transform="translate(-293.000000, -150.000000)"
                fill="url(#linearGradient-1)"
              >
                <polygon
                  id="Logotype---Black"
                  points="350 150 407 250 293 250"
                ></polygon>
              </g>
            </g>
          </svg>
        </Box>
      </Tooltip>
    )
  }
  if (deploy) {
    return (
      <Tooltip
        bg="rgb(45, 55, 72)"
        color="rgba(255, 255, 255, 0.92);"
        hasArrow
        label={"Deploy instructions"}
        placement="top"
      >
        <Box size={4}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M9 14L11 16L15 12"
              stroke="#718096"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Box>
      </Tooltip>
    )
  }
}

const Index = ({ data, location }) => {
  useEffect(() => {
    window.localStorage.setItem("darkMode", false)
  })

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
  return (
    <>
      <SEO title="Opensource.builders" />
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
              <Heading as="h2" size="lg" color="rgb(26, 32, 44)">
                Open-source alternatives
              </Heading>
              <Text fontSize="md" fontWeight={400} color="#939fae" mt={1}>
                Find open-source alternatives for your favorite apps
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        flexWrap="wrap"
        ml="auto"
        mr="auto"
        maxWidth="60rem"
        // p="2.625rem 1.3125rem"
        px={2}
        py={4}
      >
        {data.altsJson.alternatives.map(comp => (
          <Box mb={16} width={{ base: "100%", md: "50%" }}>
            <Box mx={{ base: 0, sm: 1 }}>
              <Box display="flex" alignItems="center">
                <Box position="relative">
                  <Box position="absolute" top={0} left={0} zIndex="-1">
                    {comp.main}
                  </Box>
                  <Box
                    as="img"
                    height="4rem"
                    position="relative"
                    py={3}
                    px={4}
                    borderTopLeftRadius={5}
                    borderBottomLeftRadius={5}
                    src={comp.svg}
                    alt=""
                  />
                </Box>
              </Box>
              <Divider borderColor="gray.400" />
              <Box display="flex" flexWrap="wrap">
                {comp.alts.map(alt => (
                  <Box
                    width={{ base: "100%" }}
                    borderRadius="4px"
                    m={2}
                    boxShadow="0px 1px 4px rgba(0, 0, 0, 0.16)"
                    bg="white"
                  >
                    <Box display="flex" p={2}>
                      <Box display="flex">
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
                          <Text
                            fontSize="md"
                            fontWeight={500}
                            color="rgb(26, 32, 44)"
                          >
                            {alt.name}
                          </Text>
                          <Box
                            fontSize={14}
                            color="#D69E2E"
                            display="flex"
                            alignItems="center"
                            fontWeight={600}
                            mt={1}
                          >
                            <Icon name="star" size={3} mr={1} /> {alt.stars}
                            <Tooltip
                              bg="rgb(45, 55, 72)"
                              color="rgba(255, 255, 255, 0.92);"
                              hasArrow
                              label="Language"
                              placement="top"
                            >
                              <Badge
                                ml={3}
                                bg="rgb(198, 246, 213)"
                                color="rgb(34, 84, 61)"
                              >
                                {alt.language}
                              </Badge>
                            </Tooltip>
                            <Tooltip
                              bg="rgb(45, 55, 72)"
                              color="rgba(255, 255, 255, 0.92);"
                              hasArrow
                              label="License"
                              placement="top"
                            >
                              <Badge
                                ml={3}
                                bg="rgb(206, 237, 255)"
                                color="rgb(21, 62, 117)"
                              >
                                {alt.license}
                              </Badge>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        ml="auto"
                        display={{ base: "none", sm: "flex" }}
                        alignItems="center"
                      >
                        <Box as="a" href={alt.deploy} target="_blank" mx={5}>
                          {alt.deploy ? (
                            deployLogo(alt.deploy)
                          ) : (
                            <Tooltip
                              bg="rgb(45, 55, 72)"
                              color="rgba(255, 255, 255, 0.92);"
                              hasArrow
                              label={"No Deploy Instructions Found"}
                              placement="top"
                            >
                              <Box size={4}>
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="#718096"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              </Box>
                            </Tooltip>
                          )}
                        </Box>
                        <Tooltip
                          bg="rgb(45, 55, 72)"
                          color="rgba(255, 255, 255, 0.92);"
                          hasArrow
                          label="Repo"
                          placement="top"
                        >
                          <Box
                            as="a"
                            href={`https://github.com/${alt.repo}`}
                            target="_blank"
                          >
                            <svg
                              stroke="#718096"
                              fill="#718096"
                              strokeWidth="0"
                              version="1.1"
                              viewBox="0 0 32 32"
                              height="1.1em"
                              width="1.1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M16 5.343c-6.196 0-11.219 5.023-11.219 11.219 0 4.957 3.214 9.162 7.673 10.645 0.561 0.103 0.766-0.244 0.766-0.54 0-0.267-0.010-1.152-0.016-2.088-3.12 0.678-3.779-1.323-3.779-1.323-0.511-1.296-1.246-1.641-1.246-1.641-1.020-0.696 0.077-0.682 0.077-0.682 1.126 0.078 1.72 1.156 1.72 1.156 1.001 1.715 2.627 1.219 3.265 0.931 0.102-0.723 0.392-1.219 0.712-1.498-2.49-0.283-5.11-1.246-5.11-5.545 0-1.226 0.438-2.225 1.154-3.011-0.114-0.285-0.501-1.426 0.111-2.97 0 0 0.941-0.301 3.085 1.15 0.894-0.25 1.854-0.373 2.807-0.377 0.953 0.004 1.913 0.129 2.809 0.379 2.14-1.453 3.083-1.15 3.083-1.15 0.613 1.545 0.227 2.685 0.112 2.969 0.719 0.785 1.153 1.785 1.153 3.011 0 4.31-2.624 5.259-5.123 5.537 0.404 0.348 0.761 1.030 0.761 2.076 0 1.5-0.015 2.709-0.015 3.079 0 0.299 0.204 0.648 0.772 0.538 4.455-1.486 7.666-5.69 7.666-10.645 0-6.195-5.023-11.219-11.219-11.219z" />
                            </svg>
                          </Box>
                        </Tooltip>

                        <Tooltip
                          bg="rgb(45, 55, 72)"
                          color="rgba(255, 255, 255, 0.92);"
                          hasArrow
                          label="Website"
                          placement="top"
                        >
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
                              />
                            </svg>
                          </Box>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Divider display={{ sm: "none" }} my={0} />
                    <Box
                      display={{ base: "flex", sm: "none" }}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box
                        width="33%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRight="1px solid #edf1f6"
                        py={1}
                      >
                        <Box
                          as="a"
                          href={alt.deploy}
                          target="_blank"
                          display="flex"
                          alignItems="center"
                          px={10}
                        >
                          {alt.deploy ? (
                            deployLogo(alt.deploy)
                          ) : (
                            <Tooltip
                              bg="rgb(45, 55, 72)"
                              color="rgba(255, 255, 255, 0.92);"
                              hasArrow
                              label={"No Deploy Instructions Found"}
                              placement="top"
                            >
                              <Box size={4}>
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="#718096"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              </Box>
                            </Tooltip>
                          )}
                          <Heading
                            fontSize="xs"
                            color="gray.500"
                            letterSpacing="wide"
                            textTransform="uppercase"
                            ml={1}
                          >
                            Deploy
                          </Heading>
                        </Box>
                      </Box>
                      <Box
                        width="34%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRight="1px solid #edf1f6"
                        py={1}
                      >
                        <Box
                          as="a"
                          href={`https://github.com/${alt.repo}`}
                          target="_blank"
                          display="flex"
                          alignItems="center"
                        >
                          <svg
                            stroke="#718096"
                            fill="#718096"
                            strokeWidth="0"
                            version="1.1"
                            height="1.2em"
                            width="1.2em"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M16 5.343c-6.196 0-11.219 5.023-11.219 11.219 0 4.957 3.214 9.162 7.673 10.645 0.561 0.103 0.766-0.244 0.766-0.54 0-0.267-0.010-1.152-0.016-2.088-3.12 0.678-3.779-1.323-3.779-1.323-0.511-1.296-1.246-1.641-1.246-1.641-1.020-0.696 0.077-0.682 0.077-0.682 1.126 0.078 1.72 1.156 1.72 1.156 1.001 1.715 2.627 1.219 3.265 0.931 0.102-0.723 0.392-1.219 0.712-1.498-2.49-0.283-5.11-1.246-5.11-5.545 0-1.226 0.438-2.225 1.154-3.011-0.114-0.285-0.501-1.426 0.111-2.97 0 0 0.941-0.301 3.085 1.15 0.894-0.25 1.854-0.373 2.807-0.377 0.953 0.004 1.913 0.129 2.809 0.379 2.14-1.453 3.083-1.15 3.083-1.15 0.613 1.545 0.227 2.685 0.112 2.969 0.719 0.785 1.153 1.785 1.153 3.011 0 4.31-2.624 5.259-5.123 5.537 0.404 0.348 0.761 1.030 0.761 2.076 0 1.5-0.015 2.709-0.015 3.079 0 0.299 0.204 0.648 0.772 0.538 4.455-1.486 7.666-5.69 7.666-10.645 0-6.195-5.023-11.219-11.219-11.219z" />
                          </svg>
                          <Heading
                            fontSize="xs"
                            color="gray.500"
                            letterSpacing="wide"
                            textTransform="uppercase"
                            ml={1}
                          >
                            Repo
                          </Heading>
                        </Box>
                      </Box>
                      <Box
                        width="33%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        py={1}
                      >
                        <Box
                          mx={3}
                          as="a"
                          href={alt.site}
                          target="_blank"
                          display="flex"
                          alignItems="center"
                        >
                          <Heading
                            fontSize="xs"
                            color="gray.500"
                            letterSpacing="wide"
                            textTransform="uppercase"
                          >
                            Website
                          </Heading>
                          <svg
                            viewBox="0 0 24 24"
                            focusable="false"
                            role="presentation"
                            height="1.2em"
                            width="1.2em"
                          >
                            <path
                              fill="#718096"
                              d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                            />
                          </svg>
                        </Box>
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
          deploy
        }
      }
      rawJson
      fileRelativePath
    }
  }
`
