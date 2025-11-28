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
import { useBookingActions } from "../../hooks/bookingQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import * as yup from "yup";
import TextAreaField from "../../components/core/formik/TextAreaField";
import { useCancelAllotment } from "../../hooks/allotmentsQuery";

const CancelAllotmentForm = ({ rowState, isOpen, onClose }) => {
  // Hooks
  const toast = useToast();

  // Queries
  const queryClient = useQueryClient();
  const cancelQuery = useCancelAllotment(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-pending-quarters-allotment"],
      });

      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail,
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
          "Oops! something went wrong. Couldn't cancel application.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    appNo: rowState?.appNo,
    remarks: "",
  };

  const validationSchema = yup.object({
    appNo: yup.string().required("Application number is required"),
    remarks: yup.string().nullable(),
  });

  const onSubmit = (values) => {
    cancelQuery.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Confirmation
          </ModalHeader>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <Form>
                  <ModalBody as={Stack} spacing={4}>
                    <Text>
                      Are you sure you want to cancel booking application number{" "}
                      <strong>{rowState?.appNo}</strong>?
                    </Text>

                    <TextAreaField
                      name="remarks"
                      label="Remarks"
                      placeholder="Type here..."
                      isRequired={false}
                    />
                  </ModalBody>

                  <ModalFooter as={HStack}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      w="full"
                    >
                      Go Back
                    </Button>

                    <Button
                      type="submit"
                      colorScheme="red"
                      w="full"
                      isLoading={cancelQuery.isPending}
                      loadingText="Cancelling"
                    >
                      Yes, Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              );
            }}
          </Formik>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default CancelAllotmentForm;
