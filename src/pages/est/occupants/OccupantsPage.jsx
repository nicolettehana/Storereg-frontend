import React, { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import {
  useFetchQuartersByStatus,
  useFetchQuarterTypes,
} from "../../../hooks/quartersQueries";
import OccupantsTableWrapper from "./OccupantsTableWrapper";
import {
  Button,
  Container,
  HStack,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import AddOccupantsForm from "../../../forms/occupants/AddOccupantsForm";
import { MdOutlineAdd } from "react-icons/md";
import { useDebounce } from "use-debounce";
import SearchInput from "../../../components/core/SearchInput";
import QuartersFilter from "../../ch/quarters/QuartersFilter";
import { PageSizing } from "../../../components/core/Table";

const OccupantsPage = () => {
  // States
  const [searchText, setSearchText] = useState("");
  const [quarterCode, setQuarterCode] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Hooks
  const [searchValue] = useDebounce(searchText, 300);

  // Queries
  const typeQuery = useFetchQuarterTypes();
  const quartersQuery = useFetchQuartersByStatus(
    searchValue,
    quarterCode,
    pageNumber,
    pageSize
  );

  // Disclosures
  const addDisclosure = useDisclosure();

  return (
    <Main>
      {/* Modals */}
      <AddOccupantsForm
        isOpen={addDisclosure.isOpen}
        onClose={addDisclosure.onClose}
      />

      <Section>
        <Container minW="full">
          <Stack spacing={4}>
            {/* Filters & Buttons */}
            <HStack justifyContent="space-between">
              <QuartersFilter
                quarterCode={quarterCode}
                setQuarterCode={setQuarterCode}
                setPageNumber={setPageNumber}
                query={typeQuery}
              />
              <Button
                variant="brand"
                leftIcon={<MdOutlineAdd />}
                onClick={addDisclosure.onOpen}
              >
                Add Occupant
              </Button>
            </HStack>

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
                w="auto"
              />
            </HStack>

            <OccupantsTableWrapper
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

export default OccupantsPage;
