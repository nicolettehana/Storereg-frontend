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
import CreatePurchaseReceiptNSForm from "../../../forms/purchase/CreatePurchaseReceiptNSForm";

const CreatePurchaseOrderNSModal = ({ isOpen, onClose, data }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader fontSize="lg" fontWeight="bold">
          Purchase Receipt (Non-Stock)
        </ModalHeader>
        <ModalBody>
          {data ? (
            <CreatePurchaseReceiptNSForm onSuccess={onClose} data={data} />
          ) : (
            <Text color="gray.500">No purchase selected</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreatePurchaseOrderNSModal;
