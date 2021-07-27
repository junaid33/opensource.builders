import React from "react"

export default (props) => {
  const { pageContext } = props

  console.log(pageContext)
  return <div>{pageContext.name}</div>
}
