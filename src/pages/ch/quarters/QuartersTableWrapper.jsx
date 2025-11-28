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
import OccupantModal from "./OccupantModal";
import { useEnableDisableQuarter } from "../../../hooks/quartersQueries";
import { useQueryClient } from "@tanstack/react-query";
import DisableQuarterModal from "../../est/quarters/DisableQuarterModal";
import { useNavigate } from "react-router-dom";

const QuartersTableWrapper = ({
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
            <Heading size="md">Quarters is empty</Heading>
            <Text color="body" textAlign="center">
              Coulnd't find quarter no. {searchText}
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
            <Heading size="md">Quarters is empty</Heading>
            <Text color="body" textAlign="center">
              It seems you haven't created any quarters yet.
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
              <Th>Quarter No.</Th>
              <Th>Quarter Name</Th>
              <Th>Location</Th>
              <Th>Status</Th>
              <Th>Visible to GAD</Th>
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
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.quarterName || "-"}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.location}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.status === "Vacant" ? (
                        <Badge colorScheme="green">{row?.status}</Badge>
                      ) : (
                        <Badge colorScheme="red">{row?.status}</Badge>
                      )}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <HStack>
                      {row?.isEnabled ? (
                        <Badge colorScheme="green">Yes</Badge>
                      ) : (
                        <Tooltip
                          label={
                            <Stack>
                              <Text>
                                Yes: The details of the quarter and it's status
                                are viewable by GAD. If vacant, it is included
                                in allotment process.
                              </Text>
                              <Text>No: Quarter not viewable by GAD</Text>
                            </Stack>
                          }
                        >
                          <HStack>
                            <Badge colorScheme="red">No</Badge>
                            <MdOutlineInfo />
                          </HStack>
                        </Tooltip>
                      )}

                      <LightMode>
                        <Switch
                          colorScheme="brand"
                          isChecked={row?.isEnabled}
                          onChange={() => {
                            if (row?.isEnabled) {
                              handleDisable(row);
                            } else {
                              enableDisableQuery.mutate({
                                quarterNo: row?.quarterNo,
                                status: "",
                              });
                            }
                          }}
                        />
                      </LightMode>
                    </HStack>
                  </Td>
                  <Td>
                    <ButtonGroup variant="outline" isAttached={true}>
                      <Tooltip
                        label={
                          row?.status !== "Vacant" && (
                            <Stack spacing={0}>
                              <Text>{row?.name}</Text>
                              <Text color="body">{row?.designation}</Text>
                            </Stack>
                          )
                        }
                      >
                        <IconButton
                          disabled={row?.status === "Vacant"}
                          icon={<MdOutlineSensorOccupied />}
                          onClick={() => {
                            if (row?.status !== "Vacant") {
                              setRowState(row);
                              occupantDetailsDisclosure.onOpen();
                            }
                          }}
                        />
                      </Tooltip>
                      {isEstate && (
                        <Button
                          onClick={() => {
                            navigate("/est/quarters/update", {
                              state: { rowState: row },
                            });
                          }}
                        >
                          Update Quarter Details
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

export default QuartersTableWrapper;
