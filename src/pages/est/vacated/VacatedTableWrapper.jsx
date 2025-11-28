import React from "react";
import {
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
  Center,
  Heading,
  SkeletonText,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdOutlineTableChart } from "react-icons/md";
import dayjs from "dayjs";

const VacatedTableWrapper = ({ query, pageNumber, setPageNumber }) => {
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
              {query?.error?.response?.data?.detail || "Couldn't fetch data."}
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
            <Heading size="md">Vacated is empty</Heading>
            <Text color="body" textAlign="center">
              Quarters that have been vacated will be displayed here.
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  return (
    <>
      <Stack spacing={4}>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Quarter No.</Th>
                <Th>Name & Designation</Th>
                <Th>Department</Th>
                <Th>Pay Scale</Th>
                <Th>Application No.</Th>
                <Th>Occupation Date</Th>
                <Th>Vacated Date</Th>
                <Th>Date of Retirement</Th>
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
                        {row?.department || "-"}
                      </SkeletonText>
                    </Td>
                    <Td>
                      <SkeletonText
                        noOfLines={1}
                        isLoaded={!query.isPending}
                        fadeDuration={index}
                      >
                        {row?.payScale ? <>&#8377;{row?.payScale}</> : "-"}
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
                        {row?.vacatedDate
                          ? dayjs(row?.vacatedDate).format("DD MMM YYYY")
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
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>

        <Pagination
          query={query}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      </Stack>
    </>
  );
};

export default VacatedTableWrapper;
