import React from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  SimpleGrid,
  SkeletonText,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Status from "../bookings/Status";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "../../../components/core/Table";
import { MdOutlineAdd, MdOutlineTableChart } from "react-icons/md";
import { Link } from "react-router-dom";

const SummaryWrapper = ({ query }) => {
  // Empty State
  if (query.isSuccess && query?.data?.data?.applicationsSummary?.length === 0) {
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
            <Heading size="md">Your application summary is empty</Heading>
            <Text color="body" textAlign="center">
              It seems you haven't booked any quarters yet.
            </Text>
          </VStack>

          {/* Create */}
          <Button
            flexShrink={0}
            as={Link}
            to="/user/bookings/create"
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
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Application No.</Th>
            <Th>Remarks</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {(query.isPending
            ? new Array(4).fill(null)
            : query?.data?.data?.applicationsSummary
          )?.map((summary, index) => (
            <Tr key={index}>
              <Td>
                <SkeletonText
                  isLoaded={!query.isPending}
                  noOfLines={1}
                  fadeDuration={index}
                >
                  {summary?.applicationNo}
                </SkeletonText>
              </Td>
              <Td>
                <SkeletonText
                  isLoaded={!query.isPending}
                  noOfLines={1}
                  fadeDuration={index}
                >
                  {summary?.remarks || "-"}
                </SkeletonText>
              </Td>
              <Td>
                <SkeletonText
                  isLoaded={!query.isPending}
                  noOfLines={1}
                  fadeDuration={index}
                >
                  <Status label={summary?.status} description={""} />
                </SkeletonText>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default SummaryWrapper;
