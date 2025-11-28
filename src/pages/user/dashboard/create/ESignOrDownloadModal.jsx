import React, { useState } from "react";
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
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";

const ESignOrDownloadModal = ({
  isOpen,
  onClose,
  warningDisclosure,
  eProposalDisclosure,
}) => {
  // States
  const [choice, setChoice] = useState("");

  // Handlers
  const handleConfirm = () => {
    onClose();
    switch (choice) {
      case "online":
        break;
      case "eProposal":
        eProposalDisclosure.onOpen();
        onClose();
        break;
      case "manually":
        warningDisclosure.onOpen();
        onClose();
        break;
      default:
        return;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Confirmation
          </ModalHeader>
          <ModalBody>
            <RadioGroup onChange={setChoice} value={choice}>
              <Stack spacing={4}>
                {/* <Radio value="online">
                  Proceed online. e-Sign the document with Aadhaar.
                </Radio> */}
                <Radio value="eProposal">
                  Submit to Forwarding Officer via eProposal
                </Radio>
                <Radio value="manually">
                  <Stack spacing={0}>
                    <Text>
                      Proceed manually by uploading the signed scanned copy?
                    </Text>
                    <Text fontSize="small" color="body">
                      Here, in this option you will have to download the
                      generated PDF and will have to sign and seal and upload
                      the scanned copy of the form
                    </Text>
                  </Stack>
                </Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>
          <ModalFooter as={HStack}>
            <Button type="button" variant="outline" onClick={onClose} w="full">
              Close
            </Button>
            <Button
              type="button"
              variant="brand"
              w="full"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ESignOrDownloadModal;
