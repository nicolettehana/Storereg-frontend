import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFetchVacantQuartersByType } from "../../hooks/bookingQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import * as yup from "yup";
import SelectField from "../../components/core/formik/SelectField";
import InputField from "../../components/core/formik/InputField";
import { useFetchQuarterTypes } from "../../hooks/quartersQueries";
import {
  useFetchAllotmentRequestByAppNo,
  useGenerateAllotmentOrder,
  useUploadAllotmentOrder,
} from "../../hooks/waitingListQueries";
import FileUploadField from "../../components/core/formik/FileUploadField";
import { fileTypeFromBlob } from "file-type";

const ForwardWaitingListApplicationForm = ({
  actionCode,
  rowState,
  isOpen,
  onClose,
  setPdfURL,
  forwardPdfDisclosure,
  choice,
  setChoice,
}) => {
  // Hooks
  const toast = useToast();

  // Queries
  const queryClient = useQueryClient();
  const allotmentRequestQuery = useFetchAllotmentRequestByAppNo(
    rowState?.appNo
  );
  const quarterTypesQuery = useFetchQuarterTypes();
  const vacantQuarterQuery = useFetchVacantQuartersByType(
    (response) => response,
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description:
          error.response.data.detail ||
          "Oops! something went wrong. Couldn't fetch vacant quarters.",
      });

      return error;
    }
  );
  const generateAllotmentOrderQuery = useGenerateAllotmentOrder(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-waiting-list-applications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-allotment-request-by-appno"],
      });

      onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Allotment order generated",
      });

      const url = window.URL.createObjectURL(response.data);
      setPdfURL(url);
      forwardPdfDisclosure.onOpen();

      return response;
    },
    (error) => {
      console.log(error.response);
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description:
          error.response.data.detail ||
          "Oops! something went wrong. Couldn't generate allotment order.",
      });
      return error;
    }
  );

  const uploadAllotmentOrderQuery = useUploadAllotmentOrder(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-waiting-list-applications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-allotment-request-by-appno"],
      });

      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Allotment order uploaded",
      });

      const url = window.URL.createObjectURL(response.data);
      setPdfURL(url);

      onClose();
      forwardPdfDisclosure.onOpen();

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
          "Oops! something went wrong. Couldn't upload allotment order.",
      });
      return error;
    }
  );

  // Constants
  const FILE_TYPES = ["application/pdf", "application/x-pdf"];
  const FILE_SIZE = 2 * 1024 * 1024; // 2 MB

  // Formik
  const initialValues = {
    appNo: rowState?.appNo,
    actionCode: actionCode,
    letterNo: allotmentRequestQuery?.data?.data?.letterNo || "",
    memoNo: allotmentRequestQuery?.data?.data?.memoNo || "",
    type: allotmentRequestQuery?.data?.data?.quarterType || "",
    quarterNo: allotmentRequestQuery?.data?.data?.quarterNo || "",
    file: "",
  };

  const validationSchema = yup.object({
    appNo: yup.string().required("Application number is required"),
    letterNo: yup.string().required("Letter No. is required"),
    memoNo: yup.string().required("Memo No. is required"),
    type: yup.string().required("Quarter Type is required"),
    quarterNo: yup.string().required("Quarter No. is required"),
    file:
      choice === "generate"
        ? yup.mixed().nullable()
        : yup
            .mixed()
            .required("Allotment Order is required")
            .test("fileFormat", "File format not supported", async (value) => {
              const fileType = await fileTypeFromBlob(value);
              return value && FILE_TYPES.includes(fileType.mime);
            })
            .test("fileSize", "File size too large", (value) => {
              return value && value.size <= FILE_SIZE;
            }),
  });

  const onSubmit = (values) => {
    const formData = { ...values };
    delete formData.type;

    if (choice === "generate") {
      delete formData.file;
      generateAllotmentOrderQuery.mutate(formData);
    } else {
      formData["applicationNo"] = formData.appNo;
      delete formData.appNo;
      uploadAllotmentOrderQuery.mutate(formData);
    }
  };

  return allotmentRequestQuery.isSuccess &&
    allotmentRequestQuery?.data?.data?.letterNo ? (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Generate Allotment Order
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
                  <ModalBody as={Stack}>
                    <Stack
                      bg="onPaper"
                      border="1px"
                      borderColor="border"
                      rounded="md"
                      p={4}
                    >
                      <SimpleGrid columns={2} gap={4}>
                        <Text color="body">Letter Number:</Text>
                        <Text fontWeight="bold">
                          {allotmentRequestQuery?.data?.data?.letterNo}
                        </Text>
                      </SimpleGrid>
                      <SimpleGrid columns={2} gap={4}>
                        <Text color="body">Memo Number:</Text>
                        <Text fontWeight="bold">
                          {allotmentRequestQuery?.data?.data?.memoNo}
                        </Text>
                      </SimpleGrid>
                      <SimpleGrid columns={2} gap={4}>
                        <Text color="body">Quarter Type:</Text>
                        <Text fontWeight="bold">
                          {allotmentRequestQuery?.data?.data?.quarterType}
                        </Text>
                      </SimpleGrid>
                      <SimpleGrid columns={2} gap={4}>
                        <Text color="body">Quarter Number:</Text>
                        <Text fontWeight="bold">
                          {allotmentRequestQuery?.data?.data?.quarterNo}
                        </Text>
                      </SimpleGrid>
                    </Stack>

                    <Box
                      p={4}
                      border="1px"
                      borderColor="border"
                      bg="onPaper"
                      rounded="md"
                    >
                      <RadioGroup onChange={setChoice} value={choice}>
                        <Stack>
                          <Radio value="generate">Get Allotment Order</Radio>
                          <Radio value="upload">
                            Upload Approved Allotment Order
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>

                    {/* Upload */}
                    {choice === "upload" && (
                      <FileUploadField
                        name="file"
                        label="Approved Allotment Order"
                        FILE_SIZE={FILE_SIZE}
                        FILE_TYPES={FILE_TYPES}
                      />
                    )}
                  </ModalBody>

                  <ModalFooter as={HStack}>
                    <Button
                      type="button"
                      variant="outline"
                      w="full"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      variant="brand"
                      w="full"
                      isLoading={
                        generateAllotmentOrderQuery.isPending ||
                        uploadAllotmentOrderQuery.isPending
                      }
                      loadingText="Submitting"
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </Form>
              );
            }}
          </Formik>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  ) : (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Generate Allotment Order
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
                      name="letterNo"
                      label="Letter No."
                      placeholder="Enter letter number"
                    />

                    <InputField
                      name="memoNo"
                      label="Memo No."
                      placeholder="Enter memo number"
                    />

                    <SelectField
                      name="type"
                      label="Quarter Type"
                      placeholder="Select an option"
                      onChange={(e) => {
                        formik.setFieldValue("type", e.target.value);
                        vacantQuarterQuery.mutate({ type: e.target.value });
                      }}
                    >
                      {quarterTypesQuery?.data?.data?.map((row) => (
                        <option key={row?.code} value={row?.code}>
                          {row?.quarterType}
                        </option>
                      ))}
                    </SelectField>

                    {formik.values.type && (
                      <SelectField
                        name="quarterNo"
                        label="Quarter No."
                        placeholder="Select an option"
                      >
                        {vacantQuarterQuery?.data?.data?.map((row) => (
                          <option key={row?.quarterNo} value={row?.quarterNo}>
                            {row?.quarterNo} - {row?.quarterName}
                          </option>
                        ))}
                      </SelectField>
                    )}

                    <Box
                      p={4}
                      border="1px"
                      borderColor="border"
                      bg="onPaper"
                      rounded="md"
                    >
                      <RadioGroup onChange={setChoice} value={choice}>
                        <Stack>
                          <Radio value="generate">
                            Generate Allotment Order
                          </Radio>
                          <Radio value="upload">
                            Upload Approved Allotment Order
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>

                    {/* Upload */}
                    {choice === "upload" && (
                      <FileUploadField
                        name="file"
                        label="Approved Allotment Order"
                        FILE_SIZE={FILE_SIZE}
                        FILE_TYPES={FILE_TYPES}
                      />
                    )}
                  </ModalBody>

                  <ModalFooter as={HStack}>
                    <Button
                      type="button"
                      variant="outline"
                      w="full"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      variant="brand"
                      w="full"
                      isLoading={
                        generateAllotmentOrderQuery.isPending ||
                        uploadAllotmentOrderQuery.isPending
                      }
                      loadingText="Submitting"
                    >
                      Submit
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

export default ForwardWaitingListApplicationForm;
