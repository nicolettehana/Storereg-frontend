import React, { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import {
  Container,
  HStack,
  Icon,
  SimpleGrid,
  Skeleton,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
} from "@chakra-ui/react";
import ESTPendingApplicationTableWrapper from "./ESTPendingApplicationTableWrapper";
import { useFetchPendingQuartersAllotment } from "../../../hooks/quartersQueries";
import { useDebounce } from "use-debounce";
import SearchInput from "../../../components/core/SearchInput";
import { PageSizing } from "../../../components/core/Table";
import { useFetchVacateRequestStats } from "../../../hooks/vacateRequestQueries";
import { MdOutlineLogout, MdOutlinePendingActions } from "react-icons/md";
import { Link } from "react-router-dom";

const ESTInboxPage = () => {
  // States
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Hooks
  const [searchValue] = useDebounce(searchText, 300);

  // Queries
  const quartersQuery = useFetchPendingQuartersAllotment(
    searchValue,
    pageNumber,
    pageSize
  );
  const vacateRequestStatsQuery = useFetchVacateRequestStats();

  return (
    <Main>
      <Section>
        <Container maxW="container.sm">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <HStack
              border="1px"
              borderColor="border"
              rounded="md"
              p={4}
              shadow="sm"
            >
              <Stat>
                <StatNumber color="brand.600" fontSize="4xl">
                  <Skeleton
                    isLoaded={!vacateRequestStatsQuery.isPending}
                    fadeDuration={1}
                    w={24}
                  >
                    {vacateRequestStatsQuery?.data?.data?.pendingAllotments}
                  </Skeleton>
                </StatNumber>
                <StatLabel>Pending Allotments</StatLabel>
              </Stat>
              <Icon
                as={MdOutlinePendingActions}
                boxSize={10}
                color="brand.600"
              />
            </HStack>

            <HStack
              as={Link}
              to="/est/vacate-requests"
              border="1px"
              borderColor="border"
              rounded="md"
              p={4}
              shadow="sm"
            >
              <Stat>
                <StatNumber color="red.600" fontSize="4xl">
                  <Skeleton
                    isLoaded={!vacateRequestStatsQuery.isPending}
                    fadeDuration={1}
                    w={24}
                  >
                    {vacateRequestStatsQuery?.data?.data?.vacateRequests}
                  </Skeleton>
                </StatNumber>
                <StatLabel>Vacate Requests</StatLabel>
              </Stat>
              <Icon as={MdOutlineLogout} boxSize={10} color="red.600" />
            </HStack>
          </SimpleGrid>
        </Container>
      </Section>

      <Section>
        <Container minW="full">
          <Stack spacing={4}>
            {/* Filter */}
            <HStack justifyContent="space-between">
              <PageSizing
                pageSize={pageSize}
                setPageSize={setPageSize}
                setPageNumber={setPageNumber}
              />
              <SearchInput
                searchText={searchText}
                setSearchText={setSearchText}
                setPageNumber={setPageNumber}
                w="fit-content"
              />
            </HStack>

            {/* Table */}
            <ESTPendingApplicationTableWrapper
              query={quartersQuery}
              searchText={searchText}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
          </Stack>
        </Container>
      </Section>
    </Main>
  );
};

export default ESTInboxPage;
