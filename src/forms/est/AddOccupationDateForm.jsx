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
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import InputField from "../../components/core/formik/InputField";
import { useQueryClient } from "@tanstack/react-query";
import { useAddOccupationDate } from "../../hooks/allotmentsQuery";

const AddOccupationDateForm = ({
  isOpen,
  onClose,
  rowState,
  parentOnClose,
}) => {
  // Hooks
  const toast = useToast();

  // Queries
  const queryClient = useQueryClient();
  const occupationQuery = useAddOccupationDate(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-pending-quarters-allotment"],
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-vacate-request-stats"],
      });
      onClose();
      parentOnClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description:
          response.data.detail || "Occupation date added successfully",
      });
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
          "Oops! something went wrong. Couldn't add occupation date.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    appNo: rowState?.appNo,
    occupationDate: "",
  };

  const validationSchema = yup.object({
    appNo: yup.string().required("App no. is required"),
    occupationDate: yup.date().required("Occupation Date is required"),
  });

  const onSubmit = (values) => {
    occupationQuery.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Add Occupation Date
          </ModalHeader>

          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => (
              <Form>
                <ModalBody as={Stack} spacing={4}>
                  <InputField
                    type="date"
                    name="occupationDate"
                    label="Occupation Date"
                  />
                </ModalBody>

                <ModalFooter as={HStack}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    w="full"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="brand"
                    w="full"
                    isLoading={occupationQuery.isPending}
                    loadingText="Loading"
                  >
                    Add
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default AddOccupationDateForm;
