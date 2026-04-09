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
  Box,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import InputField from "../../../components/core/formik/InputField";
import SelectField from "../../../components/core/formik/SelectField";
import { useFetchUnits, useFetchYearRange } from "../../../hooks/masterQueries";
import SelectFieldSearchable from "../../../components/core/formik/SelectFieldSearchable";
import { useAddRate } from "../../../hooks/ratesQueries";
import { useQueryClient } from "@tanstack/react-query";

const AddRateModal = ({
  isOpen,
  onClose,
  itemId,
  itemName,
  subItemId,
  subItemName,
  yearRangeId,
  baseUnitId,
}) => {
  // Queries
  const { data: unitsData, isLoading: isUnitsLoading } = useFetchUnits();
  const unitsQuery = useFetchUnits();
  const yearRangeQuery = useFetchYearRange();

  const selectedYearRange = yearRangeQuery?.data?.data?.find(
    (yr) => String(yr.id) === String(yearRangeId),
  );

  const startYear = selectedYearRange?.startYear;
  const endYear = selectedYearRange?.endYear;

  const queryClient = useQueryClient();

  const addRate = useAddRate(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["rates"] });
      onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Rate added",
      });
      // 👉 close modal if provided, otherwise navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/sad/rates");
      }
      return response;
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description: error.response.data.detail || "Unable to add rate.",
      });
      return error;
    },
  );

  // Formik initial values
  const initialValues = {
    itemName: itemName || "",
    subItemName: subItemName || "",
    unitId: "",
    rate: "",
    itemId: itemId,
    subItemId: subItemId,
    yearRangeId,
    baseUnitQuantity: "",
    baseUnitId: baseUnitId,
  };

  // Validation schema
  const validationSchema = yup.object({
    unitId: yup.string().required("Unit is required"),
    rate: yup
      .number()
      .typeError("Rate must be a number")
      .required("Rate is required")
      .positive("Rate must be greater than zero"),
    baseUnitQuantity: yup.number(),
  });

  // Submit handler
  const onSubmit = (values) => {
    console.log("Add Rate Values:", values);
    //addRate.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader fontSize="lg" fontWeight="bold">
          Add Rate for {startYear} - {endYear}
        </ModalHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ values }) => (
            <Form>
              <ModalBody as={Stack} spacing={4}>
                {/* Item Name (Read Only) */}
                <InputField name="itemName" label="Item Name" isReadOnly />

                {/* Sub Item Name (Read Only, conditional) */}
                {subItemName && (
                  <InputField
                    name="subItemName"
                    label="Sub Item Name"
                    isReadOnly
                  />
                )}

                {/* Units Select */}
                {/* <SelectField
                  name="unitId"
                  label="Unit"
                  placeholder="Select unit"
                  isLoading={isUnitsLoading}
                  options={
                    unitsQuery?.data?.data?.map((unit) => ({
                      label: unit.unit,
                      value: unit.id,
                    })) || []
                  }
                /> */}
                <SelectFieldSearchable
                  name="unitId"
                  label="Purchase Unit"
                  placeholder="Search unit"
                  options={
                    unitsQuery?.data?.data?.map((row) => ({
                      value: row.id,
                      label: row.unit,
                    })) || []
                  }
                />

                {/* Rate */}
                <InputField
                  name="rate"
                  label="Rate"
                  type="number"
                  step="0.01"
                  placeholder="Enter rate"
                />

                {values?.unitId &&
                  String(baseUnitId) !== String(values.unitId) && (
                    <>
                      {" "}
                      <Box
                        p={3}
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                      >
                        <Text fontSize="sm">
                          Purchase Unit: {values.unitId}
                        </Text>

                        <Text fontSize="sm">Issue Unit: {baseUnitId}</Text>

                        <Text fontSize="xs" color="gray.500" mt={2}>
                          Example: 1 dozen = 12 each
                        </Text>
                      </Box>
                      <HStack spacing={2}>
                        <Text whiteSpace="nowrap">
                          1 Dozen {values.unitId} =
                        </Text>

                        <InputField
                          name="rate"
                          type="number"
                          placeholder="Enter Quantity"
                          label="Base Unit Quantity Conversion"
                          textAlign="center"
                        />

                        <Text whiteSpace="nowrap">{baseUnitId}</Text>
                      </HStack>
                    </>
                  )}
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

                <Button type="submit" variant="brand" w="full">
                  Submit
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddRateModal;
