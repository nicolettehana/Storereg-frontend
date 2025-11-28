import React from "react";
import {
  Alert,
  AlertIcon,
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

const AcceptAllotmentForm = ({
  rowState,
  actionCode,
  isOpen,
  onClose,
  allotmentOrderDisclosure,
}) => {
  // Hooks
  const toast = useToast();

  // Queries
  const queryClient = useQueryClient();
  const actionQuery = useBookingActions(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-booking-applications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["fetch-application-summary"],
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
      allotmentOrderDisclosure.onClose();

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
          "Oops! something went wrong. Couldn't accept allotment.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    appNo: rowState?.appNo,
    remarks: "",
    actionCode,
  };

  const validationSchema = yup.object({
    appNo: yup.string().required("Application number is required"),
    remarks: yup.string().nullable(),
    actionCode: yup
      .number()
      .typeError("Action Code should be a numeric character")
      .required("Action Code is required"),
  });

  const onSubmit = (values) => {
    actionQuery.mutate(values);
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
                      Are you sure you want to accept allotment for booking
                      application number <strong>{rowState?.appNo}</strong>?
                    </Text>

                    <TextAreaField
                      name="remarks"
                      label="Remarks"
                      placeholder="Type here..."
                      isRequired={false}
                    />

                    <Alert status="info" alignItems="start" rounded="md">
                      <AlertIcon />
                      <Text>
                        Upon acceptance of allotment, visit the Estate Office
                        within 7 days with a Letter of Acceptance
                      </Text>
                    </Alert>
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
                      variant="brand"
                      w="full"
                      isLoading={actionQuery.isPending}
                      loadingText="Submitting"
                    >
                      Yes, I Accept
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

export default AcceptAllotmentForm;
