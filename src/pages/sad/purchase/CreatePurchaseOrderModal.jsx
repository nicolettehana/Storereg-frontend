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
  useToast,
} from "@chakra-ui/react";
import CreatePurchaseForm from "../../../forms/purchase/CreatePurchaseForm";

const CreatePurchaseOrderModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader fontSize="lg" fontWeight="bold">
          Create Purchase
        </ModalHeader>
        <ModalBody>
          <CreatePurchaseForm onSuccess={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreatePurchaseOrderModal;
