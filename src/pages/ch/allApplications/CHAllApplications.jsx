import React, { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Container, HStack, Stack } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useFetchPaginatedAllBookingApplications } from "../../../hooks/bookingQueries";
import AllApplicationsTableWrapper from "./AllApplicationsTableWrapper";
import { PageSizing } from "../../../components/core/Table";
import DateFilter from "./DateFilter";

const CHAllApplications = () => {
  // States
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [fromDate, setFromDate] = useState(
    dayjs().subtract(2, "months").startOf("M").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(dayjs().endOf("M").format("YYYY-MM-DD"));

  // Queries
  const applicationsQuery = useFetchPaginatedAllBookingApplications(
    pageNumber,
    pageSize,
    fromDate,
    toDate
  );

  return (
    <Main>
      <Section>
        <Container minW="full">
          <Stack spacing={4}>
            {/* Filters */}
            <HStack justifyContent="space-between">
              {/* Page Size */}
              <PageSizing
                pageSize={pageSize}
                setPageSize={setPageSize}
                setPageNumber={setPageNumber}
              />

              {/* Filter */}
              <DateFilter
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                setPageNumber={setPageNumber}
              />
            </HStack>

            <AllApplicationsTableWrapper
              query={applicationsQuery}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
          </Stack>
        </Container>
      </Section>
    </Main>
  );
};

export default CHAllApplications;
