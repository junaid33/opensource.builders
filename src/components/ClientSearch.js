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
  PseudoBox,
} from "@chakra-ui/core"
import CompGroup from "./CompGroup"

class Search extends Component {
  state = {
    search: [],
    searchResults: [],
    isLoading: true,
    isError: false,
    searchQuery: ``,
    category: "",
    language: "",
    license: "",
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
    dataToSearch.addIndex(`language`) // sets the index attribute for the data
    dataToSearch.addIndex(`category`) // sets the index attribute for the data

    dataToSearch.addDocuments(this.props.comps) // adds the data to be searched
    this.setState({ search: dataToSearch, isLoading: false })
  }

  /**
   * handles the input change and perfom a search with js-search
   * in which the results will be added to the state
   */

  licenseFilter = (e) => {
    const { search, searchQuery, language, category } = this.state
    const queryResult = search.search(
      searchQuery + " " + e + " " + language + " " + category
    )
    this.setState({
      searchResults: queryResult,
      license: e,
    })
  }

  languageFilter = (e) => {
    const { search, searchQuery, license, category } = this.state
    const queryResult = search.search(
      searchQuery + " " + license + " " + e + " " + category
    )
    this.setState({
      searchResults: queryResult,
      language: e,
    })
  }

  categoryFilter = (e) => {
    const { search, searchQuery, language, license } = this.state
    const queryResult = search.search(
      searchQuery + " " + license + " " + language + " " + e
    )
    this.setState({
      searchResults: queryResult,
      category: e,
    })

    console.log({ queryResult })
  }

