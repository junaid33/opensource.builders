import React from "react"
import { graphql } from "gatsby"
import { useLocalJsonForm } from "gatsby-tinacms-json"
import ClientSearch from "../components/ClientSearch"

const SearchTemplate = props => {
  const { pageContext } = props
  const { compData } = pageContext
  const { allComps, mainInfo, options } = compData

  return (
    <>
      <ClientSearch comps={allComps} mainInfo={mainInfo}/>
    </>
  )
}
export default SearchTemplate