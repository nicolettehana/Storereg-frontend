import { useState } from "react";
import {
  Badge,
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
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "../../../components/core/Table";
import dayjs from "dayjs";
import ForwardWaitingListApplicationForm from "../../../forms/waitingList/ForwardWaitingListApplicationForm";
import ForwardWaitingListApplicationPDFForm from "../../../forms/waitingList/ForwardWaitingListApplicationPDFForm";
import { useNavigate } from "react-router-dom";
import RejectApplicationForm from "../../../forms/applications/RejectApplicationForm";
import MoveToApprovedListForm from "../../../forms/applications/MoveToApprovedListForm";
import MoveApplicationToDifferentWaitingListForm from "../../../forms/applications/MoveApplicationToDifferentWaitingListForm";
import SendForWLApprovalForm from "../../../forms/eProposal/SendForWLApprovalForm";
import TakeActionModal from "../../../components/common/TakeActionModal";

const WaitingListWrapper = ({ query }) => {
  // Routers
  const navigate = useNavigate();

  // States
  const [rowState, setRowState] = useState({});
  const [pdfURL, setPdfURL] = useState("");
  const [actionCode, setActionCode] = useState(0);

  // Disclosures
  const actionDisclosure = useDisclosure();
  const forwardDisclosure = useDisclosure();
  const forwardPdfDisclosure = useDisclosure();
  const moveToDifferentWL = useDisclosure();
  const moveToApprovedDisclosure = useDisclosure();
  const rejectDisclosure = useDisclosure();
  const forwardEProposalDisclosure = useDisclosure();

  // Handlers
  const handleActions = (action, row) => {
    setActionCode(action.actionCode);
    setRowState(row);

    switch (action.actionCode) {
      case 3:
        moveToApprovedDisclosure.onOpen();
        break;
      case 4:
        forwardDisclosure.onOpen();
        break;
      case 6:
        rejectDisclosure.onOpen();
        break;
      case 12:
        moveToDifferentWL.onOpen();
        break;
      case 22:
        forwardEProposalDisclosure.onOpen();
        break;
      default:
        break;
    }
  };

  // Empty State
  if (query.isSuccess && query?.data?.data?.length === 0) {
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
            <Heading size="md">No Waiting List Applications</Heading>
            <Text color="body" textAlign="center">
              It seems you haven't got any waiting list applications yet.
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  // Sort
  const sortedWaitingList = query?.data?.data?.sort(
    (a, b) => a.waitingListCode - b.waitingListCode
  );

  const showActions = (row) => {
    setRowState(row);
    actionDisclosure.onOpen();
  };

  return (
    <>
      {/* Modals */}
      <TakeActionModal
        isOpen={actionDisclosure.isOpen}
        onClose={actionDisclosure.onClose}
        rowState={rowState}
        setActionCode={setActionCode}
        moveToApprovedDisclosure={moveToApprovedDisclosure}
        forwardDisclosure={forwardDisclosure}
        rejectDisclosure={rejectDisclosure}
        moveToDifferentWL={moveToDifferentWL}
        forwardEProposalDisclosure={forwardEProposalDisclosure}
      />

      <ForwardWaitingListApplicationForm
        actionCode={actionCode}
        rowState={rowState}
        isOpen={forwardDisclosure.isOpen}
        onClose={forwardDisclosure.onClose}
        setPdfURL={setPdfURL}
        forwardPdfDisclosure={forwardPdfDisclosure}
      />

      <RejectApplicationForm
        actionCode={actionCode}
        rowState={rowState}
        isOpen={rejectDisclosure.isOpen}
        onClose={rejectDisclosure.onClose}
        role="CH"
      />

      <MoveApplicationToDifferentWaitingListForm
        actionCode={actionCode}
        rowState={rowState}
        isOpen={moveToDifferentWL.isOpen}
        onClose={moveToDifferentWL.onClose}
      />

      <SendForWLApprovalForm
        rowState={rowState}
        isOpen={forwardEProposalDisclosure.isOpen}
        onClose={forwardEProposalDisclosure.onClose}
      />

      <MoveToApprovedListForm
        actionCode={actionCode}
        rowState={rowState}
        isOpen={moveToApprovedDisclosure.isOpen}
        onClose={moveToApprovedDisclosure.onClose}
      />

      <ForwardWaitingListApplicationPDFForm
        pdfURL={pdfURL}
        actionCode={actionCode}
        rowState={rowState}
        isOpen={forwardPdfDisclosure.isOpen}
        onClose={forwardPdfDisclosure.onClose}
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
              <Th>Pay Level</Th>
              <Th>Applied Date</Th>
              <Th>Date of Retirement</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {(query.isPending
              ? new Array(10).fill(null)
              : sortedWaitingList
            )?.map((row, index) => {
              const status =
                row?.actions?.find((action) => action.actionCode === -1) ||
                null;

              return (
                <Tr key={index}>
                  <Td>
                    <SkeletonText
                      w="8"
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.waitingListNo}
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
                      {row?.department}
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
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.scaleOfPay}
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
                    {status ? (
                      <Badge colorScheme="brand" w="fit-content">
                        {status.action}
                      </Badge>
                    ) : (
                      "-"
                    )}
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
                            variant="outline"
                            icon={<MdOutlineSensorOccupied />}
                            onClick={() =>
                              navigate("/ch/waiting-lists/details", {
                                state: { rowState: row },
                              })
                            }
                          />
                        </Tooltip>

                        <Button onClick={() => showActions(row)}>
                          Take Action
                        </Button>

                        {/* {row?.actions?.map((action) => (
                          <Button
                            key={action.actionCode}
                            onClick={() => handleActions(action, row)}
                            disabled={action.actionCode === -1}
                          >
                            {action.action}
                          </Button>
                        ))} */}
                      </ButtonGroup>
                    </Skeleton>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default WaitingListWrapper;
