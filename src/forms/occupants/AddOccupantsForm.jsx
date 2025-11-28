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
import SelectField from "../../components/core/formik/SelectField";
import { useFetchVacantAndReservedQuarters } from "../../hooks/quartersQueries";
import { useAddOccupants } from "../../hooks/occpantsQueries";
import { useQueryClient } from "@tanstack/react-query";

const AddOccupantsForm = ({ isOpen, onClose }) => {
  // Hooks
  const toast = useToast();

  // Queries
  const queryClient = useQueryClient();
  const quarterQuery = useFetchVacantAndReservedQuarters();
  const addQuery = useAddOccupants(
    (response) => {
      queryClient.invalidateQueries(["fetch-quarters-by-status"]);
      onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Occupants added successfully",
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
          "Oops! something went wrong. Couldn't add occupants.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    name: "",
    designation: "",
    gender: "",
    quarterNo: "",
    allotmentDate: "",
    deptOffice: "",
    payScale: "",
    occupationDate: "",
    retirementDate: "",
  };

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    designation: yup.string().required("Designation is required"),
    gender: yup.string().required("Gender is required"),
    quarterNo: yup.string().required("Quarter No. is required"),
    allotmentDate: yup.date().nullable(),
    deptOffice: yup.string().nullable(),
    payScale: yup.string().nullable(),
    occupationDate: yup.date().nullable(),
    retirementDate: yup.date().nullable(),
  });

  const onSubmit = (values) => {
    addQuery.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Add Occupant
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
                    <InputField
                      type="text"
                      name="name"
                      label="Name"
                      placeholder="Enter the occupant's name"
                    />

                    <InputField
                      type="text"
                      name="designation"
                      label="Designation"
                      placeholder="Enter the occupant's designation"
                    />

                    <SelectField
                      name="gender"
                      label="Gender"
                      placeholder="Select an option"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </SelectField>

                    <InputField
                      type="text"
                      name="deptOffice"
                      label="Department/Office"
                      placeholder="Enter the occupant's department/office"
                      isRequired={false}
                    />

                    <InputField
                      type="text"
                      name="payScale"
                      label="Pay Scale"
                      placeholder="Enter the occupant's pay scale"
                      isRequired={false}
                    />

                    <SelectField
                      name="quarterNo"
                      label="Quarter No."
                      placeholder="Select an option"
                    >
                      {quarterQuery?.data?.data?.map((row) => (
                        <option key={row?.quarterNo} value={row?.quarterNo}>
                          {row?.quarterNo} - {row?.quarterName}
                        </option>
                      ))}
                    </SelectField>

                    <InputField
                      type="date"
                      name="allotmentDate"
                      label="Allotment Date"
                      // max={dayjs().format("YYYY-MM-DD")}
                      isRequired={false}
                    />

                    <InputField
                      type="date"
                      name="occupationDate"
                      label="Occupation Date"
                      //   max={dayjs().format("YYYY-MM-DD")}
                      isRequired={false}
                    />

                    <InputField
                      type="date"
                      name="retirementDate"
                      label="Retirement Date"
                      //   max={dayjs().format("YYYY-MM-DD")}
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
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      variant="brand"
                      w="full"
                      isLoading={addQuery.isPending}
                      loadingText="Marking"
                    >
                      Add
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

export default AddOccupantsForm;
