import { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import {
  Badge,
  Container,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import {
  useFetchBookingApplications,
  useFetchQuarterChangeBookingApplications,
  useFetchReturnedApplicationsFromEProposal,
} from "../../../hooks/bookingQueries";
import CHPendingApplicationTableWrapper from "./CHPendingApplicationTableWrapper";
import CHQuarterChangeApplicationTableWrapper from "./CHQuarterChangeApplicationTableWrapper";
import CHReturnedApplicationsFromEProposalTableWrapper from "./CHReturnedApplicationsFromEProposalTableWrapper";

const CHDashboardPage = () => {
  // States
  const [pendingPageNumber, setPendingPageNumber] = useState(0);
  const [pendingPageSize, setPendingPageSize] = useState(10);

  const [quarterPageNumber, setQuarterPageNumber] = useState(0);
  const [quarterPageSize, setQuarterPageSize] = useState(10);

  const [eProposalPageNumber, setEProposalPageNumber] = useState(0);
  const [eProposalPageSize, setEProposalPageSize] = useState(10);

  // Queries
  const pendingApplicationsQuery = useFetchBookingApplications(
    pendingPageNumber,
    pendingPageSize
  );
  const quarterChangeapplicationsQuery =
    useFetchQuarterChangeBookingApplications(
      quarterPageNumber,
      quarterPageSize
    );
  const eProposalApplicationsQuery = useFetchReturnedApplicationsFromEProposal(
    eProposalPageNumber,
    eProposalPageSize
  );

  return (
    <Main>
      <Section>
        <Container minW="full">
          <Tabs>
            <TabList>
              <Tab as={HStack}>
                <Text>Pending Applications</Text>
                <Badge colorScheme="red">
                  {pendingApplicationsQuery?.data?.data?.totalElements}
                </Badge>
              </Tab>

              <Tab as={HStack}>
                <Text>Returned Applications (from Applicants)</Text>
                <Badge colorScheme="red">
                  {quarterChangeapplicationsQuery?.data?.data?.totalElements}
                </Badge>
              </Tab>

              <Tab as={HStack}>
                <Text>Returned Applications (from eProposal)</Text>
                <Badge colorScheme="red">
                  {eProposalApplicationsQuery?.data?.data?.totalElements}
                </Badge>
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <CHPendingApplicationTableWrapper
                  query={pendingApplicationsQuery}
                  pageNumber={pendingPageNumber}
                  setPageNumber={setPendingPageNumber}
                  pageSize={pendingPageSize}
                  setPageSize={setPendingPageSize}
                />
              </TabPanel>

              <TabPanel px={0}>
                <CHQuarterChangeApplicationTableWrapper
                  query={quarterChangeapplicationsQuery}
                  pageNumber={quarterPageNumber}
                  setPageNumber={setQuarterPageNumber}
                  pageSize={quarterPageSize}
                  setPageSize={setQuarterPageSize}
                />
              </TabPanel>

              <TabPanel px={0}>
                <CHReturnedApplicationsFromEProposalTableWrapper
                  query={eProposalApplicationsQuery}
                  pageNumber={eProposalPageNumber}
                  setPageNumber={setEProposalPageNumber}
                  pageSize={eProposalPageSize}
                  setPageSize={setEProposalPageSize}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Section>
    </Main>
  );
};

export default CHDashboardPage;
