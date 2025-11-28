import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  IconButton,
  SkeletonText,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  MdOutlineInsertDriveFile,
  MdOutlineSearch,
  MdOutlineTableChart,
} from "react-icons/md";
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
import MarkAsVacatedForm from "../../../forms/occupants/MarkAsVacatedForm";
import { useGenerateAllotmentOrder } from "../../../hooks/waitingListQueries";
import AllotmentOrderModal from "../occupants/AllotmentOrderModal";
import { useNavigate } from "react-router-dom";

const ESTPendingApplicationTableWrapper = ({
  query,
  searchText,
  pageNumber,
  setPageNumber,
}) => {
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
  if (query.isSuccess && query?.data?.data?.length === 0 && searchText !== "") {
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
            <MdOutlineSearch size={48} />
          </Box>

          <VStack>
            <Heading size="md">Couldn't find pending allotments</Heading>
            <Text color="body" textAlign="center">
              Looks like the allotment you were searching for does not exists.
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
            <Heading size="md">No Pending Allotments</Heading>
            <Text color="body" textAlign="center">
              Pending allotments will be displayed here.
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  // States
  const [rowState, setRowState] = useState({});
  const [pdfURL, setPdfURL] = useState("");

  // Disclosures
  const vacatedDisclosure = useDisclosure();
  const allotmentDisclosure = useDisclosure();

  // Hooks
  const navigate = useNavigate();
  const toast = useToast();

  // Queries
  const generateQuery = useGenerateAllotmentOrder(
    (response) => {
      setPdfURL(window.URL.createObjectURL(response.data));
      allotmentDisclosure.onOpen();
      return response;
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description:
          error.response.data.detail ||
          "Oops! something went wrong. Couldn't generate allotment order.",
      });
      return error;
    }
  );

  return (
    <Stack spacing={4}>
      {/* Modals */}
      <MarkAsVacatedForm
        isOpen={vacatedDisclosure.isOpen}
        onClose={vacatedDisclosure.onClose}
        rowState={rowState}
      />

      <AllotmentOrderModal
        isOpen={allotmentDisclosure.isOpen}
        onClose={allotmentDisclosure.onClose}
        pdfURL={pdfURL}
        isEst={true}
        rowState={rowState}
      />

      {/* Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Sl. No.</Th>
              <Th>Quarter No.</Th>
              <Th>Name & Designation</Th>
              <Th>Department/Office</Th>
              <Th>Pay Scale</Th>
              <Th>Allotment Date</Th>
              <Th>Occupation Date</Th>
              <Th>Date of Retirement</Th>
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
                      w="8"
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {elementCounter(index, query)}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.quarterNo}
                    </SkeletonText>
                  </Td>
                  <Td wrap={true}>
                    <SkeletonText
                      noOfLines={2}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.name ? (
                        <Stack spacing={0}>
                          <Text>{row?.name}</Text>
                          <Text color="body" fontSize="small">
                            {row?.designation}
                          </Text>
                        </Stack>
                      ) : (
                        "-"
                      )}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.department || "-"}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      &#8377;{row?.payScale}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.dateOfAllotment
                        ? dayjs(row?.dateOfAllotment).format("DD MMM YYYY")
                        : "-"}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.dateOfOccupation
                        ? dayjs(row?.dateOfOccupation).format("DD MMM YYYY")
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
                    <ButtonGroup variant="outline" isAttached={true}>
                      <Button
                        onClick={() => {
                          setRowState(row);
                          generateQuery.mutate({ appNo: row?.appNo });
                        }}
                      >
                        Take Action
                      </Button>
                    </ButtonGroup>
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

export default ESTPendingApplicationTableWrapper;
