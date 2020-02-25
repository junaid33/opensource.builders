import React from "react"
import { Link } from "gatsby"
import { Box, PseudoBox, Text } from "@chakra-ui/core"
import Logo from "./logo"
import Github from "./github"

export default function Header({ children }) {
  return (
    <Box
      bg="gray.700"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
    >
      <Box px={{ md: "2rem" }}>
        <Box
          as="nav"
          position="relative"
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
          p="1rem"
        >
          {/* <Box
            as="img"
            w="2rem"
            h="2rem"
            mb="0"
            src="https://polished-sunset-0ex44e5cb9xt.tailwindcss.com/img/example-logo.svg"
            alt=""
          /> */}
          <Link to="/">
            <Box display="flex">
              <Box width="46px">
                <Logo />
              </Box>
              <Box>
                <Text
                  color="gray.200"
                  pl=".6rem"
                  fontWeight={800}
                  fontSize="sm"
                  lineHeight=".8rem"
                  letterSpacing="2px"
                >
                  OPENSOURCE
                </Text>
                <Text
                  color="white"
                  pl={2}
                  fontWeight={500}
                  fontSize="4xl"
                  lineHeight="2.3rem"
                  letterSpacing=".5px"
                >
                  Builders
                </Text>
              </Box>
            </Box>
          </Link>

          <Box display="flex">
            <Link to="/">
              <PseudoBox
                fontSize=".875rem"
                color="white"
                fontWeight="500"
                _hover={{ color: "gray.50" }}
                px={2}
              >
                Alternatives
              </PseudoBox>
            </Link>
            <Link to="/requests">
              <PseudoBox
                fontSize=".875rem"
                color="white"
                fontWeight="500"
                _hover={{ color: "gray.50" }}
                px={2}
              >
                Requests
              </PseudoBox>
            </Link>
            <Link to="/about">
              <PseudoBox
                fontSize=".875rem"
                color="white"
                fontWeight="500"
                _hover={{ color: "gray.50" }}
                px={2}
              >
                About
              </PseudoBox>
            </Link>
            <Box
              px={3}
              as="a"
              href="https://github.com/junaid33/opensource.builders"
              target="_blank"
            >
              <Github color="white" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
