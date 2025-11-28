import React, { useRef, useState } from "react";
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
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  useBookingActions,
  useFetchVacantQuartersByType,
} from "../../hooks/bookingQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import * as yup from "yup";
import TextAreaField from "../../components/core/formik/TextAreaField";
import { useNavigate } from "react-router-dom";
import {
  useFetchAllotmentRequestByAppNo,
  useGenerateAllotmentOrder,
  useUploadFinalAllotmentOrder,
} from "../../hooks/waitingListQueries";
import PDFViewer from "../../components/core/PDFViewer";
import { useFetchQuarterTypes } from "../../hooks/quartersQueries";
import InputField from "../../components/core/formik/InputField";
import SelectField from "../../components/core/formik/SelectField";
import { MdOutlineFileUpload } from "react-icons/md";
import { downloadPdfUrl } from "../../components/utils/blobHelper";

const ApplicationFinalApprovalForm = ({
  rowState,
  actionCode,
  isOpen,
  onClose,
}) => {
  // Hooks
  const toast = useToast();
  const fileRef = useRef();

  // Disclosures
  const confirmDisclosure = useDisclosure();

  // States
  const [pdfURL, setPdfURL] = useState("");
  const [choice, setChoice] = useState("esign");

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
  const generateQuery = useGenerateAllotmentOrder(
    (response) => {
      onClose();
      setPdfURL(window.URL.createObjectURL(response.data));
      confirmDisclosure.onOpen();
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
          "Oops! something went wrong. Couldn't generate allotment order.",
      });
      return error;
    }
  );
  const uploadAllotmentOrderQuery = useUploadFinalAllotmentOrder(
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
        description: response.data.detail || "Final allotment order uploaded",
      });

      const url = window.URL.createObjectURL(response.data);
      setPdfURL(url);
      confirmDisclosure.onOpen();

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
          "Oops! something went wrong. Couldn't upload final allotment order.",
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
    letterNo: allotmentRequestQuery?.data?.data?.letterNo || "",
    memoNo: allotmentRequestQuery?.data?.data?.memoNo || "",
    type: allotmentRequestQuery?.data?.data?.quarterType || "",
    quarterNo: allotmentRequestQuery?.data?.data?.quarterNo || "",
    file: "",
  };

  const validationSchema = yup.object({
    appNo: yup.string().required("Application number is required"),
    letterNo:
      choice === "esign"
        ? yup.string().nullable()
        : yup.string().required("Letter No. is required"),
    memoNo:
      choice === "esign"
        ? yup.string().nullable()
        : yup.string().required("Memo No. is required"),
    type:
      choice === "esign"
        ? yup.string().nullable()
        : yup.string().required("Quarter Type is required"),
    quarterNo:
      choice === "esign"
        ? yup.string().nullable()
        : yup.string().required("Quarter No. is required"),
    file:
      choice === "esign"
        ? yup.mixed().nullable()
        : yup
            .mixed()
            .required("Allotment Order is required")
            .test("fileFormat", "File format not supported", (value) => {
              return value && FILE_TYPES.includes(value.type);
            })
            .test("fileSize", "File size too large", (value) => {
              return value && value.size <= FILE_SIZE;
            }),
  });

  const onSubmit = (values) => {
    const formData = { ...values };

    if (choice === "esign") {
      generateQuery.mutate({ appNo: rowState?.appNo });
    } else {
      formData["applicationNo"] = formData.appNo;
      delete formData.appNo;
      delete formData.type;
      uploadAllotmentOrderQuery.mutate(formData);
    }
  };

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmationForm
        isOpen={confirmDisclosure.isOpen}
        onClose={confirmDisclosure.onClose}
        rowState={rowState}
        actionCode={actionCode}
        pdfURL={pdfURL}
      />

      {/* Main Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader fontSize="lg" fontWeight="bold">
              Final Approval
            </ModalHeader>

            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(formik) => (
                <Form>
                  <ModalBody as={Stack} spacing={4}>
                    <Box
                      p={4}
                      border="1px"
                      borderColor="border"
                      bg="onPaper"
                      rounded="md"
                    >
                      <RadioGroup onChange={setChoice} value={choice}>
                        <Stack>
                          <Radio value="esign">Proceed with E-Sign</Radio>
                          <Radio value="upload">
                            Upload manually signed order
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>

                    {choice === "upload" && (
                      <>
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
                              <option
                                key={row?.quarterNo}
                                value={row?.quarterNo}
                              >
                                {row?.quarterNo}
                              </option>
                            ))}
                          </SelectField>
                        )}

                        <Box
                          as="input"
                          type="file"
                          accept={FILE_TYPES}
                          ref={fileRef}
                          display="none"
                          onChange={(e) =>
                            formik.setFieldValue("file", e.target.files[0])
                          }
                        />

                        <Box
                          rounded="md"
                          p={4}
                          border="1px"
                          borderColor="border"
                          borderStyle="dashed"
                          bg="onPaper"
                          cursor="pointer"
                          onClick={() => fileRef.current.click()}
                        >
                          {formik.values.file === undefined ||
                          formik.values.file === "" ? (
                            <VStack>
                              <MdOutlineFileUpload size={32} />
                              <VStack>
                                <Text>Click here to browse file</Text>
                                <VStack spacing={0}>
                                  <Text fontSize="small" color="body">
                                    Max file size:{" "}
                                    {(FILE_SIZE / 1024 / 1024).toFixed(2)} MB
                                  </Text>
                                  <Text fontSize="small" color="body">
                                    Supported file formats:
                                  </Text>
                                  <Text fontSize="small" color="body">
                                    {FILE_TYPES.join(", ")}
                                  </Text>
                                </VStack>
                              </VStack>
                            </VStack>
                          ) : (
                            <Stack>
                              <SimpleGrid
                                columns={{ base: 1, sm: 2 }}
                                gap={{ base: 0, sm: 2 }}
                              >
                                <Text color="body" textAlign="start">
                                  File name:
                                </Text>
                                <Text>{formik.values.file?.name}</Text>
                              </SimpleGrid>
                              <SimpleGrid
                                columns={{ base: 1, sm: 2 }}
                                gap={{ base: 0, sm: 2 }}
                              >
                                <Text color="body" textAlign="start">
                                  File size:
                                </Text>
                                <Text>
                                  {(
                                    formik.values.file?.size /
                                    1024 /
                                    1024
                                  ).toFixed(2)}{" "}
                                  MB
                                </Text>
                              </SimpleGrid>
                              <SimpleGrid
                                columns={{ base: 1, sm: 2 }}
                                gap={{ base: 0, sm: 2 }}
                              >
                                <Text color="body" textAlign="start">
                                  File type:
                                </Text>
                                <Text>{formik.values.file?.type}</Text>
                              </SimpleGrid>
                            </Stack>
                          )}
                        </Box>

                        <Text fontSize="small" color="red">
                          {formik.errors.file}
                        </Text>
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
                    <Button
                      type="submit"
                      variant="brand"
                      w="full"
                      isLoading={
                        generateQuery.isPending ||
                        uploadAllotmentOrderQuery.isPending
                      }
                      loadingText="Loading"
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

const ConfirmationForm = ({
  isOpen,
  onClose,
  rowState,
  actionCode,
  pdfURL,
}) => {
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();
  const actionQuery = useBookingActions(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-booking-applications"],
      });

      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail,
      });

      onClose();
      navigate("/ch/dashboard");
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
          "Oops! something went wrong. Couldn't approve application.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    appNo: rowState?.appNo,
    remarks: "",
    actionCode,
  };

  const validationSchema = yup.object({
    appNo: yup.string().required("Application number is required"),
    remarks: yup.string().required("Remarks is required"),
    actionCode: yup
      .number()
      .typeError("Action Code should be a numeric character")
      .required("Action Code is required"),
  });

  const onSubmit = (values) => {
    actionQuery.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay>
        <ModalContent as={VStack}>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Confirmation
          </ModalHeader>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <Form>
                  <ModalBody as={Stack} spacing={4}>
                    <PDFViewer pdfFile={pdfURL} />

                    <Text>
                      Are you sure you want to approve booking application
                      number <strong>{rowState?.appNo}</strong>?
                    </Text>

                    <TextAreaField
                      name="remarks"
                      label="Remarks"
                      placeholder="Type here..."
                    />
                  </ModalBody>

                  <ModalFooter as={HStack}>
                    <Button type="button" variant="outline" onClick={onClose}>
                      Go Back
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        downloadPdfUrl(pdfURL, `${rowState?.appNo}_Order`)
                      }
                    >
                      Download Order
                    </Button>
                    <Button
                      type="submit"
                      variant="brand"
                      isLoading={actionQuery.isPending}
                      loadingText="Approving"
                    >
                      Yes, Approve
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

export default ApplicationFinalApprovalForm;
