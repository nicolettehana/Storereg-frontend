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

const ForwardApplicationForm = ({ rowState, actionCode, isOpen, onClose }) => {
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

      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail,
      });

      onClose();
      navigate("/da/dashboard");
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
          "Oops! something went wrong. Couldn't forward application.",
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
                      Are you sure you want to forward booking application
                      number <strong>{rowState?.appNo}</strong>?
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
                      variant="brand"
                      w="full"
                      isLoading={actionQuery.isPending}
                      loadingText="Forwarding"
                    >
                      Yes, Forward
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

export default ForwardApplicationForm;
