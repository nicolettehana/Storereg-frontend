import React from "react";
import { useRef } from "react";
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
  useToast,
} from "@chakra-ui/react";

const DeletePurchaseOrderModal = ({ isOpen, onClose, data, onConfirm }) => {
  const cancelRef = useRef();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="xl"
      leastDestructiveRef={cancelRef}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader fontSize="lg" fontWeight="bold">
          Delete Conmfirmation
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete purchase order File no.
          {data?.fileNo} Dtd. {data?.date}?
        </ModalBody>
        <ModalFooter gap={2}>
          <Button ref={cancelRef} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onConfirm}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeletePurchaseOrderModal;
