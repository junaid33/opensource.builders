import React, { Component } from "react"
import * as JsSearch from "js-search"
import {
  Box,
  Icon,
  Heading,
  Text,
  InputGroup,
  Input,
  InputLeftElement,
  Button,
} from "@chakra-ui/core"
import CompGroup from "./CompGroup"

class Search extends Component {
  state = {
    search: [],
    searchResults: [],
    isLoading: true,
    isError: false,
    searchQuery: ``,
  }
  /**
   * React lifecycle method to fetch the data
   */
  async componentDidMount() {
    this.rebuildIndex()
  }

  /**
   * rebuilds the overall index based on the options
   */
  rebuildIndex = () => {
    const dataToSearch = new JsSearch.Search(`repo`)
    /**
     *  defines a indexing strategy for the data
     * more more about it in here https://github.com/bvaughn/js-search#configuring-the-index-strategy
     */
    dataToSearch.indexStrategy = new JsSearch.AllSubstringsIndexStrategy()

    /**
     * defines the sanitizer for the search
     * to prevent some of the words from being excluded
     *
     */
    dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer()

    /**
     * defines the search index
     * read more in here https://github.com/bvaughn/js-search#configuring-the-search-index
     */
    dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex(`repo`)

    dataToSearch.addIndex(`site`) // sets the index attribute for the data
    dataToSearch.addIndex(`name`) // sets the index attribute for the data
    dataToSearch.addIndex(`repo`) // sets the index attribute for the data
    dataToSearch.addIndex(`license`) // sets the index attribute for the data
    dataToSearch.addIndex(`main`) // sets the index attribute for the data
    dataToSearch.addIndex(`langauge`) // sets the index attribute for the data

    dataToSearch.addDocuments(this.props.comps) // adds the data to be searched
    this.setState({ search: dataToSearch, isLoading: false })
  }

  /**
   * handles the input change and perfom a search with js-search
   * in which the results will be added to the state
   */
  searchData = e => {
    const { search } = this.state
    const queryResult = search.search(e.target.value)
    this.setState({ searchQuery: e.target.value, searchResults: queryResult })
  }
  handleSubmit = e => {
    e.preventDefault()
  }

  render() {
    const { searchResults, searchQuery } = this.state
    const queryResults = searchQuery === `` ? this.props.comps : searchResults

    return (
      <Box>
        <Box
          bg="white"
          boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
        >
          <Box px={{ md: "2rem" }}>
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
              px="1rem"
            >
              <Box py={5}>
                <Heading as="h2" size="lg">
                  Open-source alternatives
                </Heading>
                <Text fontSize="md" fontWeight={400} color="#939fae" mt={1}>
                  Find open-source alternatives for your favorite apps
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box ml="auto" mr="auto" maxWidth="60rem" px={2} py={4}>
          <InputGroup size="lg" mx={1} mb={6}>
            <InputLeftElement
              children={<Icon name="search" color="gray.300" />}
            />
            <Input
              pr="4.5rem"
              placeholder="Search for anything"
              value={searchQuery}
              onChange={this.searchData}
              boxShadow="sm"
            />
          </InputGroup>
          <Box display="flex" flexWrap="wrap">
            {this.props.mainInfo.map(comp => {
              const match = queryResults.filter(alt => alt.mainID === comp.id)
              if (match.length > 0) {
                return <CompGroup comp={comp} alts={match} />
              }
            })}
          </Box>
        </Box>
      </Box>
    )
  }
}

export default Search
