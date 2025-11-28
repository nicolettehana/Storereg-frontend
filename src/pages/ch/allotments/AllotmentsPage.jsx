import React, { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import {
  Container,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import {
  useFetchPaginatedCompletedAllotments,
  useFetchPaginatedPendingAllotments,
} from "../../../hooks/allotmentsQuery";
import PendingAllotmentsTableWrapper from "./PendingAllotmentsTableWrapper";
import CompletedAllotmentsTableWrapper from "./CompletedAllotmentsTableWrapper";
import dayjs from "dayjs";
import { PageSizing } from "../../../components/core/Table";
import DateFilter from "../allApplications/DateFilter";

const AllotmentsPage = () => {
  // States
  const [pendingPageNumber, setPendingPageNumber] = useState(0);
  const [pendingPageSize, setPendingPageSize] = useState(10);
  const [completedPageNumber, setCompletedPageNumber] = useState(0);
  const [completedPageSize, setCompletedPageSize] = useState(10);
  const [fromDate, setFromDate] = useState(
    dayjs().subtract(2, "months").startOf("M").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(dayjs().endOf("M").format("YYYY-MM-DD"));

  // Queries
  const pendingAllotmentsQuery = useFetchPaginatedPendingAllotments(
    pendingPageNumber,
    pendingPageSize
  );
  const completedAllotmentsQuery = useFetchPaginatedCompletedAllotments(
    completedPageNumber,
    completedPageSize,
    fromDate,
    toDate
  );

  return (
    <Main>
      <Section>
        <Container minW="full">
          <Tabs>
            <TabList>
              <Tab>Pending</Tab>
              <Tab>Completed</Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <PendingAllotmentsTableWrapper
                  query={pendingAllotmentsQuery}
                  pageNumber={pendingPageNumber}
                  setPageNumber={setPendingPageNumber}
                  pageSize={pendingPageSize}
                  setPageSize={setPendingPageSize}
                />
              </TabPanel>

              <TabPanel px={0}>
                <Stack spacing={4}>
                  {/* Filter */}
                  <HStack justifyContent="space-between">
                    <PageSizing
                      pageSize={completedPageSize}
                      setPageSize={setCompletedPageSize}
                      setPageNumber={setCompletedPageNumber}
                    />

                    <DateFilter
                      fromDate={fromDate}
                      setFromDate={setFromDate}
                      toDate={toDate}
                      setToDate={setToDate}
                      setPageNumber={setCompletedPageNumber}
                    />
                  </HStack>

                  {/* Table */}
                  <CompletedAllotmentsTableWrapper
                    query={completedAllotmentsQuery}
                    pageNumber={completedPageNumber}
                    setPageNumber={setCompletedPageNumber}
                  />
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Section>
    </Main>
  );
};

export default AllotmentsPage;
