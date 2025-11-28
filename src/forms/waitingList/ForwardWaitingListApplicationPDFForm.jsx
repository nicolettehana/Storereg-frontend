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
  useToast,
  VStack,
} from "@chakra-ui/react";
import PdfViewer from "../../components/core/PDFViewer";
import { downloadPdfUrl } from "../../components/utils/blobHelper";
import { useBookingActions } from "../../hooks/bookingQueries";
import { useQueryClient } from "@tanstack/react-query";
import * as yup from "yup";
import { Form, Formik } from "formik";
import TextAreaField from "../../components/core/formik/TextAreaField";

const ForwardWaitingListApplicationPDFForm = ({
  actionCode,
  pdfURL,
  isOpen,
  onClose,
  rowState,
  choice,
}) => {
  // Hooks
  const toast = useToast();

  // Queries
  const queryClient = useQueryClient();
  const actionQuery = useBookingActions(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-approved-waiting-list-by-list-type"],
      });

      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description:
          response.data.detail || "Allotment order sent to applicant",
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
          "Oops! something went wrong. Couldn't upload allotment order.",
      });

      return error;
    }
  );

  // Form
  const initialValues = {
    appNo: rowState?.appNo,
    actionCode: actionCode,
    remarks: "",
  };

  const validationSchema = yup.object({
    appNo: yup.string().required("Application No. is required"),
    actionCode: yup.number().required("Action code is required"),
    remarks: yup.string().required("Remarks is required"),
  });

  const onSubmit = (values) => {
    actionQuery.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay>
        <ModalContent as={VStack}>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Allotment Order
          </ModalHeader>

          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <Form>
                  <ModalBody as={VStack} spacing={4} maxW="xl">
                    <HStack justifyContent="end">
                      <Button type="button" variant="outline" onClick={onClose}>
                        Close
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          downloadPdfUrl(
                            pdfURL,
                            `${rowState?.appNo} - Generated Allotment Order`
                          )
                        }
                      >
                        Download
                      </Button>
                    </HStack>

                    {choice === "upload" && (
                      <Stack spacing={4}>
                        <TextAreaField
                          name="remarks"
                          label="Remarks"
                          placeholder="Type here..."
                        />

                        <Button
                          type="submit"
                          variant="brand"
                          isLoading={actionQuery.isPending}
                          loadingText="Sending"
                        >
                          Send allotment order to Applicant
                        </Button>
                      </Stack>
                    )}

                    <PdfViewer pdfFile={pdfURL} />
                  </ModalBody>
                </Form>
              );
            }}
          </Formik>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ForwardWaitingListApplicationPDFForm;
