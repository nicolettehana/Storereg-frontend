import { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Button, Container, HStack, Stack } from "@chakra-ui/react";
import {
  useFetchQuartersByType,
  useFetchQuarterStats,
  useFetchQuarterTypes,
} from "../../../hooks/quartersQueries";
import { MdOutlineHome } from "react-icons/md";
import QuartersTableWrapper from "../../ch/quarters/QuartersTableWrapper";
import QuartersFilter from "../../ch/quarters/QuartersFilter";
import SearchInput from "../../../components/core/SearchInput";
import { useDebounce } from "use-debounce";
import { PageSizing } from "../../../components/core/Table";
import QuarterStats from "../../../components/quarterStats/QuarterStats";
import { useNavigate } from "react-router-dom";
import StatusFilter from "../../ch/quarters/StatusFilter";

const EstQuartersPage = () => {
  // States
  const [quarterCode, setQuarterCode] = useState("");
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("all");

  // Hooks
  const [searchValue] = useDebounce(searchText, 300);
  const navigate = useNavigate();

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
    <>
      {/* Main */}
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
              <HStack justifyContent="space-between" spacing={2}>
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

                <Button
                  variant="brand"
                  leftIcon={<MdOutlineHome />}
                  onClick={() => {
                    navigate("/est/quarters/create");
                  }}
                >
                  Add New Quarter
                </Button>
              </HStack>

              {/* Filters */}
              <HStack justifyContent="space-between" spacing={4}>
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
              <QuartersTableWrapper
                query={quarterByTypeQuery}
                searchText={searchText}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              />
            </Stack>
          </Container>
        </Section>
      </Main>
    </>
  );
};

export default EstQuartersPage;
