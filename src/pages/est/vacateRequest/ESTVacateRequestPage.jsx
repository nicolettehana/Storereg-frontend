import React, { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import {
  Container,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Section from "../../../components/core/semantics/Section";
import {
  useFetchPaginatedCompletedVacateRequest,
  useFetchPaginatedPendingVacateRequest,
} from "../../../hooks/vacateRequestQueries";
import ESTVacateRequestPendingTableWrapper from "./ESTVacateRequestPendingTableWrapper";
import ESTVacateRequestCompletedTableWrapper from "./ESTVacateRequestCompletedTableWrapper";

const ESTVacateRequestPage = () => {
  // States
  const [pendingPageNumber, setPendingPageNumber] = useState(0);
  const [pendingPageSize, setPendingPageSize] = useState(10);

  const [completedPageNumber, setCompletedPageNumber] = useState(0);
  const [completedPageSize, setCompletedPageSize] = useState(10);

  // Queries
  const pendingQuery = useFetchPaginatedPendingVacateRequest(
    pendingPageNumber,
    pendingPageSize
  );
  const completedQuery = useFetchPaginatedCompletedVacateRequest(
    completedPageNumber,
    completedPageSize
  );

  return (
    <Main>
      <Section>
        <Container minW="full">
          <Tabs position="relative" variant="unstyled">
            <TabList>
              <Tab>Pending</Tab>
              <Tab>Completed</Tab>
            </TabList>
            <TabIndicator
              mt="-1.5px"
              height="2px"
              bg="brand.600"
              borderRadius="1px"
            />
            <TabPanels>
              <TabPanel px={0}>
                <ESTVacateRequestPendingTableWrapper
                  query={pendingQuery}
                  pageNumber={pendingPageNumber}
                  setPageNumber={setPendingPageNumber}
                  pageSize={pendingPageSize}
                  setPageSize={setPendingPageSize}
                />
              </TabPanel>
              <TabPanel px={0}>
                <ESTVacateRequestCompletedTableWrapper
                  query={completedQuery}
                  pageNumber={completedPageNumber}
                  setPageNumber={setCompletedPageNumber}
                  pageSize={completedPageSize}
                  setPageSize={setCompletedPageSize}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Section>
    </Main>
  );
};

export default ESTVacateRequestPage;
