import React, { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Container, HStack, Stack } from "@chakra-ui/react";
import VacatedTableWrapper from "./VacatedTableWrapper";
import { useFetchVacatedQuarters } from "../../../hooks/vacatedQueries";
import dayjs from "dayjs";
import DateFilter from "../../ch/allApplications/DateFilter";
import { PageSizing } from "../../../components/core/Table";

const VacatedPage = () => {
  // States
  const [fromDate, setFromDate] = useState(
    dayjs().subtract(1, "year").startOf("M").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Queries
  const vacatedQuery = useFetchVacatedQuarters(
    fromDate,
    toDate,
    pageNumber,
    pageSize
  );

  return (
    <Main>
      <Section>
        <Container minW="full">
          <Stack spacing={4}>
            <HStack justifyContent="space-between">
              <PageSizing
                pageSize={pageSize}
                setPageSize={setPageSize}
                setPageNumber={setPageNumber}
              />

              <DateFilter
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                setPageNumber={setPageNumber}
              />
            </HStack>

            <VacatedTableWrapper
              query={vacatedQuery}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
          </Stack>
        </Container>
      </Section>
    </Main>
  );
};

export default VacatedPage;
