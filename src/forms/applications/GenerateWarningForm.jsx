import React from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
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

const GenerateWarningForm = ({ formik, query, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Confirmation
          </ModalHeader>

          <ModalBody as={Stack} spacing={4}>
            <Text color="body">
              Are you sure you want to generate booking application form?
            </Text>

            <Alert status="warning" rounded="md">
              <AlertIcon />
              <AlertDescription>
                Once the form has been generated, it cannot be edited/updated.
              </AlertDescription>
            </Alert>
          </ModalBody>

          <ModalFooter as={HStack}>
            <Button type="button" variant="outline" onClick={onClose} w="full">
              Go Back
            </Button>
            <Button
              type="button"
              variant="brand"
              w="full"
              isLoading={query.isPending}
              loadingText="Generating"
              onClick={() => formik.submitForm()}
            >
              Yes, Generate
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default GenerateWarningForm;
