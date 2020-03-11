import React from "react"
import ClientSearch from "../components/ClientSearch"

const SearchTemplate = props => {
  const { pageContext } = props
  const { compData } = pageContext
  const { allComps, mainInfo, options } = compData
  return (
    <>
      <ClientSearch comps={allComps} mainInfo={mainInfo} engine={options} />
    </>
  )
}
export default SearchTemplate
