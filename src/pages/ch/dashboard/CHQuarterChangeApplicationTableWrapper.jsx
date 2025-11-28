import React from "react";
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
  VStack,
} from "@chakra-ui/react";
import { MdOutlineTableChart } from "react-icons/md";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const CHQuarterChangeApplicationTableWrapper = ({
  query,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
}) => {
  // Hooks
  const navigate = useNavigate();

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
            <Heading size="md">
              No Returned Applications (from Applicants)
            </Heading>

            <Text color="body" textAlign="center">
              It seems you haven't got any quarter change request yet.
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  return (
    <Stack spacing={4}>
      <HStack justifyContent="space-between">
        {/* Page Size */}
        <PageSizing
          pageSize={pageSize}
          setPageSize={setPageSize}
          setPageNumber={setPageNumber}
        />

        {/* Create */}
        <div />
      </HStack>

      {/* Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Sl. No.</Th>
              <Th>Application No.</Th>
              <Th>Name</Th>
              <Th>Designation</Th>
              <Th>Department</Th>
              <Th>Office Address</Th>
              <Th>Applied Date</Th>
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
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.appNo || ""}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.name || ""}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.designation || ""}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.departmentOrDirectorate || ""}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.officeAddress || ""}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.uploadTimestamp
                        ? dayjs(row?.uploadTimestamp).format(
                            "DD MMM YYYY, hh:mm A"
                          )
                        : "-"}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <Skeleton
                      isLoaded={!query.isPending}
                      rounded="md"
                      fadeDuration={index}
                    >
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate("/ch/dashboard/details", {
                            state: { rowState: row, tab: "quarter-change" },
                          })
                        }
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
        query={query}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
      />
    </Stack>
  );
};

export default CHQuarterChangeApplicationTableWrapper;
