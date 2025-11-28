import React, { useEffect, useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import {
  useFetchWaitingList,
  useFetchWaitingListApplications,
} from "../../../hooks/bookingQueries";
import {
  Button,
  Container,
  HStack,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import WaitingListWrapper from "./WaitingListWrapper";
import WaitingListFilter from "./WaitingListFilter";
import PublishConfirmationModal from "./PublishConfirmationModal";

const WaitingListPage = () => {
  // States
  const [waitingListCode, setWaitingListCode] = useState("");

  // Disclosures
  const confirmDisclosure = useDisclosure();

  // Queries
  const waitingListApplicationQuery =
    useFetchWaitingListApplications(waitingListCode);
  const waitingListQuery = useFetchWaitingList();

  // Side-effects
  useEffect(() => {
    if (waitingListQuery.isSuccess && waitingListCode === "") {
      setWaitingListCode(waitingListQuery?.data?.data[0]?.code);
    }
  }, [waitingListQuery.isSuccess]);

  return (
    <>
      {/* Modals */}
      <PublishConfirmationModal
        isOpen={confirmDisclosure.isOpen}
        onClose={confirmDisclosure.onClose}
        listCode={waitingListCode}
      />

      {/* Main */}
      <Main>
        <Section>
          <Container minW="full">
            <Stack spacing={4}>
              {/* Filter */}
              <HStack justifyContent="space-between">
                <WaitingListFilter
                  waitingListQuery={waitingListQuery}
                  waitingListCode={waitingListCode}
                  setWaitingListCode={setWaitingListCode}
                />

                <HStack>
                  {/* <Button variant="outline">Legacy Waiting List</Button> */}
                  {/* <Button variant="brand" onClick={confirmDisclosure.onOpen}>
                    Publish
                  </Button> */}
                </HStack>
              </HStack>

              {/* Table */}
              <WaitingListWrapper query={waitingListApplicationQuery} />
            </Stack>
          </Container>
        </Section>
      </Main>
    </>
  );
};

export default WaitingListPage;
