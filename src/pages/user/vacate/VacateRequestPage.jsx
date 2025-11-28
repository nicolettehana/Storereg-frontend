import React, { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import {
  Button,
  Container,
  HStack,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useFetchPaginatedVacateRequest } from "../../../hooks/vacateRequestQueries";
import VacateRequestTableWrapper from "./VacateRequestTableWrapper";
import { PageSizing } from "../../../components/core/Table";
import VacateRequestForm from "../../../forms/vacate/VacateRequestForm";

const VacateRequestPage = () => {
  // States
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Disclosures
  const requestDisclosure = useDisclosure();

  // Queries
  const vacateQuery = useFetchPaginatedVacateRequest(pageNumber, pageSize);

  return (
    <>
      {/* Modals */}
      <VacateRequestForm
        isOpen={requestDisclosure.isOpen}
        onClose={requestDisclosure.onClose}
      />

      {/* Main */}
      <Main>
        <Section>
          <Container minW="full">
            <Stack spacing={4}>
              {/* Filters */}
              <HStack justifyContent="space-between">
                <PageSizing
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  setPageNumber={setPageNumber}
                />

                <Button variant="brand" onClick={requestDisclosure.onOpen}>
                  New Vacate Request
                </Button>
              </HStack>

              {/* Table */}
              <VacateRequestTableWrapper
                query={vacateQuery}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </Stack>
          </Container>
        </Section>
      </Main>
    </>
  );
};

export default VacateRequestPage;
