import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useFetchArchivedPublishedListsByListType } from "../../../../hooks/publishedListsQueries";
import Main from "../../../../components/core/semantics/Main";
import Section from "../../../../components/core/semantics/Section";
import { Button, Container, HStack, Stack } from "@chakra-ui/react";
import ArchivedPublishedListTableWrapper from "./ArchivedPublishedListTableWrapper";
import { PageSizing } from "../../../../components/core/Table";
import { useFetchWaitingList } from "../../../../hooks/bookingQueries";
import WaitingListFilter from "../../waitingList/WaitingListFilter";
import { MdOutlineArrowBack } from "react-icons/md";

const ArchivedPublishedListPage = () => {
  // Routers
  const location = useLocation();
  const navigate = useNavigate();
  if (!location.state) return <Navigate to="/ch/published-lists" />;
  const listType = location.state.listType;

  // States
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [waitingList, setWaitingList] = useState(listType);

  // Queries
  const archivedListQuery = useFetchArchivedPublishedListsByListType(
    waitingList,
    pageNumber,
    pageSize
  );
  const waitingListQuery = useFetchWaitingList();

  return (
    <Main>
      <Section>
        <Container minW="full">
          <Stack spacing={4}>
            <Button
              leftIcon={<MdOutlineArrowBack />}
              w="fit-content"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <HStack justifyContent="space-between">
              {/* Filters */}
              <PageSizing
                pageSize={pageSize}
                setPageSize={setPageSize}
                setPageNumber={setPageNumber}
              />

              <WaitingListFilter
                waitingListCode={waitingList}
                setWaitingListCode={setWaitingList}
                waitingListQuery={waitingListQuery}
                setPageNumber={setPageNumber}
              />
            </HStack>

            {/* Table */}
            <ArchivedPublishedListTableWrapper
              query={archivedListQuery}
              waitingListQuery={waitingListQuery}
              type={
                waitingListQuery?.data?.data?.find(
                  (row) => `${row?.code}` === `${waitingList}`
                )?.list
              }
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
          </Stack>
        </Container>
      </Section>
    </Main>
  );
};

export default ArchivedPublishedListPage;
