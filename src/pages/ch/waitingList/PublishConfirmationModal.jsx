import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
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
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { usePublishWaitingList } from "../../../hooks/waitingListQueries";

const PublishConfirmationModal = ({ isOpen, onClose, listCode }) => {
  // Hooks
  const toast = useToast();

  // Queries
  const publishWaitingListQuery = usePublishWaitingList(
    (response) => {
      onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description:
          response.data.detail || "Waiting list published successfully",
      });
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
          "Oops! something went wrong. Couldn't publish waiting list.",
      });
      return error;
    }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Confirmation
          </ModalHeader>
          <ModalBody as={Stack} spacing={4}>
            <Text>Are you sure you want to proceed with publishing?</Text>
            <Alert status="info" alignItems="start" rounded="md">
              <HStack alignItems="start">
                <AlertIcon />
                <Stack>
                  <AlertTitle>Note:</AlertTitle>
                  <AlertDescription>
                    Once you publish the waiting list, applicants will be able
                    to view their waiting list serial numbers.
                  </AlertDescription>
                </Stack>
              </HStack>
            </Alert>
          </ModalBody>
          <ModalFooter as={HStack}>
            <Button variant="outline" onClick={onClose} w="full">
              No
            </Button>
            <Button
              w="full"
              variant="brand"
              onClick={() => publishWaitingListQuery.mutate({ listCode })}
              isLoading={publishWaitingListQuery.isPending}
              loadingText="Publishing"
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default PublishConfirmationModal;
