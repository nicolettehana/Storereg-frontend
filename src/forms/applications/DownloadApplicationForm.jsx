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
  useToast,
} from "@chakra-ui/react";
import { useDownloadBookingForm } from "../../hooks/bookingQueries";
import { downloadPDF } from "../../components/utils/blobHelper";

const DownloadApplicationForm = ({ rowState, isOpen, onClose }) => {
  // Hooks
  const toast = useToast();

  // Queries
  const downloadFormQuery = useDownloadBookingForm(
    (response) => {
      downloadPDF(
        response.data,
        `${rowState?.appNo}-Quarter-Booking-Application`
      );

      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Booking application downloading",
      });

      onClose();
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
          "Oops! something went wrong. Couldn't download application form.",
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
            <Text color="body">
              Are you sure you want to download booking application form?
            </Text>
          </ModalBody>

          <ModalFooter as={HStack}>
            <Button type="button" variant="outline" onClick={onClose} w="full">
              Go Back
            </Button>
            <Button
              type="button"
              variant="brand"
              w="full"
              isLoading={downloadFormQuery.isPending}
              loadingText="Downloading"
              onClick={() =>
                downloadFormQuery.mutate({ appNo: rowState?.appNo })
              }
            >
              Yes, Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default DownloadApplicationForm;
