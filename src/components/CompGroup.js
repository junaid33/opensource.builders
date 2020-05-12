import React, { useState, useEffect } from "react"
import { Box, Divider, Link, Tooltip } from "@chakra-ui/core"
import AltListItem from "./AltListItem"
import { LoadMore } from "./LoadMore"

export default function CompGroup({ comp, commercial, alts }) {
  return (
    <Box mb={16} width={{ base: "100%", lg: "50%" }}>
      <Box mx={{ base: 0, sm: 1 }}>
        <Box display="flex">
          {commercial.map(com => (
            <Box display="flex" alignItems="center" ml={2}>
              <Tooltip
                bg="rgb(45, 55, 72)"
                color="rgba(255, 255, 255, 0.92);"
                label={com.main}
                placement="top"
              >
                <Box as="a" href={com.website} target="_blank">
                  <Box
                    as="img"
                    height="3rem"
                    minWidth="3rem"
                    bg="white"
                    boxShadow="md"
                    p={1}
                    // py={3}
                    // px={4}
                    borderRadius={5}
                    src={com.svg}
                    alt=""
                  />
                </Box>
              </Tooltip>
            </Box>
          ))}
        </Box>
        {/* <Box display="flex" alignItems="center">
          <Box>
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
          </Box>
          <Link
            role="group"
            bg="gray.50"
            borderRadius="4px"
            py={2}
            px={3}
            color="gray.500"
            display="flex"
            alignItems="center"
            ml="auto"
            _hover={{ textDecoration: "none" }}
            href={comp.website}
            target="_blank"
            fontWeight={500}
            fontSize={15}
            mr={1}
          >
            <PseudoBox
              fontWeight={500}
              fontSize={15}
              mr={2}
              transition="all 0.15s ease-out"
              _groupHover={{ pr: 1 }}
              display={{ base: "none", sm: "flex" }}
            >
              {comp.main}
            </PseudoBox>
            <Box size={4}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-arrow-up-right"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </Box>
          </Link>
        </Box> */}
        <Divider borderColor="gray.400" />
        <Box display="flex" flexWrap="wrap">
          {alts.length <= 5 ? (
            alts.map(alt => <AltListItem alt={alt} />)
          ) : (
            <LoadMore alts={alts} />
          )}
        </Box>
      </Box>
    </Box>
  )
}
