import React from "react";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import PDFViewer from "../../../../components/core/PDFViewer";
import { downloadPdfUrl } from "../../../../components/utils/blobHelper";

const PDFApplication = ({ rowState, pdfFile, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            PDF Viewer
          </ModalHeader>

          <ModalBody>
            <HStack justify="end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="brand"
                onClick={() =>
                  downloadPdfUrl(
                    pdfFile,
                    `${rowState?.appNo}_Quarter_Application`
                  )
                }
              >
                Save
              </Button>
            </HStack>
            <PDFViewer pdfFile={pdfFile} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default PDFApplication;
