import React, { useState } from "react"
import { Text, Box, Icon } from "@chakra-ui/core"
import AltListItem from "./AltListItem"

export function LoadMore({ alts }) {
  const [show, setShow] = useState(false)

  const fiveAlts = alts.slice(0, 5)
  const restAlts = alts.slice(5, alts.length)

  return (
    <>
      {fiveAlts.map((alt) => (
        <AltListItem alt={alt} />
      ))}
      {show && restAlts.map((alt) => <AltListItem alt={alt} />)}
      <Box cursor="pointer" width="100%" display="flex" justifyContent="center">
        <Text
          display="flex"
          alignItems="center"
          bg="white"
          pl={3}
          pr={2}
          py={1}
          letterSpacing="wide"
          boxShadow="sm"
          borderRadius={3}
          fontWeight={600}
          color="gray.500"
          textTransform="uppercase"
          fontSize="xs"
          mt={2}
          onClick={() => setShow(!show)}
        >
          {show ? (
            <>
              Hide
              <Icon ml={1} size={4} name="chevron-up" />
            </>
          ) : (
            <>
              {alts.length - 5} More Alternative{alts.length - 5 !== 1 && "s"}
              <Icon ml={1} size={4} name="chevron-down" />
            </>
          )}
        </Text>
      </Box>
    </>
  )
}
