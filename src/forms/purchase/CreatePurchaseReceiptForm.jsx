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
  const [billDate, setBillDate] = useState("");

  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const categoryQuery = useFetchCategories();
  const unitQuery = useFetchUnits();
  const firmsListQuery = useFetchFirmsList(billDate);
  const itemsQuery = useFetchItemsList(selectedCategoryCode);
  const allItemsQuery = useFetchItemsList("All");
  const unitsRatesQuery = useFetchUnitsRates("2025-01-01");

  const allItems = allItemsQuery?.data?.data || [];

  const createPurchase = useCreatePurchase(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["purchase"] });
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
    billNo: data?.billNo || "",
    remarks: data?.remarks || "",
    billDate: data?.billDate || "",
    firmId: data?.firmId || "",
    totalCost: 0,
    items: data?.items?.map((item) => ({
      categoryCode: item.categoryCode || "",
      itemId: item.itemId || "",
      subItemId: item.subItemId || "",
      unitId: item.unitId || "",
      quantity: item.quantity || 0,
      rate: item.rate || 0,
      amount: item.amount || 0,
      gstPercentage: item.gstPercentage ?? "", // empty string if not set
      cgst: item.cgst ?? 0,
      sgst: item.sgst ?? 0,
      // initialize sub-items
      subItems:
        item.subItems?.map((sub) => ({
          subItemId: sub.subItemId || "",
          subItemName: sub.subItemName || "",
          quantity: sub.quantity || 0,
          rate: sub.rate || 0,
          unitId: sub.unitId || "",
          amount: sub.amount || 0,
          gstPercentage: sub.gstPercentage ?? "",
          cgst: sub.cgst ?? 0,
          sgst: sub.sgst ?? 0,
        })) || [],
    })) || [
      {
        categoryCode: "",
        itemId: "",
        subItemId: "",
        unitId: "",
        quantity: 0,
        rate: 0,
        amount: 0,
        gstPercentage: "",
        cgst: 0,
        sgst: 0,
        subItems: [],
      },
    ],
  };

  // const initialValues = {
  //   billNo: "",
  //   //remarks: "",
  //   billDate: "",
  //   firmId: "",
  //   totalCost: "",
  //   items: [
  //     {
  //       // categoryCode: "",
  //       // itemId: "",
  //       // subItemId: "",
  //       // unitId: "",
  //       // quantity: "",
  //       // rate: "",
  //       // amount: "",
  //       gstPercentage: "",
  //       cgst: "",
  //       sgst: "",
  //     },
  //   ],
  // };

  const validationSchema = yup.object({
    firmId: yup.number().required("Firm is required"),
    //remarks: yup.string(),
    totalCost: yup.number(),
    items: yup.array().of(
      yup.object({
        //categoryCode: yup.string().required("Please select category"),
        //itemId: yup.number().required("Please select item"),
        //unitId: yup.number().required("Please select a unit"),
        //quantity: yup.number().min(1).required("Quantity is required"),
        //subItemId: yup.number(),
        gstPercentage: yup.mixed(),
        cgst: yup.number(),
        sgst: yup.number(),
      })
    ),
  });

  const calculateGst = (amount, gstPercentage) => {
    if (!amount || !gstPercentage) return { cgst: "", sgst: "" };
    const gstAmount = (Number(amount) * Number(gstPercentage)) / 100;
    return { cgst: gstAmount / 2, sgst: gstAmount / 2 };
  };

  const onSubmit = (values) => {
    const formData = { ...values };
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
        // Auto-select firm if data provided
        useEffect(() => {
          if (!data?.firmName || !firmsListQuery?.data?.data) return;
          const matchedFirm = firmsListQuery.data.data.find(
            (f) => f.firm === data.firmName
          );
          if (matchedFirm) formik.setFieldValue("firmId", matchedFirm.id);
        }, [data?.firmName, firmsListQuery?.data?.data]);

        // Recalculate total cost
        useEffect(() => {
          let total = 0;
          formik.values.items.forEach((row) => {
            const selectedItem = allItems.find(
              (item) => item.id === Number(row.itemId)
            );
            if (!selectedItem || !row.quantity) return;

            const unitsRatesFilteredList = unitsRatesQuery?.data?.data?.filter(
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

            if (selectedUnit) total += selectedUnit.rate * Number(row.quantity);
          });
          setTotalCost(total);
          formik.setFieldValue("totalCost", total, false);
        }, [formik.values.items, unitsRatesQuery.data]);

        useEffect(() => {
          formik.values.items.forEach((item, index) => {
            if (item.gstPercentage !== "" && item.amount != null) {
              const { cgst, sgst } = calculateGst(
                item.amount,
                item.gstPercentage
              );
              formik.setFieldValue(`items[${index}].cgst`, cgst); // re-render
              formik.setFieldValue(`items[${index}].sgst`, sgst);
            } else {
              formik.setFieldValue(`items[${index}].cgst`, 0);
              formik.setFieldValue(`items[${index}].sgst`, 0);
            }
          });
        }, [formik.values.items]);

        return (
          <Stack as={Form} spacing={8}>
            <Badge mb={4}>
              {data?.fileNo} Dtd.{" "}
              {data?.date
                ? new Date(data.date)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")
                : "-"}
            </Badge>

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
                  firmsListQuery?.data?.data?.map((row) => ({
                    value: row.id,
                    label: row.firm,
                  })) || []
                }
              />
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
                  <Badge
                    mb={2}
                    colorScheme={getCategoryColorScheme(item?.categoryCode)}
                  >
                    {item?.category}
                  </Badge>

                  <Text fontWeight="semibold">
                    {index + 1}. {item?.itemName}
                  </Text>

                  {item?.subItems?.filter(Boolean).length === 0 && (
                    <SimpleGrid columns={4} mt={2} fontSize="sm" gap={4}>
                      <Text>
                        Qty: {item?.quantity} <br />
                        Rate: ₹{item?.rate} {item?.unit}
                      </Text>

                      <SelectField
                        name={`items[${index}].gstPercentage`}
                        label="GST %"
                        size="xs"
                        onValueChange={(value) => {
                          const amount =
                            Number(formik.values.items[index].amount) || 0;

                          if (value === "") {
                            formik.setFieldValue(
                              `items[${index}].gstPercentage`,
                              ""
                            );
                            formik.setFieldValue(`items[${index}].cgst`, "");
                            formik.setFieldValue(`items[${index}].sgst`, "");
                            return;
                          }

                          const { cgst, sgst } = calculateGst(amount, value);
                          formik.setFieldValue(
                            `items[${index}].gstPercentage`,
                            value
                          );
                          formik.setFieldValue(`items[${index}].cgst`, cgst);
                          formik.setFieldValue(`items[${index}].sgst`, sgst);
                        }}
                      >
                        <option value="">Select GST %</option>
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                        <option value={28}>28%</option>
                      </SelectField>

                      <HStack>
                        <InputField
                          type="number"
                          name={`items[${index}].cgst`}
                          label="CGST (₹)"
                          size="xs"
                          //isReadOnly
                        />
                        <InputField
                          type="number"
                          name={`items[${index}].sgst`}
                          label="SGST (₹)"
                          size="xs"
                          //isReadOnly
                        />
                      </HStack>

                      <VStack>
                        <Text fontWeight="bold">
                          Sub total: ₹{item?.amount || 0}
                          {/* {item?.gstPercentage && ( */}
                            <>
                              <br />
                              GST: ₹{Number(item.cgst) + Number(item.sgst)}
                            </>
                          {/* )} */}
                          <br />
                          Total: ₹
                          {Number(item?.amount || 0) +
                            (Number(item?.cgst || 0) + Number(item?.sgst || 0))}
                        </Text>
                      </VStack>
                    </SimpleGrid>
                  )}

                  {item?.subItems?.filter(Boolean).length > 0 && (
                    <Stack mt={3} pl={4} spacing={2}>
                      {item?.subItems?.filter(Boolean).map((sub, i) => (
                        <Box key={i} borderRadius="md" fontSize="sm">
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

            <HStack spacing={2} justifyContent="end">
              <FormLabel m={0}>Total:</FormLabel>
              <Text fontWeight="bold">{"₹" + totalCost}</Text>
            </HStack>

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
