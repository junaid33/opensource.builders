import React from "react"
import {
  Box,
  Badge,
  Icon,
  Heading,
  Divider,
  Text,
  Tooltip,
} from "@chakra-ui/core"
import { deployLogo } from "./deployLogo"

export default function AltListItem({ alt }) {
  return (
    <Box
      width={{ base: "100%" }}
      borderRadius="4px"
      m={2}
      boxShadow="0px 1px 4px rgba(0, 0, 0, 0.16)"
      bg="white"
    >
      <Box as="a" target="_blank" href={alt.site}>
        <Box display="flex" p={2}>
          <Box display="flex">
            <Box
              as="img"
              height="56px"
              width="56px"
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
                  <Badge ml={3} variantColor="green">
                    {alt.language}
                  </Badge>
                </Tooltip>
                <Tooltip
                  variantColor="blue"
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
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
              <Box size={5} mx={3} as="a" href={alt.site} target="_blank">
                <svg viewBox="0 0 24 24" focusable="false" role="presentation">
                  <path
                    fill="#718096"
                    d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                  />
                </svg>
              </Box>
            </Tooltip>
          </Box>
        </Box>
        <Divider display={{ sm: "none" }} my={0} borderColor="#edf1f6" />
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
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
            borderLeft="1px solid #edf1f6"
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
                site
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
    </Box>
  )
}
