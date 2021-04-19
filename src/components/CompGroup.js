import React, { useState, useEffect } from "react"
import { Box, Divider, Link, Tooltip } from "@chakra-ui/core"
import AltListItem from "./AltListItem"
import { LoadMore } from "./LoadMore"

export default function CompGroup({ comp, commercial, alts }) {
  return (
    <Box mb={16} width={{ base: "100%", lg: "50%" }}>
      <Box mx={{ base: 0, sm: 1 }}>
        <Box display="flex">
          {commercial.map((com) => (
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
        <Divider borderColor="gray.400" />
        <Box display="flex" flexWrap="wrap">
          {alts.length <= 5 ? (
            alts.map((alt) => <AltListItem alt={alt} />)
          ) : (
            <LoadMore alts={alts} />
          )}
        </Box>
      </Box>
    </Box>
  )
}
