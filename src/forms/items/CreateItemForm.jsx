// import { Form, Formik, FieldArray } from "formik";
// import * as yup from "yup";
// import {
//   Button,
//   Divider,
//   Heading,
//   HStack,
//   SimpleGrid,
//   Stack,
//   useToast,
//   Checkbox,
//   Box,
// } from "@chakra-ui/react";
// import InputField from "../../components/core/formik/InputField";
// import { useCreateItem } from "../../hooks/itemQueries";
// import { useFetchCategories } from "../../hooks/masterQueries";
// import SelectField from "../../components/core/formik/SelectField";
// import SelectFieldSearchable from "../../components/core/formik/SelectFieldSearchable";
// import { useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { useFetchUnits } from "../../hooks/masterQueries";

// const CreateItemForm = ({ onSuccess }) => {
//   // Hooks
//   const toast = useToast();
//   const navigate = useNavigate();

//   // Queries
//   const queryClient = useQueryClient();
//   const categoryQuery = useFetchCategories();
//   const unitQuery = useFetchUnits();

//   const createItem = useCreateItem(
//     (response) => {
//       queryClient.invalidateQueries({ queryKey: ["items"] });
//       navigate("/sad/items");
//       toast({
//         isClosable: true,
//         duration: 3000,
//         position: "top-right",
//         status: "success",
//         title: "Success",
//         description: response.data.detail || "Item added",
//       });

//       // 👉 close modal if provided, otherwise navigate
//       if (onSuccess) {
//         onSuccess();
//       } else {
//         navigate("/sad/items");
//       }
//       return response;
//     },
//     (error) => {
//       toast({
//         isClosable: true,
//         duration: 3000,
//         position: "top-right",
//         status: "error",
//         title: "Error",
//         description: error.response.data.detail || "Unable to add new item.",
//       });
//       return error;
//     },
//   );

//   // Formik
//   const initialValues = {
//     itemName: "",
//     category: "",
//     hasSubItems: false,
//     unitId: "",
//     subItems: [
//       {
//         name: "",
//         unitId: "",
//       },
//     ],
//   };

//   const validationSchema = yup.object({
//     itemName: yup.string().required("Item name is required"),
//     category: yup.string().required("Category is required"),
//     unitId: yup.number(),
//     // only validate sub-items if hasSubItems is true
//     // subItems: yup.array().when("hasSubItems", (hasSubItems, schema) => {
//     //   return hasSubItems
//     //     ? schema.of(
//     //         yup.object({
//     //           name: yup.string().required("Sub-item name is required"),
//     //         })
//     //       )
//     //     : schema.of(yup.object());
//     // }),

//     hasSubItems: yup.boolean(), // optional validation
//   });

//   const onSubmit = (values) => {
//     //const formData = { ...values };
//     const formData = {
//       ...values,
//       subItems: values.subItems.map((item) => item.name), // <-- convert to List<String>
//     };
//     console.log("values: ", formData);
//     //createItem.mutate(formData);
//   };

//   return (
//     <Formik
//       enableReinitialize={true}
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={onSubmit}
//     >
//       {(formik) => {
//         return (
//           <Stack as={Form} spacing={8}>
//             <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
//               <SelectField
//                 name="category"
//                 label="Item Category"
//                 placeholder="Select category"
//               >
//                 {categoryQuery?.data?.data?.map(
//                   (row) =>
//                     row?.stockType === "S" && (
//                       <option key={row?.code} value={row?.code}>
//                         {row?.name}
//                       </option>
//                     ),
//                 )}
//               </SelectField>
//               <InputField
//                 name="itemName"
//                 label="Item Name"
//                 placeholder="Enter the item name"
//                 onChange={(e) => {
//                   const itemName = e.target.value;

//                   formik.setFieldValue("itemName", itemName);
//                 }}
//               />
//             </SimpleGrid>

//             <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
//               {/* Checkbox group */}

//               {/* <Checkbox
//                 isChecked={formik.values.hasSubItems}
//                 onChange={(e) => {
//                   const checked = e.target.checked;
//                   formik.setFieldValue("hasSubItems", checked);

