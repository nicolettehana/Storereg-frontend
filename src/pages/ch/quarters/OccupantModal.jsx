import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";

const OccupantModal = ({ isOpen, onClose, rowState }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Occupant Details
          </ModalHeader>

          <ModalBody>
            <Stack
              border="1px"
              borderColor="border"
              rounded="md"
              p={4}
              background="onPaper"
            >
              <SimpleGrid columns={2}>
                <Text color="body">Name:</Text>
                <Text fontWeight="bold">{rowState?.name || "-"}</Text>
              </SimpleGrid>

              <SimpleGrid columns={2}>
                <Text color="body">Designation:</Text>
                <Text fontWeight="bold">{rowState?.designation || "-"}</Text>
              </SimpleGrid>

              <SimpleGrid columns={2}>
                <Text color="body">Department/Office:</Text>
                <Text fontWeight="bold">{rowState?.department || "-"}</Text>
              </SimpleGrid>

              <SimpleGrid columns={2}>
                <Text color="body">Pay Scale:</Text>
                <Text fontWeight="bold">{rowState?.payScale || "-"}</Text>
              </SimpleGrid>

              <SimpleGrid columns={2}>
                <Text color="body">Occupation Date:</Text>
                <Text fontWeight="bold">
                  {rowState?.dateOfOccupation
                    ? dayjs(rowState?.dateOfOccupation).format("DD MMM YYYY")
                    : "-"}
                </Text>
              </SimpleGrid>

              <SimpleGrid columns={2}>
                <Text color="body">Date of Retirement:</Text>
                <Text fontWeight="bold">
                  {rowState?.dateOfRetirement
                    ? dayjs(rowState?.dateOfRetirement).format("DD MMM YYYY")
                    : "-"}
                </Text>
              </SimpleGrid>
            </Stack>
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

export default OccupantModal;
