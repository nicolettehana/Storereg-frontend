import { useState } from "react";
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
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  HStack,
  IconButton,
  LightMode,
  SkeletonText,
  Stack,
  Switch,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  MdOutlineInfo,
  MdOutlineSearch,
  MdOutlineSensorOccupied,
  MdOutlineTableChart,
} from "react-icons/md";
import OccupantModal from "../../ch/quarters/OccupantModal";
import { useEnableDisableQuarter } from "../../../hooks/quartersQueries";
import { useQueryClient } from "@tanstack/react-query";
import DisableQuarterModal from "../../est/quarters/DisableQuarterModal";
import { useNavigate } from "react-router-dom";
import { getCategoryColorScheme } from "../../../components/core/CategoryColors";

const PurchaseTableWrapper = ({
  isEstate = true,
  query,
  searchText,
  pageNumber,
  setPageNumber,
}) => {
  // Disclosures
  const disableDisclosure = useDisclosure();
  const occupantDetailsDisclosure = useDisclosure();

  // States
  const [rowState, setRowState] = useState({});

  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();
  const enableDisableQuery = useEnableDisableQuarter(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetch-quarters-by-type"] });
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
          "Oops! Something went wrong. Couldn't enable/disable quarter.",
      });
      return error;
    }
  );

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

  // Empty Search
  if (
    query.isSuccess &&
    query?.data?.data?.content?.length === 0 &&
    searchText !== ""
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
            <MdOutlineSearch size={48} />
          </Box>

          <VStack>
            <Heading size="md">No results</Heading>
            <Text color="body" textAlign="center">
              Coulnd't find search value. {searchText}
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
            <Heading size="md">No Purchases</Heading>
            <Text color="body" textAlign="center">
              There are no purchases in the selected date range/category.
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  // Handlers
  const handleDisable = (row) => {
    disableDisclosure.onOpen();
    setRowState(row);
  };

  return (
    <Stack spacing={4}>
      {/* Modals */}
      <DisableQuarterModal
        isOpen={disableDisclosure.isOpen}
        onClose={disableDisclosure.onClose}
        rowState={rowState}
      />

      <OccupantModal
        isOpen={occupantDetailsDisclosure.isOpen}
        onClose={occupantDetailsDisclosure.onClose}
        rowState={rowState}
      />

      {/* Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Sl. No.</Th>
              <Th>Date of Purchase</Th>
              <Th>Firm</Th>
              <Th>Category</Th>
              <Th>Item</Th>
              <Th>Quantity</Th>
              <Th>Rate (₹)</Th>
              <Th>Amount (₹)</Th>
              <Th>Total (₹)</Th>
              <Th>Remarks</Th>
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
                      w="8"
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.date
                        ? new Date(row.date)
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, "-") // dd-mm-yyyy
                        : ""}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Box whiteSpace="normal">{row?.firmName}</Box>
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={row?.items?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.items?.map((item, i) => (
                        <Box key={i} mb={1}>
                          <Badge
                            colorScheme={getCategoryColorScheme(
                              item?.categoryCode
                            )}
                          >
                            {item.category}
                          </Badge>
                          {item?.subItems
                            ?.filter((s) => s) // <-- removes null values
                            .map((subItem, i) => (
                              <Box key={i} mb={1}>
                                {"\u00A0"}
                              </Box>
                            ))}
                        </Box>
                      ))}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={row?.items?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.items?.map((item, i) => (
                        <Box key={i} mb={1}>
                          <b>{i + 1})</b> {item.itemName}
                          {item?.subItems
                            ?.filter((s) => s) // <-- removes null values
                            .map((subItem, i) => (
                              <Box key={i} mb={1}>
                                &nbsp;&nbsp;
                                <Badge
                                  textTransform="none"
                                  fontSize="sm"
                                  fontWeight="normal"
                                  bg="white"
                                >
                                  <b>({String.fromCharCode(97 + i)}) </b>
                                  {subItem.subItemName}
                                </Badge>
                              </Box>
                            ))}
                        </Box>
                      ))}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={row?.items?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.items?.map((item, i) => (
                        <Box key={i} mb={1}>
                          {item.subItems?.every((s) => s == null)
                            ? item.quantity
                            : "\u00A0"}
                          {item?.subItems?.map(
                            (subItem, i) =>
                              subItem?.subItemName && (
                                <Box key={i} mb={1}>
                                  {subItem.quantity}
                                </Box>
                              )
                          )}
                        </Box>
                      ))}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={row?.items?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.items?.map((item, i) => (
                        <Box key={i} mb={1}>
                          {item.subItems?.every((s) => s == null)
                            ? `${item.rate} ${item.unit}`
                            : "\u00A0"}
                          {item?.subItems?.map(
                            (subItem, i) =>
                              subItem?.subItemName && (
                                <Box key={i} mb={1}>
                                  {subItem.rate} {subItem.unit}
                                </Box>
                              )
                          )}
                        </Box>
                      ))}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={row?.items?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.items?.map((item, i) => (
                        <Box key={i} mb={1}>
                          {item.subItems?.every((s) => s == null)
                            ? item.amount
                            : "\u00A0"}
                          {item?.subItems?.map(
                            (subItem, i) =>
                              subItem?.subItemName && (
                                <Box key={i} mb={1}>
                                  {subItem.amount}
                                </Box>
                              )
                          )}
                        </Box>
                      ))}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.totalCost}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.remarks}
                    </SkeletonText>
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

export default PurchaseTableWrapper;
