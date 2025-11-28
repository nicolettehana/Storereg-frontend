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
import { useBookingActions } from "../../hooks/bookingQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import * as yup from "yup";
import TextAreaField from "../../components/core/formik/TextAreaField";
import { useNavigate } from "react-router-dom";

const RejectApplicationForm = ({
  rowState,
  actionCode,
  isOpen,
  onClose,
  role,
}) => {
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

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

      queryClient.invalidateQueries({
        queryKey: ["fetch-waiting-list-applications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["fetch-approved-waiting-list-by-list-type"],
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

      if (role === "CH") navigate("/ch/dashboard");
      else if (role === "CS") navigate("/cs/dashboard");
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
          "Oops! something went wrong. Couldn't reject application.",
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
    remarks: yup.string().required("Remarks is required"),
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
                      Are you sure you want to reject booking application number{" "}
                      <strong>{rowState?.appNo}</strong>?
                    </Text>

                    <TextAreaField
                      name="remarks"
                      label="Remarks"
                      placeholder="Type here..."
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
                      isLoading={actionQuery.isPending}
                      loadingText="Rejecting"
                    >
                      Yes, Reject
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

export default RejectApplicationForm;
