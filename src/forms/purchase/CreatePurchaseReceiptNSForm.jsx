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
import { useCreatePurchaseReceiptNS } from "../../hooks/purchaseQueries";
import SelectField from "../../components/core/formik/SelectField";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SelectFieldSearchable from "../../components/core/formik/SelectFieldSearchable";
import dayjs from "dayjs";
import { MdHorizontalRule } from "react-icons/md";
import { getCategoryColorScheme } from "../../components/core/CategoryColors";

const PurchaseFormEffects = ({
  formik,
  data,
  firmsListQuery,
  unitsRatesQuery,
  setTotalCost,
}) => {
  // Auto-select firm
  useEffect(() => {
    if (!data?.firmName || !firmsListQuery?.data?.data) return;

    const matchedFirm = firmsListQuery.data.data.find(
      (f) => f.firm === data.firmName
    );

    if (matchedFirm) {
      formik.setFieldValue("firmId", matchedFirm.id);
    }
  }, [data?.firmName, firmsListQuery?.data?.data]);

  // Update rate & amount
  // useEffect(() => {
  //   if (!unitsRatesQuery?.data?.data) return;

  //   formik.values.items.forEach((row, index) => {
  //     if (!row.quantity) return;

  //     const rateRow = unitsRatesQuery.data.data.find(
  //       (r) =>
  //         r.itemId === row.itemId && r.unitId === row.unitId && !r.subItemId
  //     );

  //     if (!rateRow) return;

  //     const amount = Number(rateRow.rate) * Number(row.quantity);

  //     formik.setFieldValue(`items[${index}].rate`, rateRow.rate, false);
  //     formik.setFieldValue(`items[${index}].amount`, amount, false);
  //   });
  // }, [unitsRatesQuery.data]);

  // Grand total
  useEffect(() => {
    let total = 0;

    formik.values.items.forEach((item) => {
      if (!item.subItems || item.subItems.length === 0) {
        total +=
          Number(item.amount || 0) +
          Number(item.cgst || 0) +
          Number(item.sgst || 0);
      }

      item.subItems?.forEach((sub) => {
        total +=
          Number(sub.amount || 0) +
          Number(sub.cgst || 0) +
          Number(sub.sgst || 0);
      });
    });

    setTotalCost(total);
    formik.setFieldValue("totalCost", total, false);
  }, [formik.values.items]);

  useEffect(() => {
    const rates = unitsRatesQuery?.data?.data;
    if (!rates || !formik.values.items?.length) return;

    formik.values.items.forEach((item, itemIndex) => {
      /* =======================
       MAIN ITEM (no subItems)
    ======================== */

      if (!item?.subItems || item?.subItems.length === 0) {
        if (!item?.itemId || !item?.unitId || !item?.quantity) return;

        const rateRow = rates.find(
          (r) =>
            r.itemId === item.itemId && r.unitId === item.unitId && !r.subItemId
        );

        if (!rateRow) return;

        const rate = Number(rateRow.rate) || 0;
        const amount = rate * Number(item.quantity);

        if (item.rate !== rate) {
          formik.setFieldValue(`items[${itemIndex}].rate`, rate, false);
        }

        if (item.amount !== amount) {
          formik.setFieldValue(`items[${itemIndex}].amount`, amount, false);
        }
      }

      /* =======================
       SUB ITEMS
    ======================== */
      item.subItems?.forEach((sub, subIndex) => {
        if (!sub?.subItemId || !sub?.unitId || !sub?.quantity) return;

        const rateRow = rates.find(
          (r) =>
            r.itemId === item.itemId &&
            r.subItemId === sub.subItemId &&
            r.unitId === sub.unitId
        );

        if (!rateRow) return;

        const rate = Number(rateRow.rate) || 0;
        const amount = rate * Number(sub.quantity);

        if (sub.rate !== rate) {
          formik.setFieldValue(
            `items[${itemIndex}].subItems[${subIndex}].rate`,
            rate,
            false
          );
        }

        if (sub.amount !== amount) {
          formik.setFieldValue(
            `items[${itemIndex}].subItems[${subIndex}].amount`,
            amount,
            false
          );
        }
      });
    });
  }, [unitsRatesQuery.data, formik.values.items, formik.values.billDate]);

  useEffect(() => {
    if (!formik.values.billDate) return;

    unitsRatesQuery.refetch();
  }, [formik.values.billDate]);

  return null;
};

