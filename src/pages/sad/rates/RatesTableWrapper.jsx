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

const RatesTableWrapper = ({
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
              Coulnd't find search item. {searchText}
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
            <Heading size="md">No Rates added</Heading>
            <Text color="body" textAlign="center">
              It seems you haven't added any rates yet.
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
              <Th>Year Range</Th>
              <Th>Category</Th>
              <Th>Item</Th>
              <Th>Unit</Th>
              <Th>Rate (Rs.)</Th>
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
                      w="8"
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.startYear}-{row?.endYear}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Badge
                        colorScheme={getCategoryColorScheme(row?.categoryCode)}
                      >
                        {row?.category}
                      </Badge>
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={row?.subItems.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.name}
                      {row?.subItems.map((subItem, i) => (
                        <Box key={i} mb={1}>
                          ({String.fromCharCode(97 + i)}) {subItem.name}
                        </Box>
                      ))}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={row?.subItems.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.unit}
                      {row?.subItems.map((subItem, i) => (
                        <Box key={i} mb={1}>
                          ({String.fromCharCode(97 + i)}) {subItem.unit || "-"}
                        </Box>
                      ))}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={row?.subItems.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.rate}
                      {row?.subItems.map((subItem, i) => (
                        <Box key={i} mb={1}>
                          ({String.fromCharCode(97 + i)}) {subItem.rate || "-"}
                        </Box>
                      ))}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <ButtonGroup variant="outline" isAttached={true}>
                      {isEstate && (
                        <Button
                          onClick={() => {
                            navigate("/est/quarters/update", {
                              state: { rowState: row },
                            });
                          }}
                        >
                          Edit
                        </Button>
                      )}
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

export default RatesTableWrapper;
