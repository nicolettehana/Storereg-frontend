import { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Button, Container, HStack, Stack, SimpleGrid, useDisclosure } from "@chakra-ui/react";

import {
  useFetchCategories,
  useFetchCategoryStats,
} from "../../../hooks/masterQueries";
import { useFetchFirmsByType } from "../../../hooks/firmQueries";
import { useFetchYearRange } from "../../../hooks/masterQueries";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import FirmsTableWrapper from "./FirmsTableWrapper";
import CategoriesFilter from "../../../components/filter/CategoriesFilter";
import SearchInput from "../../../components/core/SearchInput";
import { useDebounce } from "use-debounce";
import { PageSizing } from "../../../components/core/Table";
import QuarterStats from "../../../components/quarterStats/QuarterStats";
import FirmCategoryStats from "../../../components/stats/FirmCategoryStats";
import { useNavigate } from "react-router-dom";
import YearRangeFilter from "../../../components/filter/YearRangeFilter";
import StatCard2 from "../../../components/core/theme/StatCard2";
import { FaFileExport } from "react-icons/fa";
import CreateFirmModal from "./CreateFirmModal";

const FirmsPage = () => {
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
  const yearRangeQuery = useFetchYearRange();
  const categoryQuery = useFetchCategories();
  const firmsByTypeQuery = useFetchFirmsByType(
    categoryCode === "" ? null : categoryCode,
    searchValue,
    pageNumber,
    pageSize,
    yearRangeId
  );

  //Disclosures
  const createFirmDisclosure = useDisclosure();

  const categoryStatsQuery = useFetchCategoryStats();

  return (
    <>
      {/* Main */}
      <Main>
        {/* Modals */}
        <CreateFirmModal
          isOpen={createFirmDisclosure.isOpen}
          onClose={createFirmDisclosure.onClose}
        />
        <Section>
          <Container maxW="100%" pl={10} pr={10}>
            <SimpleGrid minChildWidth="130px" spacing={4}>
              {categoryStatsQuery?.data?.data.byCategory.map((c) => (
                <StatCard2
                  key={c.categoryCode}
                  title={c.category}
                  value={c.totalFirms}
                  categoryCode={c.categoryCode}
                />
              ))}
              <StatCard2
                key={"total"}
                title={"Total"}
                value={categoryStatsQuery?.data?.data.total}
                categoryCode={""}
              />
            </SimpleGrid>
          </Container>
        </Section>

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
                    includeAll='1'
                  />
                  <CategoriesFilter
                    categoryCode={categoryCode}
                    setCategoryCode={setCategoryCode}
                    setPageNumber={setPageNumber}
                    query={categoryQuery}
                  />
                </HStack>
                <HStack justifyContent="space-between" spacing={2}>
                  <Button
                    variant="brand"
                    leftIcon={<FaEdit />}
                    onClick={() => {
                      navigate("/sad/firms/add-approved-firm");
                    }}
                  >
                    Update Approved Firm
                  </Button>
                  <Button
                    variant="brand"
                    leftIcon={<MdOutlineAddCircleOutline />}
                    onClick={createFirmDisclosure.onOpen}
                  >
                    Add New Firm
                  </Button>
                  {/* <Button
                    variant="brand"
                    leftIcon={<MdOutlineAddCircleOutline />}
                    onClick={() => {
                      navigate("/sad/firms/create");
                    }}
                  >
                    Add New Firm
                  </Button> */}
                  <Button
                    variant="brand"
                    leftIcon={<FaFileExport />}
                    onClick={() => {
                      //navigate("/sad/issue/create");
                    }}
                  >
                    Export to Excel
                  </Button>
                </HStack>
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
            </Stack>
          </Container>
        </Section>
      </Main>
    </>
  );
};

export default FirmsPage;
