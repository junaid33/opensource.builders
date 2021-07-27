import React, { useState } from "react"
import { useBottomScrollListener } from "react-bottom-scroll-listener"
import { Box, Text, Icon } from "@chakra-ui/core"
import { graphql } from "gatsby"
import { useJsonForm } from "gatsby-tinacms-json"
import SEO from "../components/seo"
import ClientSearch from "../components/ClientSearch"

const SearchTemplate = (props) => {
  const [loadCount, setLoadCount] = useState(6)

  const { pageContext } = props
  const { compData } = pageContext
  const { allComps, mainInfo, options } = compData

  const fiveComp = mainInfo.slice(0, loadCount)
  const restComp = mainInfo.slice(loadCount, mainInfo.length)

  function handleScroll() {
    if (loadCount < mainInfo.length) {
      setLoadCount(loadCount + 6)
    }
  }

  useBottomScrollListener(() => handleScroll())

  return (
    <>
      <SEO title="Find open-source alternatives for your favorite apps" />
      <ClientSearch
        comps={allComps}
        loadCount={loadCount}
        mainInfo={mainInfo}
      />
    </>
  )
}
export default SearchTemplate
