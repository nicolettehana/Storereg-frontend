import {
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
import dayjs from "dayjs";
import { MdOutlineSensorOccupied, MdOutlineTableChart } from "react-icons/md";
import RejectApplicationForm from "../../../forms/applications/RejectApplicationForm";
import { useState } from "react";
import ForwardWaitingListApplicationForm from "../../../forms/waitingList/ForwardWaitingListApplicationForm";
import PDFApplication from "../../user/dashboard/details/PDFApplication";
import ForwardWaitingListApplicationPDFForm from "../../../forms/waitingList/ForwardWaitingListApplicationPDFForm";
import MoveApplicationToDifferentWaitingListForm from "../../../forms/applications/MoveApplicationToDifferentWaitingListForm";
import SendForAllotmentApprovalForm from "../../../forms/eProposal/SendForAllotmentApprovalForm";
import { useNavigate } from "react-router-dom";
import ApprovedWLActionsModal from "./ApprovedWLActionsModal";

const PublishListTableWrapper = ({ query, type }) => {
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
  if (
    query.isSuccess &&
    (query?.data?.data?.length === 0 || !query?.data?.data)
  ) {
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
            <Heading size="md">Approved Waiting List is empty</Heading>
            <Text color="body" textAlign="center">
              {type} approved waiting list is empty.
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  // Hooks
  const navigate = useNavigate();

  // States
  const [rowState, setRowState] = useState({});
  const [actionCode, setActionCode] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);
  const [choice, setChoice] = useState("generate");

  // Disclosures
  const actionsDisclosure = useDisclosure();
  const rejectDisclosure = useDisclosure();
  const generateDisclosure = useDisclosure();
  const pdfPreviewDisclosure = useDisclosure();
  const forwardPdfDisclosure = useDisclosure();
  const differentWaitingListDisclosure = useDisclosure();
  const forwardEProposalDisclosure = useDisclosure();

  // Handlers
  const showActions = (row) => {
    setRowState(row);
    actionsDisclosure.onOpen();
  };

  // If Success
  return (
    <>
      {/* Modals */}
      <ApprovedWLActionsModal
        isOpen={actionsDisclosure.isOpen}
        onClose={actionsDisclosure.onClose}
        rowState={rowState}
        setActionCode={setActionCode}
        rejectDisclosure={rejectDisclosure}
        generateDisclosure={generateDisclosure}
        differentWaitingListDisclosure={differentWaitingListDisclosure}
        forwardEProposalDisclosure={forwardEProposalDisclosure}
      />

      <PDFApplication
        rowState={rowState}
        pdfFile={pdfFile}
        isOpen={pdfPreviewDisclosure.isOpen}
        onClose={pdfPreviewDisclosure.onClose}
      />

      <ForwardWaitingListApplicationForm
        actionCode={actionCode}
        rowState={rowState}
        isOpen={generateDisclosure.isOpen}
        onClose={generateDisclosure.onClose}
        setPdfURL={setPdfFile}
        forwardPdfDisclosure={forwardPdfDisclosure}
        choice={choice}
        setChoice={setChoice}
      />

      <ForwardWaitingListApplicationPDFForm
        actionCode={actionCode}
        pdfURL={pdfFile}
        rowState={rowState}
        isOpen={forwardPdfDisclosure.isOpen}
        onClose={forwardPdfDisclosure.onClose}
        choice={choice}
      />

      <RejectApplicationForm
        actionCode={actionCode}
        isOpen={rejectDisclosure.isOpen}
        onClose={rejectDisclosure.onClose}
        rowState={rowState}
        role="CH"
      />

      <MoveApplicationToDifferentWaitingListForm
        actionCode={actionCode}
        rowState={rowState}
        isOpen={differentWaitingListDisclosure.isOpen}
        onClose={differentWaitingListDisclosure.onClose}
      />

      <SendForAllotmentApprovalForm
        isOpen={forwardEProposalDisclosure.isOpen}
        onClose={forwardEProposalDisclosure.onClose}
        rowState={rowState}
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
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {(query.isPending
              ? new Array(10).fill(null)
              : query?.data?.data
            )?.map((row, index) => {
              return (
                <Tr key={index}>
                  <Td>
                    <SkeletonText
                      w="8"
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {index + 1}
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
                        <Text fontSize="small" color="body">
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
                        <Text>{row?.department}</Text>
                        <Text fontSize="small" color="body">
                          {row?.officeAddress}
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
                      {dayjs(row?.uploadTimestamp).format("DD MMM YYYY")}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {dayjs(row?.dateOfRetirement).format("DD MMM YYYY")}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <Skeleton isLoaded={!query.isPending} fadeDuration={index}>
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
                              navigate("/ch/published-lists/details", {
                                state: { rowState: row },
                              })
                            }
                          />
                        </Tooltip>

                        <Button onClick={() => showActions(row)}>
                          Take Action
                        </Button>

                        {/* {row?.actions?.map((action) => {
                          return (
                            <Button
                              key={action.actionCode}
                              onClick={() => handleActions(action, row)}
                              disabled={action.actionCode === -1}
                            >
                              {action.action}
                            </Button>
                          );
                        })} */}
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

export default PublishListTableWrapper;
