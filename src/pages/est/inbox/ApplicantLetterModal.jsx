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
  VStack,
} from "@chakra-ui/react";
import PdfViewer from "../../../components/core/PDFViewer";

const ApplicantLetterModal = ({ isOpen, onClose, pdfURL }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay>
        <ModalContent as={VStack}>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Applicant Letter
          </ModalHeader>

          <ModalBody>
            <PdfViewer pdfFile={pdfURL} />
          </ModalBody>
          <ModalFooter as={HStack}>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ApplicantLetterModal;