  searchData = (e) => {
    console.log(e)
    const { search, license, language, category } = this.state
    const queryResult = search.search(
      e + " " + license + " " + language + " " + category
    )
    this.setState({
      searchQuery: e,
      searchResults: queryResult,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
  }

  render() {
    const {
      searchResults,
      searchQuery,
      category,
      language,
      license,
    } = this.state
    const queryResults =
      searchQuery === `` && license === `` && language === `` && category === ``
        ? this.props.comps
        : searchResults

    const compLoad =
      searchQuery === `` && license === `` && language === `` && category === ``
        ? this.props.mainInfo.slice(0, this.props.loadCount)
        : this.props.mainInfo

    const categories = [
      "E-commerce",
      "Developer Tools",
      "Social Media",
      "Communication",
      "Analytics",
      "Password Managers",
      "Form Builder",
      "Cloud",
      "Deployment",
      "Product Management",
      "Automation",
      "CRM",
    ]

    const licenses = [
      "GPL V3",
      "BSD-3",
      "GPL",
      "MIT",
      "OSL-3.0",
      "APACHE 2.0",
      "AGPL V3",
      "CUSTOM",
    ]

    const languages = [
      "GO",
      "JS",
      "PYTHON",
      "PHP",
      "ELIXIR",
      "RUBY",
      "C",
      "C#",
      "C++",
      "SHELL",
      "TS",
      "PERL",
    ]

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

        <Box ml="auto" mr="auto" maxWidth="80rem" px={2} py={4}>
          <Box>
            <InputGroup size="lg" mx={1} mb={6}>
              <InputLeftElement
                children={<Icon name="search" color="gray.300" />}
              />
              <Input
                pr="4.5rem"
                placeholder="Search for anything"
                value={searchQuery}
                onChange={(e) => {
                  this.searchData(e.target.value)
                }}
                boxShadow="sm"
              />
            </InputGroup>
            <Box
              display="flex"
              alignItems="flex-start"
              flexDirection={{ base: "column", md: "row" }}
            >
              <Box
                p={3}
                maxWidth={{ base: "100%", md: "18rem" }}
                // bg="#122a4f"
                bg="white"
                boxShadow="md"
                borderRadius={4}
                mx={1}
                mb={6}
              >
                <Box>
                  <Box display="flex" flexDirection="column">
                    <Box mb={5}>
                      <Box color="gray.600" mx={2} mb={1} fontWeight={500}>
                        Categories
                      </Box>
                      <Box display="flex" flexWrap="wrap">
                        <PseudoBox
                          px={3}
                          py={1}
                          m={1}
                          borderRadius={4}
                          color={"white"}
                          fontWeight={600}
                          fontSize="sm"
                          letterSpacing="wide"
                          bg={category === "" ? "#122a4f" : "#2b4a7b"}
                          textTransform="uppercase"
                          _hover={category !== "" && { bg: "#1a3765" }}
                          onClick={() => this.categoryFilter("")}
                          cursor="pointer"
                        >
                          All
                        </PseudoBox>
                        {categories.map((c) => (
                          <PseudoBox
                            px={3}
                            py={1}
                            m={1}
                            borderRadius={4}
                            color={"white"}
                            fontWeight={600}
                            letterSpacing="wide"
                            fontSize="sm"
                            bg={category === c ? "#122a4f" : "#2b4a7b"}
                            textTransform="uppercase"
                            _hover={category !== c && { bg: "#1a3765" }}
                            onClick={() => this.categoryFilter(c)}
                            cursor="pointer"
                          >
                            {c}
                          </PseudoBox>
                        ))}
                      </Box>
                    </Box>
                    <Box mb={5}>
                      <Box color="gray.600" mx={2} mb={1} fontWeight={500}>
                        License
                      </Box>
                      <Box display="flex" flexWrap="wrap">
                        <PseudoBox
                          px={3}
                          py={1}
                          m={1}
                          borderRadius={4}
                          color={"white"}
                          fontWeight={600}
                          letterSpacing="wide"
                          fontSize="sm"
                          bg={license === "" ? "#122a4f" : "#00bf70"}
                          textTransform="uppercase"
                          _hover={license !== "" && { bg: "#029c5d" }}
                          onClick={() => this.licenseFilter("")}
                          cursor="pointer"
                        >
                          All
                        </PseudoBox>
                        {licenses.map((c) => (
                          <PseudoBox
                            px={3}
                            py={1}
                            m={1}
                            borderRadius={4}
                            color={"white"}
                            fontWeight={600}
                            fontSize="sm"
                            letterSpacing="wide"
                            bg={license === c ? "#122a4f" : "#00bf70"}
                            textTransform="uppercase"
                            _hover={license !== c && { bg: "#029c5d" }}
                            onClick={() => this.licenseFilter(c)}
                            cursor="pointer"
                          >
                            {c}
                          </PseudoBox>
                        ))}
                      </Box>
                    </Box>
                    <Box>
                      <Box color="gray.600" mx={2} mb={1} fontWeight={500}>
                        Language
                      </Box>
                      <Box display="flex" flexWrap="wrap">
                        <PseudoBox
                          px={3}
                          py={1}
                          m={1}
                          borderRadius={4}
                          color={"white"}
                          fontSize="sm"
                          fontWeight={600}
                          letterSpacing="wide"
                          bg={language === "" ? "#122a4f" : "orange.500"}
                          textTransform="uppercase"
                          _hover={language !== "" && { bg: "#af5417" }}
                          onClick={() => this.languageFilter("")}
                          cursor="pointer"
                        >
                          All
                        </PseudoBox>
                        {languages.map((c) => (
                          <PseudoBox
                            px={3}
                            py={1}
                            m={1}
                            borderRadius={4}
                            color={"white"}
                            fontWeight={600}
                            letterSpacing="wide"
                            fontSize="sm"
                            bg={language === c ? "#122a4f" : "orange.500"}
                            textTransform="uppercase"
                            _hover={language !== c && { bg: "#af5417" }}
                            onClick={() => this.languageFilter(c)}
                            cursor="pointer"
                          >
                            {c}
                          </PseudoBox>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" flexWrap="wrap" width="100%">
                {compLoad.map((comp) => {
                  const match = queryResults.filter(
                    (alt) => alt.mainID === comp.id
                  )
                  if (match.length > 0) {
                    return (
                      <CompGroup
                        comp={comp}
                        commercial={comp.commercial}
                        alts={match}
                      />
                    )
                  }
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }
}

export default Search
