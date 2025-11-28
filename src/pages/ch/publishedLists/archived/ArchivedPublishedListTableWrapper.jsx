import React, { useState } from "react";
import {
  Pagination,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "../../../../components/core/Table";
import {
  Box,
  Center,
  Heading,
  IconButton,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { MdOutlineInsertDriveFile, MdOutlineTableChart } from "react-icons/md";
import ArchivedDetailsModal from "./ArchivedDetailsModal";

const ArchivedPublishedListTableWrapper = ({
  query,
  waitingListQuery,
  type,
  pageNumber,
  setPageNumber,
}) => {
  // Disclosures
  const detailsDisclosure = useDisclosure();

  // States
  const [rowState, setRowState] = useState({});

  // Error State
  if (query.isError) {
    return (
      <Center py={16}>
        <VStack spacing={4}>
          <Box
            bg="paperSecondary"
            w="fit-content"
            border="1px"
            borderColor="border"
            rounded="full"
            p={4}
          >
            <MdOutlineTableChart size={48} />
          </Box>

          <VStack>
            <Heading size="md">Something went wrong</Heading>
            <Text color="body" textAlign="center">
              {query?.error?.response?.data?.detail}
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  // Empty State
  if (query.isSuccess && query?.data?.data?.empty) {
    return (
      <Center py={16}>
        <VStack spacing={4}>
          <Box
            bg="paperSecondary"
            w="fit-content"
            border="1px"
            borderColor="border"
            rounded="full"
            p={4}
          >
            <MdOutlineTableChart size={48} />
          </Box>

          <VStack>
            <Heading size="md">
              Archived Published Waiting List is empty
            </Heading>
            <Text color="body" textAlign="center">
              No previous published list for {type}.
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  return (
    <Stack spacing={4}>
      {/* Modals */}
      <ArchivedDetailsModal
        isOpen={detailsDisclosure.isOpen}
        onClose={detailsDisclosure.onClose}
        rowState={rowState}
      />

      {/* Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Version</Th>
              <Th>Published Date</Th>
              <Th>List Code</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {(query.isPending
              ? new Array(10).fill(null)
              : query?.data?.data?.content
            )?.map((row, index) => {
              return (
                <Tr key={index}>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.publishedList?.version}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {dayjs(row?.publishedList?.entryDate).format(
                        "DD MMM YYYY, hh:mm A"
                      )}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {
                        waitingListQuery?.data?.data?.find(
                          (list) =>
                            `${list.code}` === `${row?.publishedList?.listCode}`
                        )?.list
                      }
                    </SkeletonText>
                  </Td>
                  <Td>
                    <Skeleton isLoaded={!query.isPending} fadeDuration={index}>
                      <Tooltip label="View Details">
                        <IconButton
                          variant="outline"
                          icon={<MdOutlineInsertDriveFile />}
                          onClick={() => {
                            setRowState(row);
                            detailsDisclosure.onOpen();
                          }}
                        />
                      </Tooltip>
                    </Skeleton>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        query={query}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
      />
    </Stack>
  );
};

export default ArchivedPublishedListTableWrapper;
