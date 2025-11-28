import React from "react";
import {
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
import { useFetchApplicationRemarks } from "../../hooks/bookingQueries";

const ViewApplicationRemarksForm = ({ rowState, isOpen, onClose }) => {
  // Queries
  const viewRemarksQuery = useFetchApplicationRemarks(rowState?.appNo);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Application Remarks
          </ModalHeader>

          <ModalBody as={Stack} spacing={4}>
            <Text>{viewRemarksQuery?.data?.data?.remark}</Text>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ViewApplicationRemarksForm;
