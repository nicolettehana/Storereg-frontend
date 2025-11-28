import React, { useState } from "react";
import {
  elementCounter,
  TableContainer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  PageSizing,
  Pagination,
} from "../../../../components/core/Table";
import { useFetchBookingApplicationStatus } from "../../../../hooks/bookingQueries";
import Status from "./Status";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  MdOutlineAdd,
  MdOutlineInsertDriveFile,
  MdOutlineTableChart,
} from "react-icons/md";
import CancelApplicationForm from "../../../../forms/applications/CancelApplicationForm";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import DiscardApplicationForm from "../../../../forms/applications/DiscardApplicationForm";
import UploadApplicationForm from "../../../../forms/applications/UploadApplicationForm";
import ViewApplicationRemarksForm from "../../../../forms/applications/ViewRemarksForm";
import QuarterChangeForm from "../../../../forms/applications/QuarterChangeForm";
import ViewAllotmentOrderForm from "../../../../forms/applications/ViewAllotmentOrderForm";
import AcceptAllotmentForm from "../../../../forms/applications/AcceptAllotmentForm";

const BookingsTableWrapper = ({
  query,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
}) => {
  // Hooks
  const navigate = useNavigate();

  // Queries
  const statusQuery = useFetchBookingApplicationStatus();

  // States
  const [rowState, setRowState] = useState("");
  const [actionCode, setActionCode] = useState(0);

  // Disclosures
  const remarksDisclosure = useDisclosure();
  const cancelDisclosure = useDisclosure();
  const discardDisclosure = useDisclosure();
  const uploadDisclosure = useDisclosure();
  const changeDisclosure = useDisclosure();
  const allotmentOrderDisclosure = useDisclosure();
  const acceptDisclosure = useDisclosure();

  // Colors
  const wListText = useColorModeValue("brand.800", "brand.200");

  // Handlers
  const handleViewRemarks = (row) => {
    setRowState(row);
    remarksDisclosure.onOpen();
  };

  const handleViewAllotmentOrder = (row) => {
    setRowState(row);
    allotmentOrderDisclosure.onOpen();
  };

  const handleActions = (action, row) => {
    setActionCode(action.actionCode);
    setRowState(row);

    switch (action.actionCode) {
      case 1:
        uploadDisclosure.onOpen();
        break;
      case 7:
        cancelDisclosure.onOpen();
        break;
      case 8:
        discardDisclosure.onOpen();
        break;
      case 10:
        allotmentOrderDisclosure.onClose();
        changeDisclosure.onOpen();
        break;
      case 15:
        allotmentOrderDisclosure.onClose();
        acceptDisclosure.onOpen();
        break;
      default:
        break;
    }
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
              It seems you haven't booked any quarters yet.
            </Text>
          </VStack>

          {/* Create */}
          <Button
            flexShrink={0}
            as={Link}
            to="/user/dashboard/create"
            variant="brand"
            leftIcon={<MdOutlineAdd size={20} />}
          >
            Apply for Quarter
          </Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Stack spacing={4}>
      {/* Modals */}
      {rowState?.appNo && (
        <>
          <ViewApplicationRemarksForm
            rowState={rowState}
            isOpen={remarksDisclosure.isOpen}
            onClose={remarksDisclosure.onClose}
          />

          <ViewAllotmentOrderForm
            rowState={rowState}
            isOpen={allotmentOrderDisclosure.isOpen}
            onClose={allotmentOrderDisclosure.onClose}
            handleActions={handleActions}
          />
        </>
      )}

      <CancelApplicationForm
        actionCode={actionCode}
        rowState={rowState}
        isOpen={cancelDisclosure.isOpen}
        onClose={cancelDisclosure.onClose}
      />

      <DiscardApplicationForm
        actionCode={actionCode}
        rowState={rowState}
        isOpen={discardDisclosure.isOpen}
        onClose={discardDisclosure.onClose}
      />

      <UploadApplicationForm
        rowState={rowState}
        isOpen={uploadDisclosure.isOpen}
        onClose={uploadDisclosure.onClose}
      />

      <QuarterChangeForm
        actionCode={actionCode}
        rowState={rowState}
        isOpen={changeDisclosure.isOpen}
        onClose={changeDisclosure.onClose}
        allotmentOrderDisclosure={allotmentOrderDisclosure}
      />

      <AcceptAllotmentForm
        actionCode={actionCode}
        rowState={rowState}
        isOpen={acceptDisclosure.isOpen}
        onClose={acceptDisclosure.onClose}
        allotmentOrderDisclosure={allotmentOrderDisclosure}
      />

      <HStack justifyContent="space-between">
        {/* Page Size */}
        <PageSizing
          pageSize={pageSize}
          setPageSize={setPageSize}
          setPageNumber={setPageNumber}
        />

        {/* Create */}
        <Button
          aria-label="Apply for Quarter"
          flexShrink={0}
          as={Link}
          to="/user/dashboard/create"
          variant="brand"
          leftIcon={<MdOutlineAdd size={20} />}
        >
          Apply for Quarter
        </Button>
      </HStack>

      {/* Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Sl. No.</Th>
              <Th>Application No.</Th>
              <Th>Designation</Th>
              <Th>Department & Office</Th>
              <Th>Applied Date</Th>
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
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.appNo}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={2}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Stack spacing={0}>
                        <Text>{row?.designation}</Text>
                      </Stack>
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={2}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Text>{row?.departmentOrDirectorate}</Text>
                      <Text fontSize="small" color="body">
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
                      <Stack>
                        <Status
                          label={status?.status}
                          description={status?.description}
                        />
                        {row?.wlSlNo && (
                          <Text color={wListText} fontSize="small">
                            {row?.waitingListName} - Sl. No. {row?.wlSlNo}
                          </Text>
                        )}
                      </Stack>
                    </SkeletonText>
                  </Td>
                  <Td>
                    <Skeleton
                      isLoaded={!query.isPending}
                      rounded="md"
                      fadeDuration={index}
                    >
                      <ButtonGroup variant="outline" isAttached={true}>
                        <Tooltip label="View Application Form Details">
                          <IconButton
                            aria-label="View Application Form Details"
                            icon={<MdOutlineInsertDriveFile />}
                            onClick={() =>
                              navigate("/user/dashboard/details", {
                                state: { rowState: row },
                              })
                            }
                          />
                        </Tooltip>

                        {status?.statusCode === 4 ||
                        status?.statusCode === 14 ||
                        status?.statusCode === 15 ? (
                          <Button
                            variant="outline"
                            onClick={() => handleViewAllotmentOrder(row)}
                          >
                            View Allotment Order
                          </Button>
                        ) : null}

                        {status?.statusCode === 6 ||
                        status?.statusCode === 9 ? (
                          <Button
                            variant="outline"
                            onClick={() => handleViewRemarks(row)}
                          >
                            View Remarks
                          </Button>
                        ) : null}

                        {status?.statusCode !== 14 &&
                          row?.actions?.map((action) => {
                            if (
                              action.actionCode !== 15 &&
                              action.actionCode !== 10
                            ) {
                              return (
                                <Button
                                  key={action.actionCode}
                                  // icon={<MdOutlineLogout size={16} />}
                                  onClick={() => handleActions(action, row)}
                                >
                                  {action.action}
                                </Button>
                              );
                            }
                          })}
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

export default BookingsTableWrapper;