const CreatePurchaseReceiptNSForm = ({ data, onSuccess }) => {
  const [totalCost, setTotalCost] = useState(0);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("All");
  const [billDate, setBillDate] = useState("");

  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createPurchase = useCreatePurchaseReceiptNS(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["purchase"] });
      navigate(-1);
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Purchase receipt added",
      });
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description:
          error.response.data.detail || "Unable to add purchase receipt.",
      });
    }
  );

  const initialValues = {
    billNo: data?.billNo || "",
    remarks: data?.remarks || "",
    billDate: data?.billDate || "",
    firmId: data?.firmId || "",
    purchaseId: data?.purchaseId,
    receivedFrom: data?.firmName || "",
    issuedTo: data?.issuedTo || "",
    rate: "",
    totalCost: data?.totalCost ?? 0,
    items: data?.items?.map((item) => ({
      //categoryCode: item.categoryCode || "",
      itemName: item.itemName || "",
      itemId: item.itemId || "",
      subItemId: item.subItemId || "",
      unitId: item.unitId || "",
      unit: item.unit || "",
      quantity: item.quantity || 0,
      rate: item.rate || 0,
      amount: item.amount || 0,
      gstPercentage: item.gstPercentage ?? "", // empty string if not set
      cgst: item.cgst ?? 0,
      sgst: item.sgst ?? 0,
      id: item.id,
      // initialize sub-items
      subItems:
        item.subItems?.map((sub) => ({
          subItemId: sub.subItemId || "",
          subItemName: sub.subItemName || "",
          quantity: sub.quantity || 0,
          rate: sub.rate || 0,
          unitId: sub.unitId || "",
          unit: sub.unit || "",
          amount: sub.amount || 0,
          gstPercentage: sub.gstPercentage ?? "",
          cgst: sub.cgst ?? 0,
          sgst: sub.sgst ?? 0,
        })) || [],
    })) || [
      {
        //categoryCode: "",
        itemName: "",
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

  const validationSchema = yup.object({
    receivedFrom: yup.string().required("This field is required"),
    issuedTo: yup.string().required("This field is required"),
    totalCost: yup.number(),
    rate: yup.number(),
    items: yup.array().of(
      yup.object({
        gstPercentage: yup.mixed(),
        cgst: yup.number(),
        sgst: yup.number(),
      })
    ),
  });

  const onSubmit = (values) => {
    const formData = { ...values };
    console.log("form data: ", formData);
    createPurchase.mutate(formData);
  };

  const calculateGst = (amount, gstPercentage) => {
    if (!amount || !gstPercentage) {
      return { cgst: 0, sgst: 0 };
    }

    const gstAmount = (Number(amount) * Number(gstPercentage)) / 100;

    return {
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
    };
  };

  const calculateGrandTotal = (items = []) => {
    let total = 0;

    items.forEach((item) => {
      // main item
      total +=
        Number(item.amount || 0) +
        Number(item.cgst || 0) +
        Number(item.sgst || 0);

      // sub items
      item.subItems?.forEach((sub) => {
        total +=
          Number(sub.amount || 0) +
          Number(sub.cgst || 0) +
          Number(sub.sgst || 0);
      });
    });

    return total;
  };

  return (
    <Formik
      enableReinitialize={!!data}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        useEffect(() => {
  formik.values.items.forEach((item, index) => {
    const rate = Number(item.rate) || 0;
    const qty = Number(item.quantity) || 0;
    const gstPercentage = Number(item.gstPercentage) || 0;

    const amount = rate * qty;

    // update amount
    if (item.amount !== amount) {
      formik.setFieldValue(`items[${index}].amount`, amount, false);
    }

    // update GST when amount OR gstPercentage changes
    if (gstPercentage > 0) {
      const { cgst, sgst } = calculateGst(amount, gstPercentage);

      if (item.cgst !== cgst) {
        formik.setFieldValue(`items[${index}].cgst`, cgst, false);
      }
      if (item.sgst !== sgst) {
        formik.setFieldValue(`items[${index}].sgst`, sgst, false);
      }
    } else {
      // clear GST if % is removed
      if (item.cgst !== 0)
        formik.setFieldValue(`items[${index}].cgst`, 0, false);
      if (item.sgst !== 0)
        formik.setFieldValue(`items[${index}].sgst`, 0, false);
    }
  });
}, [formik.values.items]);

        useEffect(() => {
          const total = calculateGrandTotal(formik.values.items);

          // update UI total
          setTotalCost(total);

          // update Formik value (for backend)
          formik.setFieldValue("totalCost", total, false);
        }, [formik.values.items]);

        useEffect(() => {
          formik.values.items.forEach((item, index) => {
            const rate = Number(item.rate) || 0;
            const qty = Number(item.quantity) || 0;
            const amount = rate * qty;

            // update amount
            if (item.amount !== amount) {
              formik.setFieldValue(`items[${index}].amount`, amount, false);
            }

            // if rate is removed → clear GST
            if (!rate) {
              formik.setFieldValue(`items[${index}].gstPercentage`, "", false);
              formik.setFieldValue(`items[${index}].cgst`, 0, false);
              formik.setFieldValue(`items[${index}].sgst`, 0, false);
            }
          });
        }, [formik.values.items]);

        return (
          <>
            <Stack as={Form} spacing={8}>
              <Badge mb={4} width="fit-content">
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

                <InputField
                  name="receivedFrom"
                  label="Received From"
                  placeholder="Enter value"
                />

                <InputField
                  name="issuedTo"
                  label="Issue To"
                  placeholder="Enter value"
                />
              </SimpleGrid>

              <Text fontWeight="bold" fontSize="md">
                Items
              </Text>
              <Stack spacing={4}>
                {/* {data?.items?.map((item, index) => ( */}
                {formik.values.items.map((item, index) => (
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
                      {index + 1}. {item?.itemName} (Qty: {item?.quantity})
                    </Text>

                    {item?.subItems?.filter(Boolean).length === 0 && (
                      <SimpleGrid columns={3} mt={4} fontSize="sm" gap={4}>
                        <HStack>
                          <InputField
                            name={`items[${index}].rate`}
                            label={`Rate ${item?.unit ? `(${item.unit})` : ""}`}
                            type="number"
                            size="xs"
                            placeholder="Enter rate"
                          />
                          {Number(formik.values.items[index].rate) > 0 && (
                            <SelectField
                              name={`items[${index}].gstPercentage`}
                              label="GST %"
                              size="xs"
                              isRequired={false}
                              onValueChange={(value) => {
                                const amount =
                                  Number(formik.values.items[index].amount) ||
                                  0;

                                if (!value) {
                                  formik.setFieldValue(
                                    `items[${index}].gstPercentage`,
                                    ""
                                  );
                                  formik.setFieldValue(
                                    `items[${index}].cgst`,
                                    0
                                  );
                                  formik.setFieldValue(
                                    `items[${index}].sgst`,
                                    0
                                  );
                                  return;
                                }

                                const { cgst, sgst } = calculateGst(
                                  amount,
                                  value
                                );

                                formik.setFieldValue(
                                  `items[${index}].gstPercentage`,
                                  value
                                );
                                formik.setFieldValue(
                                  `items[${index}].cgst`,
                                  cgst
                                );
                                formik.setFieldValue(
                                  `items[${index}].sgst`,
                                  sgst
                                );
                              }}
                            >
                              <option value="">Select GST %</option>
                              <option value={0}>0%</option>
                              <option value={5}>5%</option>
                              <option value={12}>12%</option>
                              <option value={18}>18%</option>
                              <option value={28}>28%</option>
                            </SelectField>
                          )}
                        </HStack>
                        {formik.values.items[index].gstPercentage && (
                          <HStack>
                            <InputField
                              type="number"
                              name={`items[${index}].cgst`}
                              label="CGST (₹)"
                              size="xs"
                              isRequired={false}
                              //isReadOnly
                            />
                            <InputField
                              type="number"
                              name={`items[${index}].sgst`}
                              label="SGST (₹)"
                              size="xs"
                              isRequired={false}
                              //isReadOnly
                            />
                          </HStack>
                        )}

                        <VStack>
                          <Text fontWeight="bold">
                            Sub total: ₹{item.amount || 0}
                            {item.gstPercentage && (
                              <>
                                <br />
                                GST: ₹
                                {(
                                  Number(item.cgst || 0) +
                                  Number(item.sgst || 0)
                                ).toFixed(2)}
                              </>
                            )}
                            <br />
                            Total: ₹
                            {(
                              Number(item.amount || 0) +
                              Number(item.cgst || 0) +
                              Number(item.sgst || 0)
                            ).toFixed(2)}
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

                            <SimpleGrid columns={3} mt={4} gap={4}>
                              <Text fontWeight="bold">
                                Qty: {sub?.quantity}
                                <br />
                                Rate: ₹{sub?.rate} {sub?.unit}
                              </Text>

                              <HStack>
                                <SelectField
                                  name={`items[${index}].subItems[${i}].gstPercentage`}
                                  label="GST %"
                                  size="xs"
                                  isRequired={false}
                                  onValueChange={(value) => {
                                    const amount =
                                      Number(
                                        formik.values.items[index].subItems[i]
                                          .amount
                                      ) || 0;

                                    if (value === "") {
                                      formik.setFieldValue(
                                        `items[${index}].subItems[${i}].gstPercentage`,
                                        ""
                                      );
                                      formik.setFieldValue(
                                        `items[${index}].subItems[${i}].cgst`,
                                        0
                                      );
                                      formik.setFieldValue(
                                        `items[${index}].subItems[${i}].sgst`,
                                        0
                                      );
                                      return;
                                    }

                                    const { cgst, sgst } = calculateGst(
                                      amount,
                                      value
                                    );

                                    formik.setFieldValue(
                                      `items[${index}].subItems[${i}].gstPercentage`,
                                      value
                                    );
                                    formik.setFieldValue(
                                      `items[${index}].subItems[${i}].cgst`,
                                      cgst
                                    );
                                    formik.setFieldValue(
                                      `items[${index}].subItems[${i}].sgst`,
                                      sgst
                                    );
                                  }}
                                >
                                  <option value="">Select GST %</option>
                                  <option value={0}>0%</option>
                                  <option value={5}>5%</option>
                                  <option value={12}>12%</option>
                                  <option value={18}>18%</option>
                                  <option value={28}>28%</option>
                                </SelectField>
                                <InputField
                                  name={`items[${index}].subItems[${i}].cgst`}
                                  label="CGST (₹)"
                                  type="number"
                                  size="xs"
                                  isRequired={false}
                                />

                                <InputField
                                  name={`items[${index}].subItems[${i}].sgst`}
                                  label="SGST (₹)"
                                  type="number"
                                  size="xs"
                                  isRequired={false}
                                />
                              </HStack>

                              <VStack>
                                <Text fontWeight="bold">
                                  Sub total: ₹{sub?.amount || 0}
                                  {formik.values.items[index].subItems[i]
                                    .gstPercentage && (
                                    <>
                                      <br />
                                      GST: ₹
                                      {(
                                        (Number(
                                          formik.values.items[index].subItems[i]
                                            .cgst
                                        ) || 0) +
                                        (Number(
                                          formik.values.items[index].subItems[i]
                                            .sgst
                                        ) || 0)
                                      ).toFixed(2)}
                                    </>
                                  )}
                                  <br />
                                  Total: ₹
                                  {Number(sub?.amount || 0) +
                                    (Number(sub?.cgst || 0) +
                                      Number(sub?.sgst || 0))}
                                </Text>
                              </VStack>
                            </SimpleGrid>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                ))}
              </Stack>

              <HStack spacing={2} justifyContent="end">
                <FormLabel m={0}>Grand total:</FormLabel>
                <Text fontWeight="bold">₹{totalCost.toFixed(2)}</Text>
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
          </>
        );
      }}
    </Formik>
  );
};

export default CreatePurchaseReceiptNSForm;
