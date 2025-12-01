import { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Button, Container, HStack, Stack } from "@chakra-ui/react";
import {
  useFetchQuartersByType,
  useFetchQuarterStats,
} from "../../../hooks/quartersQueries";
import {
  useFetchCategories,
  useFetchCategoryStats,
} from "../../../hooks/masterQueries";
import { useFetchFirmsByType } from "../../../hooks/firmQueries";
import { MdOutlineHome } from "react-icons/md";
import FirmsTableWrapper from "./FirmsTableWrapper";
import CategoriesFilter from "../../../components/filter/CategoriesFilter";
import SearchInput from "../../../components/core/SearchInput";
import { useDebounce } from "use-debounce";
import { PageSizing } from "../../../components/core/Table";
import QuarterStats from "../../../components/quarterStats/QuarterStats";
import FirmCategoryStats from "../../../components/stats/FirmCategoryStats";
import { useNavigate } from "react-router-dom";

const FirmsPage = () => {
  // States
  const [quarterCode, setQuarterCode] = useState("");
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("all");
  const [categoryCode, setCategoryCode] = useState("");

  // Hooks
  const [searchValue] = useDebounce(searchText, 300);
  const navigate = useNavigate();

  // Queries
  const categoryQuery = useFetchCategories();
  const firmsByTypeQuery = useFetchFirmsByType(
    categoryCode === "" ? null : categoryCode,
    searchValue,
    pageNumber,
    pageSize
  );

  const categoryStatsQuery = useFetchCategoryStats();

  return (
    <>
      {/* Main */}
      <Main>
        <Section>
          <Container maxW="container.lg">
            <FirmCategoryStats
              data={categoryStatsQuery?.data?.data}
              isPending={categoryStatsQuery.isPending}
            />
          </Container>
        </Section>

        <Section>
          <Container minW="full">
            <Stack spacing={4}>
              {/* Filter */}
              <HStack justifyContent="space-between" spacing={2}>
                <HStack>
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
                    navigate("/sad/firms/create");
                  }}
                >
                  Add New Firm
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
              <FirmsTableWrapper
                query={firmsByTypeQuery}
                searchText={searchText}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              />
              {/* Table */}
              {/* <QuartersTableWrapper
                query={quarterByTypeQuery}
                searchText={searchText}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              /> */}
            </Stack>
          </Container>
        </Section>
      </Main>
    </>
  );
};

export default FirmsPage;
