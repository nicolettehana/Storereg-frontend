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
  Badge,
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import { useFetchItemsList } from "../../hooks/itemQueries";
import {
  useFetchCategories,
  useFetchUnits,
  useFetchUnitsRates,
} from "../../hooks/masterQueries";
import { useFetchFirmsList } from "../../hooks/firmQueries";
import { useCreateRate } from "../../hooks/ratesQueries";
import { useCreatePurchase } from "../../hooks/purchaseQueries";
import SelectField from "../../components/core/formik/SelectField";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SelectFieldSearchable from "../../components/core/formik/SelectFieldSearchable";
import dayjs from "dayjs";
import { MdHorizontalRule } from "react-icons/md";
import { Label } from "recharts";
import { getCategoryColorScheme } from "../../components/core/CategoryColors";

const CreatePurchaseReceiptForm = ({ data, onSuccess }) => {
  const [totalCost, setTotalCost] = useState(0);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("All");
  const [billDate, setbillDate] = useState("");

  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const categoryQuery = useFetchCategories();
  const unitQuery = useFetchUnits();
  const firmsListQuery = useFetchFirmsList(billDate);
  const itemsQuery = useFetchItemsList(selectedCategoryCode);
  const items = itemsQuery?.data?.data || [];

  const allItemsQuery = useFetchItemsList("All");
  const allItems = allItemsQuery?.data?.data || [];

  const unitsRatesQuery = useFetchUnitsRates("2025-01-01");

  const createRate = useCreateRate(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["rates"] });
      //navigate("/sad/rates");
      navigate(-1);
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

  const createPurchase = useCreatePurchase(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["purchase"] });
      //navigate("/sad/purchase");
      navigate(-1);
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
    }
  );

  const initialValues = {
    billNo: "",
    remarks: "",
    billDate: "",
    firmId: "",
    totalCost: "",
    gst: "",
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
    gstt: yup.number().required("GST Percentage is required"),
    items: yup.array().of(
      yup.object({
        categoryCode: yup.string().required("Please  select category"),
        itemId: yup.number().required("Please select item"),
        unitId: yup.number().required("Please select a unit"),
        quantity: yup.number().min(1).required("Quantity is required"),
        subItemId: yup.number(),
      })
    ),
  });

  const onSubmit = (values) => {
    const formData = { ...values };
    console.log(formData);
    createPurchase.mutate(formData);
    //createRate.mutate(formData);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        useEffect(() => {
          if (!formik.values.firmId) return;

          // Reset items to a single empty row
          formik.setFieldValue("items", [
            {
              billNo: "",
              categoryCode: "",
              itemId: "",
              subItemId: "",
              unitId: "",
              quantity: "",
              rate: "",
              amount: "",
              gst: "",
            },
          ]);

          // Reset your category filter (if applicable)
          setSelectedCategoryCode("All");
        }, [formik.values.firmId]);

        useEffect(() => {
          let total = 0;

          formik.values.items.forEach((row) => {
            const selectedItem = allItems.find(
              (item) => item.id === Number(row.itemId)
            );

            const unitsRatesFilteredList = unitsRatesQuery?.data?.data.filter(
              (item) => {
                const hasSubItems = selectedItem?.subItems?.length > 0;
                const rowHasSubItem = !!row?.subItemId;
                if (hasSubItems && rowHasSubItem) {
                  return Number(item?.subItemId) === Number(row?.subItemId);
                }
                if (!hasSubItems) return item.itemId === row.itemId;
              }
            );

            const selectedUnit = unitsRatesFilteredList?.find(
              (item) => item?.unitId === row?.unitId
            );

            if (selectedUnit && row.quantity) {
              total += selectedUnit.rate * Number(row.quantity);
            }
          });

          setTotalCost(total);
        }, [formik.values.items, unitsRatesQuery.data]);

        return (
          <Stack as={Form} spacing={8}>
            {/* Top Form Fields */}
            {/* <Box border="1px solid #ddd" p={4} borderRadius="md"> */}
            {/* <Text fontWeight="bold" fontSize="md">
                Purchase Order Details
              </Text> */}
            {/* <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} py={3}> */}
            <Badge mb={4}>
              {data?.fileNo} Dtd.{" "}
              {data?.date
                ? new Date(data.date)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")
                : "-"}
            </Badge>
            {/* </SimpleGrid> */}
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={5}>
              <InputField
                name="billNo"
                label="Bill No."
                placeholder="Enter Bill no."
              />
              <InputField
                type="date"
                name="billDate"
                max={dayjs().format("YYYY-MM-DD")}
                label="Bill Date"
                onChange={(e) => {
                  formik.setFieldValue("billDate", e.target.value);
                  setBillDate(e.target.value);
                }}
              />

              <SelectFieldSearchable
                name="firmId"
                label="Firm"
                placeholder="Select Firm"
                disabled={!formik.values.billDate}
                options={
                  firmsListQuery?.data?.data?.map((row, index) => ({
                    value: row.id,
                    label: row.firm,
                  })) || []
                }
              />

              {/* <InputField
                  type="number"
                  name="gst"
                  min={0}
                  label="GST Percentage"
                  onChange={(e) => {
                    formik.setFieldValue("gst", e.target.value);
                    setGst(e.target.value);
                  }}
                /> */}
            </SimpleGrid>
            <Text fontWeight="bold" fontSize="md">
              Items
            </Text>
            <Stack spacing={4}>
              {data?.items?.map((item, index) => (
                <Box
                  key={index}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={4}
                >
                  {/* Category */}
                  <Badge
                    mb={2}
                    colorScheme={getCategoryColorScheme(item?.categoryCode)}
                  >
                    {item?.category}
                  </Badge>

                  {/* Item name */}
                  <Text fontWeight="semibold">
                    {index + 1}. {item?.itemName}
                  </Text>

                  {/* Item without sub-items */}
                  {item?.subItems?.every((s) => !s) && (
                    <SimpleGrid columns={4} mt={2} fontSize="sm">
                      <Text>Qty: {item?.quantity}</Text>
                      <Text>
                        Rate: ₹{item?.rate} {item?.unit}
                      </Text>
                      <InputField
                        type="number"
                        name="gst"
                        min={0}
                        label="GST Percentage"
                        onChange={(e) => {
                          formik.setFieldValue("gst", e.target.value);
                          setGst(e.target.value);
                        }}
                      />
                      <InputField
                        type="number"
                        name="gst"
                        min={0}
                        label="GST"
                        onChange={(e) => {
                          formik.setFieldValue("gst", e.target.value);
                          setGst(e.target.value);
                        }}
                      />
                      <Text fontWeight="bold">Amt: ₹{item?.amount}</Text>
                    </SimpleGrid>
                  )}

                  {/* Sub-items */}
                  {item?.subItems?.filter(Boolean).length > 0 && (
                    <Stack mt={3} pl={4} spacing={2}>
                      {item?.subItems?.filter(Boolean).map((sub, i) => (
                        <Box
                          key={i}
                          //bg="gray.50"
                          //p={3}
                          borderRadius="md"
                          fontSize="sm"
                        >
                          <Text>
                            <b>({String.fromCharCode(97 + i)})</b>{" "}
                            {sub?.subItemName}
                          </Text>

                          <SimpleGrid columns={4} mt={1}>
                            <Text>Qty: {sub?.quantity}</Text>
                            <Text>
                              Rate: ₹{sub?.rate} {sub?.unit}
                            </Text>
                            <Text fontWeight="bold">Amt: ₹{sub?.amount}</Text>
                          </SimpleGrid>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
              ))}
            </Stack>
            {/* </Box> */}

            <Box border="1px solid #ddd" p={4} borderRadius="md">
              {/* Items Field Array */}
              <FieldArray name="items">
                {({ push, remove }) => (
                  <Stack spacing={8}>
                    {formik.values.items.map((row, index) => {
                      const filteredItems = allItems.filter(
                        (item) => item.category.code === row.categoryCode
                      );
                      const selectedItem = allItems.find(
                        (item) => item.id === Number(row.itemId)
                      );

                      const unitsRatesFilteredList =
                        unitsRatesQuery?.data?.data.filter((item) => {
                          const hasSubItems =
                            selectedItem?.subItems?.length > 0;
                          const rowHasSubItem = !!row?.subItemId;
                          if (hasSubItems && rowHasSubItem) {
                            return (
                              Number(item?.subItemId) === Number(row?.subItemId)
                            );
                          }
                          if (!hasSubItems) return item.itemId === row.itemId;
                        });

                      const selectedUnit = unitsRatesFilteredList?.find(
                        (item) => item?.unitId === row?.unitId
                      );

                      const filteredCategories =
                        categoryQuery?.data?.data.filter((item) => {
                          const matchingFirm = firmsListQuery?.data?.data.find(
                            (firm) =>
                              Number(formik.values?.firmId) === Number(firm.id)
                          );
                          if (!matchingFirm) return false;

                          // Check if ANY of the firm's categories matches item.code
                          return matchingFirm.categories?.some(
                            (cat) => cat.code === item.code
                          );
                        });

                      // const filteredCategories =
                      //   categoryQuery?.data?.data.filter((item) => {
                      //     return (
                      //       Number(item?.code) === (
                      //         firmsListQuery?.data?.data?.filter(firm)=>{
                      //           return(Number(formik.values?.firmId)===Number(firm.id));
                      //         }
                      //       ))
                      //     );
                      //   });

                      return (
                        <Box
                          key={index}
                          p={4}
                          //border="1px solid #ddd"
                          borderRadius="md"
                        >
                          <SimpleGrid columns={{ base: 1, md: 6 }} gap={4}>
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
                                disabled={!formik.values.firmId}
                                onValueChange={(value) => {
                                  setSelectedCategoryCode(value);
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
                                {/* {filteredCategories.map((row, index) => (
                                  <option key={row.code} value={row.code}>
                                    {row.name}
                                  </option>
                                ))} */}
                                {categoryQuery?.data?.data?.map((row) => (
                                  <option key={row.code} value={row.code}>
                                    {row.name}
                                  </option>
                                ))}
                              </SelectField>
                            </Flex>

                            <SelectFieldSearchable
                              name={`items[${index}].itemId`}
                              label="Item"
                              placeholder="Select Item"
                              disabled={!row.categoryCode}
                              onValueChange={(value) => {
                                formik.setFieldValue(
                                  `items[${index}].itemId`,
                                  value
                                );

                                // Reset subItem
                                formik.setFieldValue(
                                  `items[${index}].subItemId`,
                                  ""
                                );
                              }}
                              options={
                                filteredItems.map((row, index) => ({
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
                                {selectedItem.subItems.map((sub, index) => (
                                  <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                  </option>
                                ))}
                              </SelectField>
                            )}

                            <InputField
                              name={`items[${index}].quantity`}
                              label="Quantity"
                              placeholder="Enter quantity"
                            />

                            <SelectFieldSearchable
                              name={`items[${index}].unitId`}
                              label="Unit"
                              placeholder="Search unit"
                              options={
                                //unitsRatesFilteredListQuery?.data?.data?.map((row) => ({
                                unitsRatesFilteredList?.map((row, index) => ({
                                  value: row.unitId,
                                  label: row.unit,
                                })) || []
                              }
                            />
                            {selectedItem?.subItems?.length > 0 ? (
                              ""
                            ) : (
                              <Box /> // empty placeholder to keep grid column
                            )}

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

                              <Spacer />

                              {/* Rate + Amount Vertical Stack */}
                              <VStack align="flex-end" spacing={0} mt={4}>
                                <HStack spacing={2}>
                                  <FormLabel m={0}>Rate:</FormLabel>
                                  <Text fontWeight="bold">
                                    {selectedUnit?.rate
                                      ? "₹" + selectedUnit.rate
                                      : "-"}
                                  </Text>
                                </HStack>

                                <HStack spacing={2}>
                                  <FormLabel m={0}>Amount:</FormLabel>
                                  <Text fontWeight="bold">
                                    {selectedUnit?.rate
                                      ? "₹" + selectedUnit.rate * row?.quantity
                                      : "-"}
                                  </Text>
                                </HStack>
                              </VStack>
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
            </Box>

            {/* Total Cost */}
            <HStack spacing={2} justifyContent="end">
              <FormLabel m={0}>Total:</FormLabel>
              <Text fontWeight="bold">{"₹" + totalCost}</Text>
              <Text fontWeight="bold"></Text>
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
        );
      }}
    </Formik>
  );
};

export default CreatePurchaseReceiptForm;
