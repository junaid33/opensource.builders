import React from "react"
import { Link } from "gatsby"
import { Box, PseudoBox, Text, useColorMode, Button } from "@chakra-ui/core"
import Logo from "./logo"

export default function Header({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();

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
              <svg
                stroke="#ffffff"
                fill="#ffffff"
                stroke-width="0"
                version="1.1"
                viewBox="0 0 32 32"
                height="1.2em"
                width="1.2em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 5.343c-6.196 0-11.219 5.023-11.219 11.219 0 4.957 3.214 9.162 7.673 10.645 0.561 0.103 0.766-0.244 0.766-0.54 0-0.267-0.010-1.152-0.016-2.088-3.12 0.678-3.779-1.323-3.779-1.323-0.511-1.296-1.246-1.641-1.246-1.641-1.020-0.696 0.077-0.682 0.077-0.682 1.126 0.078 1.72 1.156 1.72 1.156 1.001 1.715 2.627 1.219 3.265 0.931 0.102-0.723 0.392-1.219 0.712-1.498-2.49-0.283-5.11-1.246-5.11-5.545 0-1.226 0.438-2.225 1.154-3.011-0.114-0.285-0.501-1.426 0.111-2.97 0 0 0.941-0.301 3.085 1.15 0.894-0.25 1.854-0.373 2.807-0.377 0.953 0.004 1.913 0.129 2.809 0.379 2.14-1.453 3.083-1.15 3.083-1.15 0.613 1.545 0.227 2.685 0.112 2.969 0.719 0.785 1.153 1.785 1.153 3.011 0 4.31-2.624 5.259-5.123 5.537 0.404 0.348 0.761 1.030 0.761 2.076 0 1.5-0.015 2.709-0.015 3.079 0 0.299 0.204 0.648 0.772 0.538 4.455-1.486 7.666-5.69 7.666-10.645 0-6.195-5.023-11.219-11.219-11.219z"></path>
              </svg>
            </Box>

            <header>
              <Button onClick={toggleColorMode}>
                Toggle {colorMode === "light" ? "Dark" : "Light"}
              </Button>
            </header>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
