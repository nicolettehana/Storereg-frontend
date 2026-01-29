import { Form, Formik, FieldArray } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import {
  Button,
  HStack,
  VStack,
  SimpleGrid,
  Stack,
  useToast,
  Box,
  FormLabel,
  Text,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import { useFetchCategories } from "../../hooks/masterQueries";
import { useCreatePurchaseNS } from "../../hooks/purchaseQueries";
import SelectField from "../../components/core/formik/SelectField";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { MdHorizontalRule } from "react-icons/md";
import { useAuth } from "../../components/auth/useAuth";

const CreatePurchaseOrderNSForm = () => {
  const [totalCost, setTotalCost] = useState(0);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("All");
  const [purchaseDate, setPurchaseDate] = useState("");

  const { role } = useAuth();

  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const categoryQuery = useFetchCategories();

  const createPurchase = useCreatePurchaseNS(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["purchasens"] });
      //navigate("/sad/purchase");
      role === "SAD" ? navigate("/sad/purchase") : navigate("/purns/purchase");
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "New Purchase added",
      });
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description: error.response.data.detail || "Unable to add purchase.",
      });
    },
  );

  const initialValues = {
    fileNo: "",
    remarks: "",
    purchaseDate: "",
    receivedFrom: "",
    issueTo: "",
    items: [
      {
        categoryCode: "",
        item: "",
        unit: "",
        quantity: "",
      },
    ],
  };

  const validationSchema = yup.object({
    remarks: yup.string(),
    fileNo: yup.string().required("File no. is required"),
    receivedFrom: yup.string().required("This field is required"),
    issueTo: yup.string().required("This field is required"),
    items: yup.array().of(
      yup.object({
        categoryCode: yup.string().required("Please  select category"),
        item: yup.string().required("Item name is required"),
        unit: "",
        quantity: yup.number().min(1).required("Quantity is required"),
      }),
    ),
  });

  const onSubmit = (values) => {
    const formData = { ...values };
    console.log(formData);
    createPurchase.mutate(formData);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Stack as={Form} spacing={8}>
            {/* Top Form Fields */}
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <InputField
                name="fileNo"
                label="File No."
                placeholder="Enter file no."
              />
              <InputField
                type="date"
                name="purchaseDate"
                max={dayjs().format("YYYY-MM-DD")}
                label="Date"
                onChange={(e) => {
                  formik.setFieldValue("purchaseDate", e.target.value);
                  setPurchaseDate(e.target.value);
                }}
              />
              <InputField
                name="receivedFrom"
                label="Received From"
                placeholder="Enter value"
              />

              <InputField
                name="issueTo"
                label="Issue To"
                placeholder="Enter value"
              />
              <InputField
                name="remarks"
                label="Remarks"
                isRequired={false}
                placeholder="Enter remark"
              />
            </SimpleGrid>

            <Text fontWeight="bold" fontSize="lg">
              Items List
            </Text>
            <Box border="1px solid #ddd" p={4} borderRadius="md">
              {/* Items Field Array */}
              <FieldArray name="items">
                {({ push, remove }) => (
                  <Stack spacing={8}>
                    {formik.values.items.map((row, index) => {
                      return (
                        <Box
                          key={index}
                          p={4}
                          //border="1px solid #ddd"
                          borderRadius="md"
                        >
                          <SimpleGrid columns={{ base: 1, md: 5 }} gap={4}>
                            <Flex align="flex-end" justify="center" gap={2}>
                              <FormLabel m={0} w="35px" textAlign="center">
                                <b>
                                  {index + 1}
                                  {". "}
                                </b>
                              </FormLabel>
                              <SelectField
                                name={`items[${index}].categoryCode`}
                                label="Category"
                                placeholder="Select category"
                                onValueChange={(value) => {
                                  setSelectedCategoryCode(value);
                                }}
                              >
                                {categoryQuery?.data?.data?.map(
                                  (row) =>
                                    row?.stockType === "N" && (
                                      <option key={row.code} value={row.code}>
                                        {row.name}
                                      </option>
                                    ),
                                )}
                              </SelectField>
                            </Flex>

                            <InputField
                              name={`items[${index}].item`}
                              label="Item"
                              placeholder="Enter item"
                            />

                            <InputField
                              name={`items[${index}].quantity`}
                              label="Quantity"
                              placeholder="Enter quantity"
                            />

                            <InputField
                              name={`items[${index}].unit`}
                              label="Unit"
                              placeholder="Enter unit"
                            />

                            <HStack justifyContent="start" w="100%">
                              {/* Remove Button */}
                              <Button
                                mt={8}
                                colorScheme="red"
                                variant="outline"
                                onClick={() => remove(index)}
                              >
                                -
                              </Button>
                            </HStack>
                          </SimpleGrid>
                        </Box>
                      );
                    })}

                    {/* Single Add Item Button */}
                    <HStack justifyContent="end">
                      <Button
                        mt={4}
                        variant="solid"
                        colorScheme="green"
                        onClick={() =>
                          push({
                            categoryCode: "",
                            item: "",
                            unit: "",
                            quantity: "",
                          })
                        }
                      >
                        + Add Item
                      </Button>
                    </HStack>
                  </Stack>
                )}
              </FieldArray>
            </Box>

            {/* Submit Buttons */}
            <HStack justifyContent="end">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button
                type="submit"
                variant="brand"
                isLoading={createPurchase.isPending}
                loadingText="Saving"
              >
                Submit
              </Button>
            </HStack>
          </Stack>
        );
      }}
    </Formik>
  );
};

export default CreatePurchaseOrderNSForm;
