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
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import SelectField from "../../../components/core/formik/SelectField";
import { useEnableDisableQuarter } from "../../../hooks/quartersQueries";
import { useQueryClient } from "@tanstack/react-query";

const DisableQuarterModal = ({ isOpen, onClose, rowState }) => {
  const options = [
    { label: "Under Maintenance", value: "3" },
    { label: "Condemned", value: "4" },
    { label: "Reserved", value: "5" },
  ];

  // Hooks
  const toast = useToast();

  // Queries
  const queryClient = useQueryClient();
  const enableDisableQuery = useEnableDisableQuarter(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetch-quarters-by-type"] });
      onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Quarter disabled successfully",
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
          "Oops! Something went wrong. Couldn't enable/disable quarter.",
      });
      return error;
    }
  );

  const initialValue = {
    quarterNo: rowState.quarterNo,
    status: "",
  };

  const validationSchema = yup.object({
    quarterNo: yup.string().required("Quarter No. is required"),
    status: yup.string().required("Status is required"),
  });

  const onSubmit = (values) => {
    enableDisableQuery.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <Formik
          enableReinitialize={true}
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <ModalContent>
                  <ModalCloseButton />
                  <ModalHeader fontSize="lg" fontWeight="bold">
                    Confirmation
                  </ModalHeader>

                  <ModalBody>
                    <SelectField
                      name="status"
                      label="Status"
                      placeholder="Select an option"
                    >
                      {options.map((row) => (
                        <option key={row.value} value={row.value}>
                          {row.label}
                        </option>
                      ))}
                    </SelectField>
                  </ModalBody>

                  <ModalFooter as={HStack} spacing={2}>
                    <Button
                      type="button"
                      variant="outline"
                      w="full"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                    <Button type="submit" colorScheme="red" w="full">
                      Disable
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Form>
            );
          }}
        </Formik>
      </ModalOverlay>
    </Modal>
  );
};

export default DisableQuarterModal;
