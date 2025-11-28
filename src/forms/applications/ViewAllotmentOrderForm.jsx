import React, { useEffect, useState } from "react";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useGenerateAllotmentOrder } from "../../hooks/waitingListQueries";
import PdfViewer from "../../components/core/PDFViewer";
import { useFetchApplicationRemarks } from "../../hooks/bookingQueries";

const ViewAllotmentOrderForm = ({
  rowState,
  isOpen,
  onClose,
  handleActions,
}) => {
  // States
  const [pdfURL, setPdfURL] = useState("");

  // Queries
  const generateQuery = useGenerateAllotmentOrder(
    (response) => {
      setPdfURL(window.URL.createObjectURL(response.data));
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
          "Oops! something went wrong. Couldn't generate allotment order.",
      });
      return error;
    }
  );
  const viewRemarksQuery = useFetchApplicationRemarks(rowState?.appNo);

  // Side-Effects
  useEffect(() => {
    generateQuery.mutate({ appNo: rowState?.appNo });
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay>
        <ModalContent as={VStack}>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Allotment Order
          </ModalHeader>

          <ModalBody as={Stack} spacing={4}>
            <HStack>
              {rowState?.actions?.map((action) => (
                <Button
                  key={action.actionCode}
                  w="full"
                  colorScheme={action.actionCode === 15 ? "brand" : "red"}
                  // icon={<MdOutlineLogout size={16} />}
                  onClick={() => handleActions(action, rowState)}
                >
                  {action.action}
                </Button>
              ))}
            </HStack>
            <PdfViewer pdfFile={pdfURL} />

            <Text>{viewRemarksQuery?.data?.data?.remark}</Text>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ViewAllotmentOrderForm;
