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
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import * as yup from "yup";
import { Form, Formik } from "formik";
import {
  useAcceptVacateRequest,
  useRejectVacateRequest,
} from "../../hooks/vacateRequestQueries";
import { useQueryClient } from "@tanstack/react-query";
import TextAreaField from "../../components/core/formik/TextAreaField";

const VacateRequestAcceptRejectForm = ({ rowState, isOpen, onClose }) => {
  // States
  const [formData, setFormData] = useState({});
  const [isAccept, setIsAccept] = useState(false);

  // Disclosures
  const acceptDisclosure = useDisclosure();
  const rejectDisclosure = useDisclosure();

  // Formik
  const initialValues = {
    allotmentCode: rowState?.allotmentCode,
    remarks: "",
  };

  const validationSchema = yup.object({
    allotmentCode: yup.string().required("Allotment Code is required"),
    remarks: yup.string().required("Remarks is required"),
  });

  const onSubmit = (values) => {
    setFormData(values);
    onClose();

    if (isAccept) {
      acceptDisclosure.onOpen();
    } else {
      rejectDisclosure.onOpen();
    }
  };

  return (
    <>
      <AcceptConfirmationModal
        data={formData}
        rowState={rowState}
        isOpen={acceptDisclosure.isOpen}
        onClose={acceptDisclosure.onClose}
      />

      <RejectConfirmationModal
        data={formData}
        rowState={rowState}
        isOpen={rejectDisclosure.isOpen}
        onClose={rejectDisclosure.onClose}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader fontSize="lg" fontWeight="bold">
              Accept or Reject Vacate Request
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
                    <ModalBody as={Stack} spacing={4}>
                      <TextAreaField
                        name="remarks"
                        label="Remarks"
                        placeholder="Type here..."
                      />
                    </ModalBody>

                    <ModalFooter as={HStack}>
                      <Button
                        type="button"
                        variant="brand"
                        w="full"
                        onClick={() => {
                          setIsAccept(true);
                          formik.submitForm();
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        type="button"
                        colorScheme="red"
                        w="full"
                        onClick={() => {
                          setIsAccept(false);
                          formik.submitForm();
                        }}
                      >
                        Reject
                      </Button>
                    </ModalFooter>
                  </Form>
                );
              }}
            </Formik>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

const AcceptConfirmationModal = ({ data, rowState, isOpen, onClose }) => {
  // Hooks
  const toast = useToast();

  // Queries
  const queryClient = useQueryClient();
  const acceptVacateQuery = useAcceptVacateRequest(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-paginated-pending-vacate-request"],
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-paginated-completed-vacate-request"],
      });

      onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail,
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
          "Oops! something went wrong. Couldn't accept vacate request.",
      });
      return error;
    }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Confirmation
          </ModalHeader>

          <ModalBody as={Stack} spacing={4}>
            <Text>
              Are you sure you want to accept vacate request for{" "}
              <strong>{rowState?.quarterNo}</strong>?
            </Text>
          </ModalBody>

          <ModalFooter as={HStack}>
            <Button type="button" variant="outline" w="full" onClick={onClose}>
              No
            </Button>
            <Button
              type="button"
              variant="brand"
              w="full"
              isLoading={acceptVacateQuery.isPending}
              loadingText="Accepting"
              onClick={() => acceptVacateQuery.mutate(data)}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

const RejectConfirmationModal = ({ data, rowState, isOpen, onClose }) => {
  // Hooks
  const toast = useToast();

  // Queries
  const queryClient = useQueryClient();
  const rejectVacateQuery = useRejectVacateRequest(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-paginated-pending-vacate-request"],
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-paginated-completed-vacate-request"],
      });
      onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail,
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
          "Oops! something went wrong. Couldn't reject vacate request.",
      });
      return error;
    }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Confirmation
          </ModalHeader>

          <ModalBody as={Stack} spacing={4}>
            <Text>
              Are you sure you want to reject vacate request for{" "}
              <strong>{rowState?.quarterNo}</strong>?
            </Text>
          </ModalBody>

          <ModalFooter as={HStack}>
            <Button type="button" variant="outline" w="full" onClick={onClose}>
              No
            </Button>
            <Button
              type="button"
              colorScheme="red"
              w="full"
              isLoading={rejectVacateQuery.isPending}
              loadingText="Rejecting"
              onClick={() => rejectVacateQuery.mutate(data)}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default VacateRequestAcceptRejectForm;
