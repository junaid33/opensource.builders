import React from "react"
import { Link } from "gatsby"
import {
  Box,
  PseudoBox,
  Text,
  useColorMode,
  useDisclosure,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/core"
import Logo from "./logo"

export default function Header({ children, location }) {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  const navItem = ({ name, to, my, onClick }) => (
    <Link to={to} onClick={onClick}>
      <PseudoBox
        fontSize=".875rem"
        color="white"
        fontWeight="500"
        bg={location.pathname === to && "#304571"}
        _hover={{ color: "gray.50", bg: location.pathname != to && "#1a294c" }}
        px={2}
        py={1}
        mx={2}
        borderRadius={3}
        my={my}
      >
        {name}
      </PseudoBox>
    </Link>
  )

  return (
    <Box
      bg="gray.800"
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
          p=".75rem"
        >
          <Box flex={3}>
            <Link to="/">
              <Box display="flex" my={3} pr={2}>
                <Box minWidth="46px" maxWidth="0px">
                  <Logo />
                </Box>
                <Box>
                  <Text
                    color="gray.200"
                    pl=".6rem"
                    fontWeight={800}
                    fontSize="sm"
                    lineHeight=".8rem"
                    letterSpacing="widest"
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
          </Box>
          <>
            <Popover>
              {({ isOpen, onClose }) => (
                <>
                  <PopoverTrigger>
                    <Button
                      ml="auto"
                      px={1}
                      bg="transparent"
                      color="#9fa6b2"
                      display={{
                        base: "flex",
                        sm: "none",
                      }}
                      _hover={{ bg: "#374151", color: "#fff" }}
                      ref={btnRef}
                      onClick={onOpen}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 6H20M4 12H20M4 18H20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent zIndex={4} width="200px" py={2} bg="gray.800">
                    <PopoverBody>
                      {process.env.NODE_ENV === "development" &&
                        navItem({
                          to: "/edit",
                          name: "Edit",
                          my: 2,
                          onClick: onClose,
                        })}
                      {navItem({
                        to: "/",
                        name: "Alternatives",
                        my: 2,
                        onClick: onClose,
                      })}
                      {navItem({
                        to: "/requests",
                        name: "Requests",
                        my: 2,
                        onClick: onClose,
                      })}
                      {navItem({
                        to: "/about",
                        name: "About",
                        my: 2,
                        onClick: onClose,
                      })}
                      <PseudoBox
                        display="flex"
                        alignItems="center"
                        borderRadius={4}
                        mx={2}
                        px={2}
                        py={1}
                        as="a"
                        href="https://github.com/junaid33/opensource.builders"
                        target="_blank"
                        _hover={{ color: "gray.50", bg: "#1a294c" }}
                      >
                        <svg
                          stroke="#ffffff"
                          fill="#ffffff"
                          strokeWidth="0"
                          version="1.1"
                          viewBox="0 0 32 32"
                          height="1.2em"
                          width="1.2em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M16 5.343c-6.196 0-11.219 5.023-11.219 11.219 0 4.957 3.214 9.162 7.673 10.645 0.561 0.103 0.766-0.244 0.766-0.54 0-0.267-0.010-1.152-0.016-2.088-3.12 0.678-3.779-1.323-3.779-1.323-0.511-1.296-1.246-1.641-1.246-1.641-1.020-0.696 0.077-0.682 0.077-0.682 1.126 0.078 1.72 1.156 1.72 1.156 1.001 1.715 2.627 1.219 3.265 0.931 0.102-0.723 0.392-1.219 0.712-1.498-2.49-0.283-5.11-1.246-5.11-5.545 0-1.226 0.438-2.225 1.154-3.011-0.114-0.285-0.501-1.426 0.111-2.97 0 0 0.941-0.301 3.085 1.15 0.894-0.25 1.854-0.373 2.807-0.377 0.953 0.004 1.913 0.129 2.809 0.379 2.14-1.453 3.083-1.15 3.083-1.15 0.613 1.545 0.227 2.685 0.112 2.969 0.719 0.785 1.153 1.785 1.153 3.011 0 4.31-2.624 5.259-5.123 5.537 0.404 0.348 0.761 1.030 0.761 2.076 0 1.5-0.015 2.709-0.015 3.079 0 0.299 0.204 0.648 0.772 0.538 4.455-1.486 7.666-5.69 7.666-10.645 0-6.195-5.023-11.219-11.219-11.219z"></path>
                        </svg>
                      </PseudoBox>
                    </PopoverBody>
                  </PopoverContent>
                </>
              )}
            </Popover>
          </>
          <Box display={{ base: "none", sm: "flex" }}>
            {process.env.NODE_ENV === "development" &&
              navItem({ to: "/edit", name: "Edit" })}
            {navItem({ to: "/", name: "Alternatives" })}
            {navItem({ to: "/requests", name: "Requests" })}
            {navItem({ to: "/about", name: "About" })}
            <PseudoBox
              display="flex"
              alignItems="center"
              borderRadius={4}
              px={2}
              as="a"
              href="https://github.com/junaid33/opensource.builders"
              target="_blank"
              _hover={{ color: "gray.50", bg: "#1a294c" }}
            >
              <svg
                stroke="#ffffff"
                fill="#ffffff"
                strokeWidth="0"
                version="1.1"
                viewBox="0 0 32 32"
                height="1.2em"
                width="1.2em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 5.343c-6.196 0-11.219 5.023-11.219 11.219 0 4.957 3.214 9.162 7.673 10.645 0.561 0.103 0.766-0.244 0.766-0.54 0-0.267-0.010-1.152-0.016-2.088-3.12 0.678-3.779-1.323-3.779-1.323-0.511-1.296-1.246-1.641-1.246-1.641-1.020-0.696 0.077-0.682 0.077-0.682 1.126 0.078 1.72 1.156 1.72 1.156 1.001 1.715 2.627 1.219 3.265 0.931 0.102-0.723 0.392-1.219 0.712-1.498-2.49-0.283-5.11-1.246-5.11-5.545 0-1.226 0.438-2.225 1.154-3.011-0.114-0.285-0.501-1.426 0.111-2.97 0 0 0.941-0.301 3.085 1.15 0.894-0.25 1.854-0.373 2.807-0.377 0.953 0.004 1.913 0.129 2.809 0.379 2.14-1.453 3.083-1.15 3.083-1.15 0.613 1.545 0.227 2.685 0.112 2.969 0.719 0.785 1.153 1.785 1.153 3.011 0 4.31-2.624 5.259-5.123 5.537 0.404 0.348 0.761 1.030 0.761 2.076 0 1.5-0.015 2.709-0.015 3.079 0 0.299 0.204 0.648 0.772 0.538 4.455-1.486 7.666-5.69 7.666-10.645 0-6.195-5.023-11.219-11.219-11.219z"></path>
              </svg>
            </PseudoBox>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
