import React, { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Container,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  useFetchApplicationSummary,
  useFetchBookingApplications,
} from "../../../hooks/bookingQueries";
import DashboardStatsWrapper from "./DashboardStatsWrapper";
import BookingsTableWrapper from "./bookings/BookingsTableWrapper";

const UserDashboardPage = () => {
  // States
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Queries
  const applicationsQuery = useFetchBookingApplications(pageNumber, pageSize);
  const appSummaryQuery = useFetchApplicationSummary();

  return (
    <Main>
      <Section>
        <Container maxW="container.sm">
          <Stack spacing={4}>
            <DashboardStatsWrapper query={appSummaryQuery} />

            {appSummaryQuery?.data?.data?.message?.length && (
              <Alert status="info" rounded="md">
                <HStack spacing={0} alignItems="start">
                  <AlertIcon />
                  <Stack spacing={0}>
                    <AlertTitle>Message</AlertTitle>
                    <AlertDescription as={Stack} spacing={0}>
                      {appSummaryQuery?.data?.data?.message?.map(
                        (msg, index) => (
                          <Text key={index}>{msg}</Text>
                        )
                      )}
                    </AlertDescription>
                  </Stack>
                </HStack>
              </Alert>
            )}
          </Stack>
        </Container>
      </Section>

      <Section>
        <Container minW="full">
          <BookingsTableWrapper
            query={applicationsQuery}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </Container>
      </Section>
    </Main>
  );
};

export default UserDashboardPage;
