import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";

const ApprovedWLActionsModal = ({
  isOpen,
  onClose,
  rowState,
  setActionCode,
  rejectDisclosure = null,
  generateDisclosure = null,
  differentWaitingListDisclosure = null,
  forwardEProposalDisclosure = null,
}) => {
  // Handlers
  const handleActions = (action) => {
    setActionCode(action.actionCode);

    switch (action.actionCode) {
      case 4:
        generateDisclosure.onOpen();
        break;
      case 6:
        rejectDisclosure.onOpen();
        break;
      case 12:
        differentWaitingListDisclosure.onOpen();
        break;
      case 23:
        forwardEProposalDisclosure.onOpen();
        break;
      default:
        break;
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Actions
          </ModalHeader>
          <ModalBody as={Stack} spacing={2}>
            {rowState?.actions?.map((action) => (
              <Button
                key={action.actionCode}
                variant="outline"
                onClick={() => handleActions(action)}
                disabled={action.actionCode === -1}
              >
                {action.action}
              </Button>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ApprovedWLActionsModal;
