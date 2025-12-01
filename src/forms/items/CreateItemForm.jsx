import { Form, Formik, FieldArray } from "formik";
import * as yup from "yup";
import {
  Button,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  useToast,
  Checkbox,
  Box,
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import { useCreateItem } from "../../hooks/itemQueries";
import {
  useFetchCategories,
  useFetchYearRange,
} from "../../hooks/masterQueries";
import SelectField from "../../components/core/formik/SelectField";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const CreateItemForm = () => {
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();
  const categoryQuery = useFetchCategories();
  const yearRangeQuery = useFetchYearRange();

  const createItem = useCreateItem(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      navigate("/sad/items");
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Item added",
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
        description: error.response.data.detail || "Unable to add new item.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    itemName: "",
    category: "",
    hasSubItems: false,
    subItems: [],
    yearRange: "",
  };

  const validationSchema = yup.object({
    itemName: yup.string().required("Item name is required"),
    category: yup.string().required("Category is required"),
    yearRange: yup.number().required("Year Range is required"),

    hasSubItems: yup.boolean(), // optional validation
  });

  const onSubmit = (values) => {
    //const formData = { ...values };
    const formData = {
      ...values,
      subItems: values.subItems.map((item) => item.name), // <-- convert to List<String>
    };

    createItem.mutate(formData);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Stack as={Form} spacing={8}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <SelectField
                name="yearRange"
                label="Year Range"
                placeholder="Select year range"
              >
                {yearRangeQuery?.data?.data?.map((row) => (
                  <option key={row?.id} value={row?.id}>
                    {row?.startYear}-{row?.endYear}
                  </option>
                ))}
              </SelectField>
              <SelectField
                name="category"
                label="Item Category"
                placeholder="Select category"
              >
                {categoryQuery?.data?.data?.map((row) => (
                  <option key={row?.code} value={row?.code}>
                    {row?.name}
                  </option>
                ))}
              </SelectField>
              <SelectField
                name="category"
                label="Item"
                placeholder="Select category"
              >
                {categoryQuery?.data?.data?.map((row) => (
                  <option key={row?.code} value={row?.code}>
                    {row?.name}
                  </option>
                ))}
              </SelectField>
              <SelectField
                name="category"
                label="Sub-Item"
                placeholder="Select category"
              >
                {categoryQuery?.data?.data?.map((row) => (
                  <option key={row?.code} value={row?.code}>
                    {row?.name}
                  </option>
                ))}
              </SelectField>
              <SelectField
                name="category"
                label="Unit"
                placeholder="Select category"
              >
                {categoryQuery?.data?.data?.map((row) => (
                  <option key={row?.code} value={row?.code}>
                    {row?.name}
                  </option>
                ))}
              </SelectField>
              <InputField
                name="itemName"
                label="Rate"
                placeholder="Enter the item name"
                onChange={(e) => {
                  const itemName = e.target.value;

                  formik.setFieldValue("itemName", itemName);
                }}
              />
            </SimpleGrid>

            <HStack justifyContent="end">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button
                type="submit"
                variant="brand"
                isLoading={createItem.isPending}
                loadingText="Saving"
              >
                Add Item
              </Button>
            </HStack>
          </Stack>
        );
      }}
    </Formik>
  );
};

export default CreateItemForm;
