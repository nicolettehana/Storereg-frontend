import React, { useState } from "react";
import {
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
  ButtonGroup,
  Center,
  Heading,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { MdOutlineTableChart } from "react-icons/md";
import dayjs from "dayjs";
import { useViewVacateDocuments } from "../../../hooks/vacateRequestQueries";
import PDFViewerModal from "../../../components/common/PDFViewerModal";
import VacateRequestAcceptRejectForm from "../../../forms/vacate/VacateRequestAcceptRejectForm";

const ESTVacateRequestPendingTableWrapper = ({
  query,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
}) => {
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
            <Heading size="md">Vacate Request is empty</Heading>
            <Text color="body" textAlign="center">
              It seems you haven't got any pending vacate request yet.
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  // States
  const [pdfURL, setPdfURL] = useState("");
  const [rowState, setRowState] = useState({});

  // Disclosures
  const pdfDisclosure = useDisclosure();
  const rejectDisclosure = useDisclosure();

  // Queires
  const viewDocumentQuery = useViewVacateDocuments(
    (response) => {
      setPdfURL(window.URL.createObjectURL(response.data));
      pdfDisclosure.onOpen();
      return response;
    },
    (error) => {
      return error;
    }
  );

  return (
    <Stack spacing={4}>
      {/* Modals */}
      <PDFViewerModal
        isOpen={pdfDisclosure.isOpen}
        onClose={pdfDisclosure.onClose}
        pdfURL={pdfURL}
      />

      <VacateRequestAcceptRejectForm
        rowState={rowState}
        isOpen={rejectDisclosure.isOpen}
        onClose={rejectDisclosure.onClose}
      />

      {/* Filters */}
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
              <Th>Quarter No. & Name</Th>
              <Th>Vacate Date</Th>
              <Th>Applied Date</Th>
              <Th>Remarks (if any)</Th>
              <Th>Document List</Th>
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
                      {row?.quarterNo}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {dayjs(row?.vacateDate).format("DD MMM YYYY")}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {dayjs(row?.requestedDate).format("DD MMM YYYY")}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.remarks || "-"}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <Skeleton isLoaded={!query.isPending} fadeDuration={index}>
                      <ButtonGroup variant="outline" isAttached={true}>
                        {row?.documents?.map((doc) => (
                          <Button
                            key={doc?.documentType}
                            onClick={() =>
                              viewDocumentQuery.mutate({
                                documentCode: doc?.documentCode,
                              })
                            }
                          >
                            {doc?.documentType}
                          </Button>
                        ))}
                      </ButtonGroup>
                    </Skeleton>
                  </Td>
                  <Td>
                    <Skeleton isLoaded={!query.isPending} fadeDuration={index}>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setRowState(row);
                          rejectDisclosure.onOpen();
                        }}
                      >
                        Take Action
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
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        query={query}
      />
    </Stack>
  );
};

export default ESTVacateRequestPendingTableWrapper;
