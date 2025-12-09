import { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Button, Container, HStack, Stack } from "@chakra-ui/react";
import { useFetchYearRange } from "../../../hooks/masterQueries";
import { useFetchRates } from "../../../hooks/ratesQueries";
import { useFetchPurchases } from "../../../hooks/purchaseQueries";
import { MdOutlineHome } from "react-icons/md";
import { useFetchCategories } from "../../../hooks/masterQueries";
import SearchInput from "../../../components/core/SearchInput";
import { useDebounce } from "use-debounce";
import { PageSizing } from "../../../components/core/Table";
import { useNavigate } from "react-router-dom";
import CategoriesFilter from "../../../components/filter/CategoriesFilter";
import YearRangeFilter from "../../../components/filter/YearRangeFilter";
import PurchaseTableWrapper from "./PurchaseTableWrapper";
import dayjs from "dayjs";
import DateFilter from "../../ch/allApplications/DateFilter";

const PurchasePage = () => {
  // States
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [categoryCode, setCategoryCode] = useState("");
  const [yearRangeId, setYearRangeId] = useState("");
  const [startDate, setStartDate] = useState(
    dayjs().subtract(2, "months").startOf("M").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf("M").format("YYYY-MM-DD")
  );

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
  const purchasesQuery = useFetchPurchases(
    categoryCode === "" ? null : categoryCode,
    searchValue,
    pageNumber,
    pageSize,
    startDate,
    endDate
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
                  <DateFilter
                    fromDate={startDate}
                    setFromDate={setStartDate}
                    toDate={endDate}
                    setToDate={setEndDate}
                    setPageNumber={setPageNumber}
                  />
                  {/* <CategoriesFilter
                    categoryCode={categoryCode}
                    setCategoryCode={setCategoryCode}
                    setPageNumber={setPageNumber}
                    query={categoryQuery}
                  /> */}
                </HStack>

                <Button
                  variant="brand"
                  leftIcon={<MdOutlineHome />}
                  onClick={() => {
                    navigate("/sad/purchase/create");
                  }}
                >
                  Add New Purchase
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
              <PurchaseTableWrapper
                query={purchasesQuery}
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

export default PurchasePage;
