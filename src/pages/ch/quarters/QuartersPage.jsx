import React, { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Container, HStack, Stack } from "@chakra-ui/react";
import {
  useFetchQuartersByType,
  useFetchQuarterStats,
  useFetchQuarterTypes,
} from "../../../hooks/quartersQueries";
import QuartersTableWrapper from "./QuartersTableWrapper";
import QuartersFilter from "./QuartersFilter";
import { PageSizing } from "../../../components/core/Table";
import QuarterStats from "../../../components/quarterStats/QuarterStats";
import { useDebounce } from "use-debounce";
import SearchInput from "../../../components/core/SearchInput";
import StatusFilter from "./StatusFilter";

const QuartersPage = () => {
  // States
  const [quarterCode, setQuarterCode] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("all");

  // Hooks
  const [searchValue] = useDebounce(searchText, 300);

  // Queries
  const typeQuery = useFetchQuarterTypes();
  const quarterByTypeQuery = useFetchQuartersByType(
    quarterCode === "" ? null : quarterCode,
    searchValue,
    pageNumber,
    pageSize,
    status
  );
  const quarterStatsQuery = useFetchQuarterStats();

  return (
    <Main>
      <Section>
        <Container maxW="container.lg">
          <QuarterStats
            data={quarterStatsQuery?.data?.data}
            isPending={quarterStatsQuery.isPending}
          />
        </Container>
      </Section>

      <Section>
        <Container minW="full">
          <Stack spacing={4}>
            {/* Filter */}
            <HStack justifyContent="end">
              <SearchInput
                searchText={searchText}
                setSearchText={setSearchText}
                setPageNumber={setPageNumber}
                w="fit-content"
              />
            </HStack>

            <HStack justifyContent="space-between" gap={2}>
              <PageSizing
                pageSize={pageSize}
                setPageSize={setPageSize}
                setPageNumber={setPageNumber}
              />

              <HStack>
                <QuartersFilter
                  quarterCode={quarterCode}
                  setQuarterCode={setQuarterCode}
                  setPageNumber={setPageNumber}
                  query={typeQuery}
                />

                <StatusFilter
                  status={status}
                  setStatus={setStatus}
                  setPageNumber={setPageNumber}
                />
              </HStack>
            </HStack>

            {/* Table */}
            <QuartersTableWrapper
              isEstate={false}
              query={quarterByTypeQuery}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              searchText={searchText}
            />
          </Stack>
        </Container>
      </Section>
    </Main>
  );
};

export default QuartersPage;
