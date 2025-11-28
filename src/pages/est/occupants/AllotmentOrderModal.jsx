import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import PdfViewer from "../../../components/core/PDFViewer";
import { downloadPdfUrl } from "../../../components/utils/blobHelper";
import { useDownloadBookingForm } from "../../../hooks/bookingQueries";
import PDFApplication from "../../user/dashboard/details/PDFApplication";
import UploadAcceptanceLetterForm from "../../../forms/est/UploadAcceptanceLetterForm";
import AddOccupationDateForm from "../../../forms/est/AddOccupationDateForm";
import CancelAllotmentForm from "../../../forms/est/CancelAllotmentForm";

const AllotmentOrderModal = ({
  isOpen,
  onClose,
  pdfURL,
  isEst = false,
  rowState = null,
}) => {
  // Hooks
  const toast = useToast();

  // States
  const [pdfFile, setPdfFile] = useState("");

  // Disclosures
  const pdfPreviewDisclosure = useDisclosure();
  const uploadDisclosure = useDisclosure();
  const occupationDisclosure = useDisclosure();
  const cancelDisclosure = useDisclosure();

  // Queries
  const downloadFormQuery = useDownloadBookingForm(
    (response) => {
      if (response.data instanceof Blob && response.data.size > 0) {
        const url = window.URL.createObjectURL(response.data);
        setPdfFile(url);
        pdfPreviewDisclosure.onOpen();
      } else {
        toast({
          isClosable: true,
          duration: 3000,
          position: "top-right",
          status: "error",
          title: "Error",
          description:
            "Oops! something went wrong. Couldn't download application form.",
        });
      }

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
    <>
      {/* Modals */}
      {isEst && (
        <>
          <PDFApplication
            rowState={rowState}
            pdfFile={pdfFile}
            isOpen={pdfPreviewDisclosure.isOpen}
            onClose={pdfPreviewDisclosure.onClose}
          />

          <UploadAcceptanceLetterForm
            isOpen={uploadDisclosure.isOpen}
            onClose={uploadDisclosure.onClose}
            rowState={rowState}
          />

          <AddOccupationDateForm
            isOpen={occupationDisclosure.isOpen}
            onClose={occupationDisclosure.onClose}
            rowState={rowState}
            parentOnClose={onClose}
          />

          <CancelAllotmentForm
            isOpen={cancelDisclosure.isOpen}
            onClose={cancelDisclosure.onClose}
            rowState={rowState}
          />
        </>
      )}

      {/* Main */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay>
          <ModalContent as={VStack}>
            <ModalCloseButton />
            <ModalHeader fontSize="lg" fontWeight="bold">
              Confirmation
            </ModalHeader>

            <ModalBody as={Stack} spacing={4}>
              {isEst && (
                <HStack justifyContent="space-between">
                  <ButtonGroup variant="outline" isAttached={true}>
                    <Button
                      onClick={() =>
                        downloadPdfUrl(pdfURL, `${rowState?.appNo}_Order`)
                      }
                    >
                      Download Order
                    </Button>
                    <Button
                      onClick={() =>
                        downloadFormQuery.mutate({ appNo: rowState?.appNo })
                      }
                      isLoading={downloadFormQuery.isPending}
                      loadingText="Downloading"
                    >
                      View Application Details
                    </Button>
                  </ButtonGroup>

                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </HStack>
              )}
              <HStack justifyContent="end">
                {isEst && (
                  <>
                    <Button
                      colorScheme="brand"
                      onClick={uploadDisclosure.onOpen}
                    >
                      Upload Acceptance Letter
                    </Button>
                    <Button
                      colorScheme="orange"
                      onClick={occupationDisclosure.onOpen}
                    >
                      Add Occupation Date
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        onClose();
                        cancelDisclosure.onOpen();
                      }}
                    >
                      Cancel Allotment
                    </Button>
                  </>
                )}
              </HStack>

              <PdfViewer pdfFile={pdfURL} />
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default AllotmentOrderModal;
