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
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import { useFetchItemsList } from "../../hooks/itemQueries";
import { useFetchCategories, useFetchUnits } from "../../hooks/masterQueries";
import { useFetchFirmsList } from "../../hooks/firmQueries";
import { useCreateRate } from "../../hooks/ratesQueries";
import SelectField from "../../components/core/formik/SelectField";
import SelectFieldSearchable from "../../components/core/formik/SelectFieldSearchable";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const CreatePurchaseForm = () => {
  const [totalCost, setTotalCost] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const categoryQuery = useFetchCategories();
  const unitQuery = useFetchUnits();
  const firmsListQuery = useFetchFirmsList();

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
        description: error.response?.data?.detail || "Unable to add rate.",
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
        categoryCode: yup.string().required("Please select category"),
        itemId: yup.number().required("Please select Item"),
        unitId: yup.number().required("Please select unit"),
        quantity: yup.number().required("Please enter quantity"),
      })
    ),
  });

  const onSubmit = (values) => {
    createRate.mutate(values);
  };

  // Convert categories to options
  const categoryOptions = categoryQuery?.data?.data || [];

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Stack as={Form} spacing={8}>
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
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

            {/* ITEMS FIELD ARRAY */}
            <FieldArray name="items">
              {({ push, remove }) => (
                <Stack spacing={6} w="100%" gridColumn="1/-1">
                  {formik.values.items.map((row, index) => {
                    // Fetch items for this row's category
                    const itemsQuery = useFetchItemsList(
                      row.categoryCode || "All"
                    );
                    console.log(row.categoryCode);
                    const items = itemsQuery?.data?.data || [];
                    const selectedItem = items.find(
                      (i) => i.id === Number(row.itemId)
                    );

                    return (
                      <Box
                        key={index}
                        p={4}
                        border="1px solid #ddd"
                        borderRadius="md"
                      >
                        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                          {/* Category */}
                          <SelectField
                            name={`items[${index}].categoryCode`}
                            label="Category"
                            placeholder="Select category"
                            onChange={(e) => {
                              formik.setFieldValue(
                                `items[${index}].categoryCode`,
                                e.target.value
                              );
                              // Reset dependent fields
                              formik.setFieldValue(
                                `items[${index}].itemId`,
                                ""
                              );
                              formik.setFieldValue(
                                `items[${index}].subItemId`,
                                ""
                              );
                            }}
                          >
                            {categoryOptions.map((cat) => (
                              <option key={cat.code} value={cat.code}>
                                {cat.name}
                              </option>
                            ))}
                          </SelectField>

                          {/* Item */}
                          <SelectField
                            name={`items[${index}].itemId`}
                            label="Item"
                            placeholder="Select item"
                            disabled={!row.categoryCode}
                          >
                            {items.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </SelectField>

                          {/* Sub-item */}
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

                          {/* Unit */}
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

                          {/* Rate */}
                          <InputField
                            name={`items[${index}].rate`}
                            label="Rate"
                            placeholder="Auto"
                            readOnly
                          />

                          {/* Amount */}
                          <InputField
                            name={`items[${index}].amount`}
                            label="Amount"
                            placeholder="Auto"
                            readOnly
                          />
                        </SimpleGrid>

                        <Button
                          mt={3}
                          size="sm"
                          colorScheme="red"
                          onClick={() => remove(index)}
                        >
                          Remove Item
                        </Button>
                      </Box>
                    );
                  })}

                  <Button
                    variant="outline"
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
                </Stack>
              )}
            </FieldArray>

            {/* Remarks */}
            <InputField
              name="remarks"
              label="Remarks"
              placeholder="Enter remarks"
            />

            {/* Total Cost */}
            <InputField
              name="totalCost"
              label="Total"
              placeholder={totalCost}
              readOnly
            />
          </SimpleGrid>

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
