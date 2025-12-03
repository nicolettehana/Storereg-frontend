import { Form, Formik, FieldArray } from "formik";
import { useState } from "react";
import * as yup from "yup";
import {
  Button,
  HStack,
  SimpleGrid,
  Stack,
  useToast,
  Box,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import { useFetchItemsList } from "../../hooks/itemQueries";
import { useFetchCategories, useFetchUnits } from "../../hooks/masterQueries";
import { useFetchFirmsList } from "../../hooks/firmQueries";
import { useCreateRate } from "../../hooks/ratesQueries";
import SelectField from "../../components/core/formik/SelectField";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SelectFieldSearchable from "../../components/core/formik/SelectFieldSearchable";
import dayjs from "dayjs";
import { MdHorizontalRule } from "react-icons/md";

const CreatePurchaseForm = () => {
  const [totalCost, setTotalCost] = useState(0);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("All");

  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const categoryQuery = useFetchCategories();
  const unitQuery = useFetchUnits();
  const firmsListQuery = useFetchFirmsList();
  const itemsQuery = useFetchItemsList(selectedCategoryCode);
  const items = itemsQuery?.data?.data || [];

  const createRate = useCreateRate(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["rates"] });
      navigate("/sad/rates");
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Rate added",
      });
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
    }
  );

  const initialValues = {
    remarks: "",
    purchaseDate: "",
    firmId: "",
    totalCost: "",
    items: [
      {
        categoryCode: "",
        itemId: "",
        subItemId: "",
        unitId: "",
        quantity: "",
        rate: "",
        amount: "",
      },
    ],
  };

  const validationSchema = yup.object({
    firmId: yup.number().required("Firm is required"),
    remarks: yup.string(),
    totalCost: yup.number(),
    items: yup.array().of(
      yup.object({
        categoryCode: yup.string().required(),
        itemId: yup.number().required(),
        unitId: yup.number().required(),
        quantity: yup.number(),
      })
    ),
  });

  const onSubmit = (values) => {
    const formData = { ...values };
    console.log(formData);
    createRate.mutate(formData);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Stack as={Form} spacing={8}>
          {/* Top Form Fields */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <InputField
              type="date"
              name="purchaseDate"
              max={dayjs().format("YYYY-MM-DD")}
              label="Purchase Date"
            />

            <SelectFieldSearchable
              name="firmId"
              label="Firm"
              placeholder="Select Firm"
              options={
                firmsListQuery?.data?.data?.map((row) => ({
                  value: row.id,
                  label: row.firm,
                })) || []
              }
            />
            <InputField
              name="remarks"
              label="Remarks"
              placeholder="Enter remarks"
            />
          </SimpleGrid>

          <MdHorizontalRule />

          {/* Items Field Array */}
          <FieldArray name="items">
            {({ push, remove }) => (
              <Stack spacing={8}>
                {formik.values.items.map((row, index) => {
                  const selectedItem = items.find(
                    (item) => item.id === Number(row.itemId)
                  );

                  return (
                    <Box
                      key={index}
                      p={4}
                      border="1px solid #ddd"
                      borderRadius="md"
                    >
                      <SimpleGrid columns={{ base: 1, md: 5 }} gap={4}>
                        <SelectField
                          name={`items[${index}].categoryCode`}
                          label="Category"
                          placeholder="Select category"
                          onValueChange={(value) =>
                            setSelectedCategoryCode(value)
                          }
                        >
                          {categoryQuery?.data?.data?.map((row) => (
                            <option key={row.code} value={row.code}>
                              {row.name}
                            </option>
                          ))}
                        </SelectField>

                        <SelectFieldSearchable
                          name={`items[${index}].itemId`}
                          label="Item"
                          placeholder="Select Item"
                          disabled={!row.categoryCode}
                          options={
                            itemsQuery?.data?.data.map((row) => ({
                              value: row.id,
                              label: row.name,
                            })) || []
                          }
                        />

                        {selectedItem?.subItems?.length > 0 && (
                          <SelectField
                            name={`items[${index}].subItemId`}
                            label="Sub-Item"
                            placeholder="Select Sub-Item"
                          >
                            {selectedItem.subItems.map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.name}
                              </option>
                            ))}
                          </SelectField>
                        )}

                        <SelectFieldSearchable
                          name={`items[${index}].unitId`}
                          label="Unit"
                          placeholder="Search unit"
                          options={
                            unitQuery?.data?.data?.map((row) => ({
                              value: row.id,
                              label: row.unit,
                            })) || []
                          }
                        />

                        <HStack justifyContent="start">
                          <Button
                            mt={8}
                            colorScheme="red"
                            variant="outline"
                            onClick={() => remove(index)}
                          >
                            -
                          </Button>
                          <FormLabel mt={8}>Rate: </FormLabel>
                          <Text fontWeight="bold" mt={8}>
                            {totalCost}
                          </Text>
                          <FormLabel mt={8}>Amount: </FormLabel>
                          <Text fontWeight="bold" mt={8}>
                            {totalCost}
                          </Text>
                        </HStack>
                      </SimpleGrid>
                    </Box>
                  );
                })}

                {/* Single Add Item Button */}
                <HStack justifyContent="end">
                  <Button
                    mt={4}
                    variant="outline"
                    colorScheme="green"
                    onClick={() =>
                      push({
                        categoryCode: "",
                        itemId: "",
                        subItemId: "",
                        unitId: "",
                        quantity: "",
                        rate: "",
                        amount: "",
                      })
                    }
                  >
                    + Add Item
                  </Button>
                </HStack>
              </Stack>
            )}
          </FieldArray>

          {/* Total Cost */}
          <HStack justifyContent="end">
            <FormLabel>Total</FormLabel>
            <Text fontWeight="bold">{totalCost}</Text>
          </HStack>

          {/* Submit Buttons */}
          <HStack justifyContent="end">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button
              type="submit"
              variant="brand"
              isLoading={createRate.isPending}
              loadingText="Saving"
            >
              Add Purchase
            </Button>
          </HStack>
        </Stack>
      )}
    </Formik>
  );
};

export default CreatePurchaseForm;
