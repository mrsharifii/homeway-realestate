import { useEffect, useState } from "react";
import {
  Flex,
  Select,
  Box,
  Text,
  Input,
  Spinner,
  Icon,
  Button,
  Link,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdCancel } from "react-icons/md";

import { filterData, getFilterValues } from "../utils/filterData";
import { baseUrl, fetchApi } from "../utils/fetchApi";

const SearchFilters = () => {
  const router = useRouter();
  const [filters, setFilters] = useState(filterData);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationData, setLocationData] = useState();
  const [showLocations, setShowLocations] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchProperties = (filterValues) => {
    const { query } = router;
    const values = getFilterValues(filterValues);

    values.forEach((item) => {
      if (item.value && filterValues?.[item.name]) {
        query[item.name] = item.value;
      }
      return values
    });

  };

  const searchResults = () => {
    const path = router.pathname;
    const { query } = router;
    
    router.push({ pathname: path, query: query });

  }


  useEffect(() => {
    if (searchTerm !== "") {
      const fetchData = async () => {
        setLoading(true);
        const data = await fetchApi(
          `${baseUrl}/auto-complete?query=${searchTerm}`
        );
        setLoading(false);
        setLocationData(data?.hits);
      };

      fetchData();
    }
  }, [searchTerm]);

  return (
    <Flex flexWrap="wrap" bg="gray.100" p="4" justifyContent="flex-start">
      {filters.map((filter) => (
        <Box key={filter.queryName}>
          <Select
            placeholder={filter.placeholder}
            w="fit-content"
            p="2"
            bg='white'
            onChange={(e) => searchProperties({ [filter.queryName]: e.target.value })}
          >
            {filter?.items?.map((item) => (
              <option value={item.value} key={item.value}>
                {item.name}
              </option>
            ))}
          </Select>
        </Box>
      ))}
      <Flex flexDir="columns" justifyContent='center' alignItems='start' mt='2' flexWrap='wrap'>
        <Button 
        px="4" py="2" marginLeft='2' mr='2'
        _hover={{bg: 'white', textColor: 'green.500' }}
        bg='green.500'
        textColor='white'
        onClick={() => searchResults()}>
          Find
        </Button>
        <Link href='/search'
          px="4" py="2" marginLeft='2' mr='2'
          rounded='lg'
          bg='gray.300'
          _hover={{bg: 'white', textColor: 'black' }}
          textColor='black'
          fontWeight={500}>
          Clear
        </Link>
          
        <Button
          onClick={() => setShowLocations(!showLocations)}
          px="4" py="2" marginLeft='2'
          _hover={{bg: 'white', textColor: 'blue.500' }}
          bg= {showLocations ? 'white' : 'blue.500'}
          textColor= {showLocations ? 'blue.500' : 'white'}
        >
          Search Location
        </Button>
        {showLocations && (
          <Flex flexDir="column" pos="relative" mx='4'>
            <Input
              placeholder="Search"
              value={searchTerm}
              w="300px"
              bg='white'
              focusBorderColor="gray.500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm !== "" && (
              <Icon
                as={MdCancel}
                pos="absolute"
                cursor="pointer"
                right="5"
                top='3'
                zIndex="100"
                onClick={() => setSearchTerm("")}
              />
            )}
            {loading && <Spinner margin="auto" marginTop="3" />}
            {showLocations && searchTerm !== "" && (
              <Box height="250px" overflow="auto">
                {locationData?.map((location) => (
                  <Box
                    key={location.id}
                    onClick={() => {
                      searchProperties({
                        locationExternalIDs: location.externalID,
                      });
                      setShowLocations(false);
                      setSearchTerm(location.name);
                    }}
                  >
                    <Text
                      cursor="pointer"
                      bg="gray.200"
                      p="2"
                      borderBottom="1px"
                      borderColor="gray.100"
                      width={270}
                    >
                      {location.name}
                    </Text>
                  </Box>
                ))}
                {!loading && !locationData?.length && (
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    flexDir="column"
                    marginTop="5"
                    marginBottom="5"
                  >
                    <Text fontSize="xl" marginTop="3">
                      Waiting to search!
                    </Text>
                  </Flex>
                )}
              </Box>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default SearchFilters;
