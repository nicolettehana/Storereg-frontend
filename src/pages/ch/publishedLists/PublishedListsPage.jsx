import { useEffect, useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Container, Heading, HStack, Stack } from "@chakra-ui/react";
import { useFetchWaitingList } from "../../../hooks/bookingQueries";
import WaitingListFilter from "../waitingList/WaitingListFilter";
import PublishListTableWrapper from "./PublishListTableWrapper";
import dayjs from "dayjs";
import { useFetchApprovedWaitingListByListType } from "../../../hooks/waitingListQueries";

const PublishedListsPage = () => {
  // States
  const [listType, setListType] = useState("");

  // Queries
  const approvedListQuery = useFetchApprovedWaitingListByListType(listType);
  const waitingListQuery = useFetchWaitingList();

  // Side-effects
  useEffect(() => {
    if (waitingListQuery.isSuccess && listType === "") {
      setListType(waitingListQuery?.data?.data[0]?.code);
    }
  }, [waitingListQuery.isSuccess]);

  return (
    <Main>
      <Section>
        <Container minW="full">
          <Stack spacing={4}>
            <Stack spacing={4}>
              <HStack justifyContent="space-between">
                <WaitingListFilter
                  waitingListCode={listType}
                  setWaitingListCode={setListType}
                  waitingListQuery={waitingListQuery}
                />

                {/* <Button
                  variant="brand"
                  onClick={() =>
                    navigate("/ch/published-lists/archived", {
                      state: { listType: listType },
                    })
                  }
                >
                  Archived Lists
                </Button> */}
              </HStack>
              {approvedListQuery?.data?.data?.publishedList?.entryDate && (
                <Heading size="sm">
                  Published Date:{" "}
                  {dayjs(
                    approvedListQuery?.data?.data?.publishedList?.entryDate
                  ).format("DD MMM YYYY, hh:mm A")}
                </Heading>
              )}
            </Stack>

            <PublishListTableWrapper
              query={approvedListQuery}
              type={
                waitingListQuery?.data?.data?.find(
                  (row) => `${row?.code}` === listType
                )?.list
              }
            />
          </Stack>
        </Container>
      </Section>
    </Main>
  );
};

export default PublishedListsPage;
