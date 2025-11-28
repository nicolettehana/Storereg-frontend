import React from "react";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "../../../../components/core/Table";
import dayjs from "dayjs";

const ArchivedDetailsModal = ({ isOpen, onClose, rowState }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Details
          </ModalHeader>
          <ModalBody as={Stack} spacing={4}>
            <HStack justifyContent="space-between">
              <Text>
                Published Date:{" "}
                {dayjs(rowState?.publishedList?.entryDate).format(
                  "DD MMM YYYY, hh:mm A"
                )}
              </Text>
              <Text>Version: {rowState?.publishedList?.version}</Text>
            </HStack>

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
                  </Tr>
                </Thead>
                <Tbody>
                  {rowState?.entries?.map((row, index) => (
                    <Tr key={index}>
                      <Td>{row?.slNo}</Td>
                      <Td>
                        <Stack spacing={0}>
                          <Text>{row?.name}</Text>
                          <Text fontSize="small" color="body">
                            {row?.designation}
                          </Text>
                        </Stack>
                      </Td>
                      <Td>
                        <Stack spacing={0}>
                          <Text>{row?.department}</Text>
                          <Text fontSize="small" color="body">
                            {row?.officeAddress}
                          </Text>
                        </Stack>
                      </Td>
                      <Td>{row?.appNo}</Td>
                      <Td>{row?.scaleOfPay}</Td>
                      <Td>{dayjs(row?.entrydate).format("DD MMM YYYY")}</Td>
                      <Td>
                        {dayjs(row?.dateOfRetirement).format("DD MMM YYYY")}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ArchivedDetailsModal;
