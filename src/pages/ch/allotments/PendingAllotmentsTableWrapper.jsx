import React, { useState } from "react";
import {
  elementCounter,
  PageSizing,
  Pagination,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "../../../components/core/Table";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  MdCheckCircleOutline,
  MdOutlineAddCircleOutline,
  MdOutlineRemoveCircleOutline,
  MdOutlineRemoveRedEye,
  MdOutlineTableChart,
} from "react-icons/md";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import AllotmentLetterPDFModal from "../../../components/common/AllotmentLetterPDFModal";
import TrackApplicationFlowModal from "../../../components/common/TrackApplicationFlowModal";
import { RiCloseCircleLine } from "react-icons/ri";

const PendingAllotmentsTableWrapper = ({
  query,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
}) => {
  // Routers
  const navigate = useNavigate();

  // States
  const [rowState, setRowState] = useState({});

  // Disclosures
  const letterDisclosure = useDisclosure();
  const historyDisclosure = useDisclosure();

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
            <Heading size="md">Your pending allotments is empty</Heading>
            <Text color="body" textAlign="center">
              It seems you haven't got any pending allotments yet.
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  // Handlers
  const handleAllotmentLetter = (row) => {
    setRowState(row);
    letterDisclosure.onOpen();
  };

  const handleTrackApplication = (row) => {
    setRowState(row);
    historyDisclosure.onOpen();
  };

  return (
    <Stack spacing={4}>
      {/* Modals */}
      <AllotmentLetterPDFModal
        rowState={rowState}
        isOpen={letterDisclosure.isOpen}
        onClose={letterDisclosure.onClose}
      />

      <TrackApplicationFlowModal
        rowState={rowState}
        isOpen={historyDisclosure.isOpen}
        onClose={historyDisclosure.onClose}
      />

      {/* Filter */}
      <PageSizing
        pageSize={pageSize}
        setPageSize={setPageSize}
        setPageNumber={setPageNumber}
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
              <Th>Letter & Memo No.</Th>
              <Th>Approval Status</Th>
              <Th>Pending With</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {(query.isPending
              ? new Array(10).fill(null)
              : query?.data?.data?.content
            )?.map((row, index) => {
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
                      <Stack spacing={0}>
                        <Text>{row?.dept}</Text>
                        <Text color="body" fontSize="small">
                          {row?.office}
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
                      {row?.appNo || "-"}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={3}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Stack spacing={0}>
                        <HStack
                          cursor="pointer"
                          color="brand.600"
                          _hover={{
                            color: "brand.700",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleAllotmentLetter(row)}
                        >
                          <Text>{row?.letterNo}</Text>
                          <Box as={MdOutlineRemoveRedEye} size={20} />
                        </HStack>
                        <Text color="body" fontSize="small">
                          {row?.memoNo}
                        </Text>
                        <Text color="body" fontSize="small">
                          Dtd:{" "}
                          {row?.orderGeneratedOn
                            ? dayjs(row?.orderGeneratedOn).format("DD MMM YYYY")
                            : "-"}
                        </Text>
                      </Stack>
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={3}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Stack spacing={0}>
                        <Tooltip
                          fontSize="small"
                          label={`
                            ${
                              row?.chFinalApprove === 1
                                ? "Department Accepted"
                                : row?.chFinalApprove === 0
                                ? "Department Rejected"
                                : "Department Pending"
                            } ${
                            row?.chTimestamp
                              ? dayjs(row?.chTimestamp).format(
                                  "DD MMM YYYY, hh:mm A"
                                )
                              : "-"
                          }
                          `}
                        >
                          <HStack>
                            <Text>Department</Text>
                            {row?.chFinalApprove === 1 ? (
                              <Box
                                as={MdCheckCircleOutline}
                                color="green.600"
                              />
                            ) : row?.chFinalApprove === 0 ? (
                              <Box as={RiCloseCircleLine} color="red.600" />
                            ) : (
                              <Box
                                as={MdOutlineRemoveCircleOutline}
                                color="zinc.600"
                              />
                            )}
                          </HStack>
                        </Tooltip>

                        <Tooltip
                          fontSize="small"
                          label={`
                            ${
                              row?.applicantAccepted === 1
                                ? "Applicant Accepted"
                                : row?.applicantAccepted === 0
                                ? "Applicant Rejected"
                                : "Applicant Pending"
                            } ${
                            row?.applicantTimestamp
                              ? dayjs(row?.applicantTimestamp).format(
                                  "DD MMM YYYY, hh:mm A"
                                )
                              : "-"
                          }
                          `}
                        >
                          <HStack>
                            <Text>Applicant</Text>
                            {row?.applicantAccepted === 1 ? (
                              <Box
                                as={MdCheckCircleOutline}
                                color="green.600"
                              />
                            ) : row?.applicantAccepted === 0 ? (
                              <Box as={RiCloseCircleLine} color="red.600" />
                            ) : (
                              <Box
                                as={MdOutlineRemoveCircleOutline}
                                color="zinc.600"
                              />
                            )}
                          </HStack>
                        </Tooltip>
                      </Stack>
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Text>{row?.pendingWith}</Text>
                    </SkeletonText>
                  </Td>

                  <Td>
                    <Skeleton isLoaded={!query.isPending} fadeDuration={index}>
                      <Button
                        variant="outline"
                        onClick={() => handleTrackApplication(row)}
                      >
                        View Flow
                      </Button>
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

export default PendingAllotmentsTableWrapper;
