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
import {
  useBookingActions,
  useFetchVacantQuartersByType,
} from "../../hooks/bookingQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import * as yup from "yup";
import SelectField from "../../components/core/formik/SelectField";
import TextAreaField from "../../components/core/formik/TextAreaField";
import { useNavigate } from "react-router-dom";
import { useFetchQuarterTypes } from "../../hooks/quartersQueries";

const AllotDifferentQuarterForm = ({
  actionCode,
  rowState,
  isOpen,
  onClose,
}) => {
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();
  const quarterTypesQuery = useFetchQuarterTypes();
  const vacantQuarterQuery = useFetchVacantQuartersByType(
    (response) => response,
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description:
          error.response.data.detail ||
          "Oops! something went wrong. Couldn't fetch vacant quarters.",
      });

      return error;
    }
  );
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
      navigate("/ch/dashboard");
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
          "Oops! something went wrong. Couldn't allot different quarter.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    appNo: rowState?.appNo,
    actionCode: actionCode,
    type: "",
    quarterNo: "",
    remarks: "",
  };

  const validationSchema = yup.object({
    appNo: yup.string().required("Application number is required"),
    type: yup.string().required("Quarter Type is required"),
    quarterNo: yup.string().required("Quarter No. is required"),
    remarks: yup.string().required("Remarks is required"),
  });

  const onSubmit = (values) => {
    const formData = { ...values };
    delete formData.type;

    actionQuery.mutate(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Allot Different Quarter
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
                    <SelectField
                      name="type"
                      label="Quarter Type"
                      placeholder="Select an option"
                      onChange={(e) => {
                        formik.setFieldValue("type", e.target.value);
                        vacantQuarterQuery.mutate({ type: e.target.value });
                      }}
                    >
                      {quarterTypesQuery?.data?.data?.map((row) => (
                        <option key={row?.code} value={row?.code}>
                          {row?.quarterType}
                        </option>
                      ))}
                    </SelectField>

                    {formik.values.type && (
                      <SelectField
                        name="quarterNo"
                        label="Quarter No."
                        placeholder="Select an option"
                      >
                        {vacantQuarterQuery?.data?.data?.map((row) => (
                          <option key={row?.quarterNo} value={row?.quarterNo}>
                            {row?.quarterNo}
                          </option>
                        ))}
                      </SelectField>
                    )}

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
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      variant="brand"
                      w="full"
                      isLoading={actionQuery.isPending}
                      loadingText="Allotting"
                    >
                      Allot
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

export default AllotDifferentQuarterForm;
