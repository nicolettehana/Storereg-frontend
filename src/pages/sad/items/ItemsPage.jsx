import { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Button, Container, HStack, Stack } from "@chakra-ui/react";
import { useFetchCategories } from "../../../hooks/masterQueries";
import { useFetchItemCategoryStats } from "../../../hooks/masterQueries";
import { useFetchItemsByType } from "../../../hooks/itemQueries";
import { MdOutlineHome } from "react-icons/md";
import ItemsTableWrapper from "./ItemsTableWrapper";
import CategoriesFilter from "../../../components/filter/CategoriesFilter";
import SearchInput from "../../../components/core/SearchInput";
import { useDebounce } from "use-debounce";
import { PageSizing } from "../../../components/core/Table";
import FirmCategoryStats from "../../../components/stats/FirmCategoryStats";
import { useNavigate } from "react-router-dom";

const ItemsPage = () => {
  // States
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
  const itemCategoryStatsQuery = useFetchItemCategoryStats();
  const itemsByTypeQuery = useFetchItemsByType(
    categoryCode === "" ? null : categoryCode,
    searchValue,
    pageNumber,
    pageSize
  );

  return (
    <>
      {/* Main */}
      <Main>
        <Section>
          <Container maxW="container.lg">
            <FirmCategoryStats
              data={itemCategoryStatsQuery?.data?.data}
              isPending={itemCategoryStatsQuery.isPending}
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
                    navigate("/sad/items/create");
                  }}
                >
                  Add New Item
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
              <ItemsTableWrapper
                query={itemsByTypeQuery}
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

export default ItemsPage;
