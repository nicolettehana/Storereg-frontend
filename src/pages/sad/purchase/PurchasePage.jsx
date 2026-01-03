import { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Button, Container, HStack, Stack } from "@chakra-ui/react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { useFetchCategories } from "../../../hooks/masterQueries";
import SearchInput from "../../../components/core/SearchInput";
import { useDebounce } from "use-debounce";
import { PageSizing } from "../../../components/core/Table";
import { useNavigate } from "react-router-dom";
import CategoriesFilter from "../../../components/filter/CategoriesFilter";
import PurchaseTableWrapper from "./PurchaseTableWrapper";
import dayjs from "dayjs";
import DateFilter from "../../../components/filter/DateFilter";
import { FaFileExport } from "react-icons/fa";
import { useFetchPurchases, useExportPurchase } from "../../../hooks/purchaseQueries";
import { hasPermission } from "../../../components/auth/permissions";
import { useAuth } from "../../../components/auth/useAuth";

const PurchasePage = () => {
  // States
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [categoryCode, setCategoryCode] = useState("");
  const [startDate, setStartDate] = useState(
    dayjs().subtract(2, "months").startOf("M").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf("M").format("YYYY-MM-DD")
  );
  const { role } = useAuth();

  // Hooks
  const [searchValue] = useDebounce(searchText, 300);
  const navigate = useNavigate();

  // Queries
  const categoryQuery = useFetchCategories();

  const purchasesQuery = useFetchPurchases(
    categoryCode === "" ? null : categoryCode,
    searchValue,
    pageNumber,
    pageSize,
    startDate,
    endDate
  );

  const exportPurchaseMutation = useExportPurchase();

  const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

  //Handlers
  const handleExport = () => {
  exportPurchaseMutation.mutate(
    {
      startDate,
      endDate,
      categoryCode: categoryCode || null,
    },
    {
      onSuccess: (response) => {

        // ✅ handle both axios styles safely
        const blob = response instanceof Blob ? response : response.data;

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        const categoryName =
          categoryCode
            ? "_" +
              categoryQuery?.data?.data?.find(
                (cat) => cat.code === categoryCode
              )?.name
            : "";

        link.href = url;
        link.download = `Purchases ${categoryName} ${formatDate(startDate)} to ${formatDate(endDate)}.xlsx`;

        document.body.appendChild(link);
        link.click();
        link.remove();
      },
      onError: (err) => {
        console.error("EXPORT ERROR:", err);
      }
    }
  );
};


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
                  <CategoriesFilter
                    categoryCode={categoryCode}
                    setCategoryCode={setCategoryCode}
                    setPageNumber={setPageNumber}
                    query={categoryQuery}
                  />
                </HStack>

                <HStack>
                  {hasPermission(role, "canCreatePurchase") && (<Button
                    variant="brand"
                    leftIcon={<MdOutlineAddCircleOutline />}
                    onClick={() => {
                      role === "SAD"? 
                      navigate("/sad/purchase/create"):navigate("/purchase/purchase/create");
                    }}
                  >
                    Add New Purchase
                  </Button>)}
                  {hasPermission(role, "canExportPurchase") && (<Button
                    variant="brand"
                    leftIcon={<FaFileExport />}
                    onClick={() => {
                    handleExport();
                  }}
                  >
                    Export to Excel
                  </Button>)}
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