//                   if (checked && formik.values.subItems.length === 0) {
//                     formik.setFieldValue("subItems", [{ name: "" }]); // <-- create first row
//                   }

//                   if (!checked) {
//                     formik.setFieldValue("subItems", []); // <-- clear when unchecked
//                   }
//                 }}
//               >
//                 Does this item have sub-items?
//               </Checkbox> */}
//               <SelectField
//                 name="hasSubItems"
//                 label="Does this item have sub-items?"
//                 value={formik.values.hasSubItems ? "yes" : "no"}
//                 onValueChange={(value, form) => {
//                   const checked = value === "yes";
//                   console.log("checked: ", checked);

//                   form.setFieldValue("hasSubItems", checked);

//                   if (checked && form.values.subItems.length === 0) {
//                     form.setFieldValue("subItems", [{ name: "" }]);
//                   }

//                   if (!checked) {
//                     form.setFieldValue("subItems", []);
//                   }
//                 }}
//               >
//                 <option value="yes">Yes</option>
//                 <option value="no">No</option>
//               </SelectField>

//               {!formik.values.hasSubItems && (
//                 <SelectFieldSearchable
//                   name="unitId"
//                   label="Base Unit/Issue Unit"
//                   placeholder="Search unit"
//                   options={
//                     unitQuery?.data?.data?.map((row) => ({
//                       value: row.id,
//                       label: row.unit,
//                     })) || []
//                   }
//                 />
//               )}
//             </SimpleGrid>

//             {formik.values.hasSubItems && (
//               <FieldArray name="subItems">
//                 {(arrayHelpers) => (
//                   <>
//                     <SimpleGrid columns={{ base: 1, md: 1 }} gap={2}>
//                       {formik.values.subItems.map((subItem, index) => (
//                         <Box
//                           key={index}
//                           display="flex"
//                           alignItems="center"
//                           gap={2}
//                         >
//                           <HStack width="100%" align="flex-end">
//                             <Box flex="0 0 50%">
//                               <InputField
//                                 name={`subItems.${index}.name`}
//                                 value={subItem.name}
//                                 placeholder="Sub-item Name"
//                                 label=" Sub-item Name"
//                                 onChange={(e) =>
//                                   formik.setFieldValue(
//                                     `subItems.${index}.name`,
//                                     e.target.value,
//                                   )
//                                 }
//                               />
//                             </Box>

//                             <Box flex="0 0 30%">
//                               <SelectFieldSearchable
//                                 name={`subItems.${index}.unitId`}
//                                 value={subItem.unitId}
//                                 label="Base Unit/Issue Unit"
//                                 placeholder="Select Unit"
//                                 options={
//                                   unitQuery?.data?.data?.map((row) => ({
//                                     value: row.id,
//                                     label: row.unit,
//                                   })) || []
//                                 }
//                                 onChange={(value) =>
//                                   formik.setFieldValue(
//                                     `subItems.${index}.unitId`,
//                                     value,
//                                   )
//                                 }
//                               />
//                             </Box>

//                             <Box flex="0 0 20%">
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={() => arrayHelpers.remove(index)}
//                               >
//                                 Remove
//                               </Button>
//                             </Box>
//                           </HStack>
//                         </Box>
//                       ))}
//                     </SimpleGrid>
//                     <SimpleGrid columns={{ base: 1, md: 6 }} gap={4}>
//                       <Button
//                         type="button"
//                         variant="brand"
//                         minW="fit-content"
//                         mt={2}
//                         onClick={() =>
//                           arrayHelpers.push({ name: "", unitId: "" })
//                         }
//                       >
//                         + Add More Sub-Item
//                       </Button>
//                     </SimpleGrid>
//                   </>
//                 )}
//               </FieldArray>
//             )}

