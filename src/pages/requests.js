import React, { useState, useEffect } from "react"
import {
  Box,
  Input,
  Icon,
  Heading,
  Button,
  Text,
  Tooltip,
  PseudoBox,
} from "@chakra-ui/core"
import SEO from "../components/seo"

export default () => {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    // get data from GitHub api
    fetch(
      `https://api.github.com/repos/junaid33/opensource.builders/issues?labels=request&state=open`,
      {
        headers: {
          Accept: "application/vnd.github.squirrel-girl-preview",
        },
      }
    )
      .then((response) => response.json()) // parse JSON from request
      .then((resultData) => {
        resultData.sort((a, b) =>
          a.reactions.total_count < b.reactions.total_count ? 1 : -1
        )
        setRequests(resultData)
      }) // set data for the number of stars
  }, [])

  return (
    <>
      <SEO title="Request open-source alternatives" />
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
                Requests
              </Heading>
              <Text fontSize="md" fontWeight={400} color="#939fae" mt={1}>
                Request open-source alternatives
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection={{ base: "column-reverse", sm: "row" }}
        ml="auto"
        mr="auto"
        maxWidth="60rem"
        // p="2.625rem 1.3125rem"
        py={4}
      >
        <Box flex={7} px={2}>
          {requests.map((req) => (
            <Box
              mb={3}
              width="100%"
              boxShadow="0px 1px 4px rgba(0, 0, 0, 0.16)"
              borderRadius="3px"
              bg="white"
            >
              <Box mx={3} py={4} px={2} display="flex" alignItems="center">
                <Tooltip
                  bg="rgb(45, 55, 72)"
                  color="rgba(255, 255, 255, 0.92);"
                  label="Thumbs-up the issue to upvote"
                  placement="top"
                >
                  <PseudoBox
                    bg="white"
                    border="1px #63B3ED solid"
                    borderRadius={3}
                    mr={5}
                    px={4}
                    py={3}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    fontWeight={500}
                    color="#3182CE"
                    as="a"
                    href={req.html_url}
                    target="_blank"
                    _hover={{ color: "#fff", bg: "#3182CE" }}
                  >
                    <Icon name="triangle-up" color="currentColor" />
                    {req.reactions.total_count}
                  </PseudoBox>
                </Tooltip>
                <Box display="flex" flexDirection="column">
                  <Text fontSize="lg" fontWeight={500}>
                    {req.title}
                  </Text>
                  <Text fontSize="md" fontWeight={500} color="#555">
                    {req.body}
                  </Text>
                </Box>
                <Box ml="auto" display="flex" alignItems="center">
                  <Box
                    as="a"
                    href={req.html_url}
                    target="_blank"
                    display="flex"
                    alignItems="center"
                    mr={3}
                  >
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
                      <path d="M16 5.343c-6.196 0-11.219 5.023-11.219 11.219 0 4.957 3.214 9.162 7.673 10.645 0.561 0.103 0.766-0.244 0.766-0.54 0-0.267-0.010-1.152-0.016-2.088-3.12 0.678-3.779-1.323-3.779-1.323-0.511-1.296-1.246-1.641-1.246-1.641-1.020-0.696 0.077-0.682 0.077-0.682 1.126 0.078 1.72 1.156 1.72 1.156 1.001 1.715 2.627 1.219 3.265 0.931 0.102-0.723 0.392-1.219 0.712-1.498-2.49-0.283-5.11-1.246-5.11-5.545 0-1.226 0.438-2.225 1.154-3.011-0.114-0.285-0.501-1.426 0.111-2.97 0 0 0.941-0.301 3.085 1.15 0.894-0.25 1.854-0.373 2.807-0.377 0.953 0.004 1.913 0.129 2.809 0.379 2.14-1.453 3.083-1.15 3.083-1.15 0.613 1.545 0.227 2.685 0.112 2.969 0.719 0.785 1.153 1.785 1.153 3.011 0 4.31-2.624 5.259-5.123 5.537 0.404 0.348 0.761 1.030 0.761 2.076 0 1.5-0.015 2.709-0.015 3.079 0 0.299 0.204 0.648 0.772 0.538 4.455-1.486 7.666-5.69 7.666-10.645 0-6.195-5.023-11.219-11.219-11.219z"></path>
                    </svg>
                    <Text
                      display={{ base: "none", md: "flex" }}
                      ml={2}
                      fontSize="sm"
                      fontWeight={500}
                      color="#718096"
                    >
                      See Github Issue
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Box flex={3} px={2} mb={3}>
          <Box
            p={4}
            borderRadius="3px"
            bg="white"
            boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
          >
            <Text>
              This request page is powered by <strong>Github Issues</strong>.
              Each request is an issue on the repo.
            </Text>
            <Text mt={4} fontWeight={600}>
              Adding a new request
            </Text>
            <form
              action="https://github.com/junaid33/opensource.builders/issues/new?labels=request"
              method="get"
              target="_blank"
            >
              <Text fontSize="sm" mt={1} fontWeight={500} color="gray.600">
                Name
              </Text>
              <Input name="title" placeholder="Shopify" />
              <Text fontSize="sm" mt={2} fontWeight={500} color="gray.600">
                Description
              </Text>
              <Input name="body" placeholder="E-commerce platform" />
              <Input name="labels" value="request" type="hidden" />
              <Button
                type="submit"
                width="100%"
                mt={3}
                bg="#f0fff4"
                color="rgb(56, 161, 105)"
                _hover={{ bg: "#d3f3dc" }}
                _active={{ bg: "#d3f3dc" }}
              >
                Add Request
              </Button>
            </form>
            <Text mt={6} fontWeight={600}>
              Upvoting a request
            </Text>
            <Text mt={1}>
              To upvote a request, click on the issue and give it a thumbs-up.
            </Text>
          </Box>
        </Box>
      </Box>
    </>
  )
}
