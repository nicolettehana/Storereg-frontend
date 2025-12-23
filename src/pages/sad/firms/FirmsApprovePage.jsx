import { useState } from "react";
import {
  Container,
  Heading,
  Text,
  HStack,
  Stack,
  Button,
} from "@chakra-ui/react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import CreateFirmForm from "../../../forms/firms/CreateFirmForm";
import AddApprovedFirmForm from "../../../forms/firms/AddApprovedFirmForm";
import FirmsApproveTableWrapper from "./FirmsApproveTableWrapper";
import { useFetchFirmsByType, useFetchAllFirmsByType } from "../../../hooks/firmQueries";
import { useDebounce } from "use-debounce";
import CategoriesFilter2 from "../../../components/filter/CategoriesFilter2";
import { useFetchCategories } from "../../../hooks/masterQueries";
import { FaEdit } from "react-icons/fa";
import { PageSizing } from "../../../components/core/Table";
import SearchInput from "../../../components/core/SearchInput";

const FirmsApprovePage = ({ yearRangeId, yearRange, onClose }) => {
  //States
  //const [yearRangeId, setYearRangeId] = useState(1);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [categoryCode, setCategoryCode] = useState("");

  // Hooks
  const [searchValue] = useDebounce(searchText, 300);

  //Queries
  const categoryQuery = useFetchCategories();
  // const firmsByTypeQuery = useFetchFirmsByType(
  //   categoryCode === "" ? null : categoryCode,
  //   searchValue,
  //   pageNumber,
  //   pageSize,
  //   yearRangeId
  // );

  const allFirmsByTypeQuery = useFetchAllFirmsByType(
    categoryCode === "" ? null : categoryCode,
    searchValue,
    pageNumber,
    pageSize,
    yearRangeId
  );

  return (
    //<Main>
    
    <>
      <Section minW="100%">
        <Container minW="100%">
          <Section>
            <Heading>
              <Text fontWeight="bold" color="brand.700" fontSize="xl">
                {yearRange}
              </Text>
            </Heading>
             <Container>
               <HStack justifyContent="left" spacing={0}>
               <Button onClick={onClose}>Back</Button>
               </HStack>
             </Container>

            <Container minW="full">
              <Stack spacing={4}>
                <HStack justifyContent="space-between" spacing={0}>
                  <CategoriesFilter2
                    categoryCode={categoryCode}
                    setCategoryCode={setCategoryCode}
                    setPageNumber={setPageNumber}
                    query={categoryQuery}
                  />

                  <Button
                    variant="brand"
                    leftIcon={<FaEdit />}
                    onClick={() => {
                      navigate("/sad/firms/add-approved-firm");
                    }}
                  >
                    Approve New Firm
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
              </Stack>
            </Container>
          </Section>
        </Container>
      </Section>

      <Section>
        <Container maxW="container.xl" pt={5}>
          <FirmsApproveTableWrapper
          yearRangeId={yearRangeId}
            query={allFirmsByTypeQuery}
            searchText={searchText}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
        </Container>
      </Section>
    </>
    //</Main>
  );
};

export default FirmsApprovePage;