//             <HStack justifyContent="end">
//               {/* <Button variant="outline" onClick={() => navigate(-1)}>
//                 Back
//               </Button> */}
//               <Button
//                 type="submit"
//                 variant="brand"
//                 isLoading={createItem.isPending}
//                 loadingText="Saving"
//               >
//                 Add Item
//               </Button>
//             </HStack>
//           </Stack>
//         );
//       }}
//     </Formik>
//   );
// };

// export default CreateItemForm;

import { Form, Formik, FieldArray } from "formik";
import * as yup from "yup";
import {
  Button,
  SimpleGrid,
  Stack,
  useToast,
  HStack,
  Box,
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import { useCreateItem } from "../../hooks/itemQueries";
import { useFetchCategories, useFetchUnits } from "../../hooks/masterQueries";
import SelectField from "../../components/core/formik/SelectField";
import SelectFieldSearchable from "../../components/core/formik/SelectFieldSearchable";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const CreateItemForm = ({ onSuccess }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const categoryQuery = useFetchCategories();
  const unitQuery = useFetchUnits();

  const createItem = useCreateItem(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast({
        status: "success",
        title: "Success",
        description: response.data.detail || "Item added",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      if (onSuccess) onSuccess();
      else navigate("/sad/items");
    },
    (error) => {
      toast({
        status: "error",
        title: "Error",
        description: error.response?.data?.detail || "Unable to add item",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    },
  );

  const initialValues = {
    itemName: "",
    category: "",
    hasSubItems: false,
    unitId: "",
    subItems: [{ name: "", unitId: "" }],
  };

  const validationSchema = yup.object({
    itemName: yup.string().required("Item name is required"),
    category: yup.string().required("Category is required"),
    unitId: yup.number().nullable(),
    hasSubItems: yup.boolean(),
  });

  const onSubmit = (values) => {
    const formData = {
      ...values,
      subItems: values.subItems.map((item) => ({
        name: item.name,
        unitId: item.unitId,
      })),
    };
    console.log("Submitting:", formData);
    createItem.mutate(formData);
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
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <SelectField
              name="category"
              label="Item Category"
              placeholder="Select category"
            >
              {categoryQuery?.data?.data
                ?.filter((row) => row.stockType === "S")
                .map((row) => (
                  <option key={row.code} value={row.code}>
                    {row.name}
                  </option>
                ))}
            </SelectField>

            <InputField
              name="itemName"
              label="Item Name"
              placeholder="Enter item name"
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <SelectField
              name="hasSubItems"
              label="Does this item have sub-items?"
            >
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </SelectField>

            {!formik.values.hasSubItems && (
              <SelectFieldSearchable
                name="unitId"
                label="Base Unit/Issue Unit"
                placeholder="Search unit"
                options={
                  unitQuery?.data?.data?.map((row) => ({
                    value: row.id,
                    label: row.unit,
                  })) || []
                }
              />
            )}
          </SimpleGrid>

          {formik.values.hasSubItems && (
            <FieldArray name="subItems">
              {(arrayHelpers) => (
                <>
                  {formik.values.subItems.map((subItem, index) => (
                    <HStack key={index} spacing={2} align="flex-end">
                      <Box flex="1">
                        <InputField
                          name={`subItems.${index}.name`}
                          label="Sub-item Name"
                          placeholder="Sub-item Name"
                        />
                      </Box>

                      <Box flex="1">
                        <SelectFieldSearchable
                          name={`subItems.${index}.unitId`}
                          label="Base Unit/Issue Unit"
                          placeholder="Select Unit"
                          options={
                            unitQuery?.data?.data?.map((row) => ({
                              value: row.id,
                              label: row.unit,
                            })) || []
                          }
                        />
                      </Box>

                      <Button
                        type="button"
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        Remove
                      </Button>
                    </HStack>
                  ))}

                  <Button
                    mt={2}
                    type="button"
                    onClick={() => arrayHelpers.push({ name: "", unitId: "" })}
                  >
                    + Add Sub-item
                  </Button>
                </>
              )}
            </FieldArray>
          )}

          <HStack justify="end">
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
      )}
    </Formik>
  );
};

export default CreateItemForm;
