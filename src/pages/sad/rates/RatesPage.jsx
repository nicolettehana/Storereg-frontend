import { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Button, Container, HStack, Stack } from "@chakra-ui/react";
import { useFetchYearRange } from "../../../hooks/masterQueries";
import { useFetchRates } from "../../../hooks/ratesQueries";
import { MdOutlineHome } from "react-icons/md";
import { useFetchCategories } from "../../../hooks/masterQueries";
import SearchInput from "../../../components/core/SearchInput";
import { useDebounce } from "use-debounce";
import { PageSizing } from "../../../components/core/Table";
import { useNavigate } from "react-router-dom";
import CategoriesFilter from "../../../components/filter/CategoriesFilter";
import YearRangeFilter from "../../../components/filter/YearRangeFilter";
import RatesTableWrapper from "./RatesTableWrapper";

const RatesPage = () => {
  // States
  const [quarterCode, setQuarterCode] = useState("");
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("all");
  const [categoryCode, setCategoryCode] = useState("");
  const [yearRangeId, setYearRangeId] = useState("");

  // Hooks
  const [searchValue] = useDebounce(searchText, 300);
  const navigate = useNavigate();

  // Queries
  const categoryQuery = useFetchCategories();
  const yearRangeQuery = useFetchYearRange();
  const ratesQuery = useFetchRates(
    categoryCode === "" ? null : categoryCode,
    searchValue,
    pageNumber,
    pageSize,
    yearRangeId
  );

  return (
    <>
      {/* Main */}
      <Main>
        <Section>
          <Container minW="full">
            <Stack spacing={4}>
              {/* Filter */}
              <HStack justifyContent="space-between" spacing={2}>
                <HStack>
                  <YearRangeFilter
                    yearRangeId={yearRangeId}
                    setYearRangeId={setYearRangeId}
                    setPageNumber={setPageNumber}
                    query={yearRangeQuery}
                  />
                  <CategoriesFilter
                    categoryCode={categoryCode}
                    setCategoryCode={setCategoryCode}
                    setPageNumber={setPageNumber}
                    query={categoryQuery}
                  />
                </HStack>

                <Button
                  variant="brand"
                  leftIcon={<MdOutlineHome />}
                  onClick={() => {
                    navigate("/sad/rates/create");
                  }}
                >
                  Add New Rate
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
              <RatesTableWrapper
                query={ratesQuery}
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

export default RatesPage;
