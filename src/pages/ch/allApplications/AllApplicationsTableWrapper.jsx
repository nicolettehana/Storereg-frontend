import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
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
import { MdOutlineSensorOccupied, MdOutlineTableChart } from "react-icons/md";
import {
  elementCounter,
  Pagination,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "../../../components/core/Table";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Status from "../../user/dashboard/bookings/Status";
import { useFetchBookingApplicationStatus } from "../../../hooks/bookingQueries";
import TrackApplicationFlowModal from "../../../components/common/TrackApplicationFlowModal";

const AllApplicationsTableWrapper = ({
  role = "CH",
  query,
  pageNumber,
  setPageNumber,
}) => {
  // Routers
  const navigate = useNavigate();

  // States
  const [rowState, setRowState] = useState({});

  // Queries
  const statusQuery = useFetchBookingApplicationStatus();

  // Disclosure
  const trackingDisclosure = useDisclosure();

  // Handlers
  const handleTrackApplication = (row) => {
    setRowState(row);
    trackingDisclosure.onOpen();
  };

  // Empty State
  if (query.isSuccess && query?.data?.data?.content?.length === 0) {
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
            <Heading size="md">Your booking's history is empty</Heading>
            <Text color="body" textAlign="center">
              It seems you haven't got any quarter bookings yet.
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  return (
    <Stack spacing={4}>
      {/* Modal */}
      <TrackApplicationFlowModal
        rowState={rowState}
        isOpen={trackingDisclosure.isOpen}
        onClose={trackingDisclosure.onClose}
      />

      {/* Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Sl. No.</Th>
              <Th>Name & Designation</Th>
              <Th>Department & Office</Th>
              <Th>Application No.</Th>
              <Th>Applied Date</Th>
              <Th>Date of Retirement</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {(query.isPending
              ? new Array(10).fill(null)
              : query?.data?.data?.content
            )?.map((row, index) => {
              const status =
                query.isPending === false &&
                statusQuery?.data?.data?.find(
                  (status) => status?.statusCode === row?.appStatus
                );

              return (
                <Tr key={index}>
                  <Td isNumeric>
                    <SkeletonText
                      w="8"
                      noOfLines={1}
                      isLoaded={!query.isPending}
                    >
                      {elementCounter(index, query) || ""}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={2}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Stack spacing={0}>
                        <Text>{row?.name}</Text>
                        <Text color="body" fontSize="small">
                          {row?.designation}
                        </Text>
                      </Stack>
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Text>
                        {row?.departmentOrDirectorate || ""},{" "}
                        {row?.officeAddress}
                      </Text>
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.appNo || "-"}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.uploadTimestamp
                        ? dayjs(row?.uploadTimestamp).format("DD MMM YYYY")
                        : "-"}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.dateOfRetirement
                        ? dayjs(row?.dateOfRetirement).format("DD MMM YYYY")
                        : "-"}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Status
                        label={status?.status}
                        description={status?.description}
                      />
                    </SkeletonText>
                  </Td>
                  <Td>
                    <Skeleton
                      isLoaded={!query.isPending}
                      rounded="md"
                      fadeDuration={index}
                    >
                      <ButtonGroup variant="outline" isAttached={true}>
                        <Tooltip
                          label={
                            <Stack spacing={0}>
                              <Text>{row?.name}</Text>
                              <Text color="body">{row?.designation}</Text>
                            </Stack>
                          }
                        >
                          <IconButton
                            icon={<MdOutlineSensorOccupied />}
                            onClick={() =>
                              navigate(
                                `/${
                                  role === "CH" ? "ch" : "da"
                                }/applications/details`,
                                {
                                  state: { rowState: row },
                                }
                              )
                            }
                          />
                        </Tooltip>
                        <Button onClick={() => handleTrackApplication(row)}>
                          Track Application
                        </Button>
                      </ButtonGroup>
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

export default AllApplicationsTableWrapper;
