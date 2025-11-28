import React, { useEffect, useState } from "react";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import * as yup from "yup";
import { Form, Formik } from "formik";
import InputField from "../../components/core/formik/InputField";
import {
  useFetchAvailableQuarters,
  useFetchVacateDocuments,
  useRequestVacate,
  useUploadVacateDocuments,
} from "../../hooks/vacateRequestQueries";
import SelectField from "../../components/core/formik/SelectField";
import FileUploadField from "../../components/core/formik/FileUploadField";
import { useQueryClient } from "@tanstack/react-query";
import { fileTypeFromBlob } from "file-type";

const VacateRequestForm = ({ isOpen, onClose }) => {
  // Hooks
  const toast = useToast();

  // States
  const [formData, setFormData] = useState({});
  const [documentCode, setDocumentCode] = useState([]);

  // Queries
  const queryClient = useQueryClient();
  const availableQuartersQuery = useFetchAvailableQuarters();
  const vacateDocumentQuery = useFetchVacateDocuments(
    (response) => {
      return response;
    },
    (error) => {
      return error;
    }
  );
  const uploadDocumentsQuery = useUploadVacateDocuments(
    (response) => {
      setDocumentCode((prev) => [
        ...prev,
        { documentCode: response.data.documentCode },
      ]);
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
          "Oops! something went wrong. Couldn't upload document.",
      });
      return error;
    }
  );
  const requestVacateQuery = useRequestVacate(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-paginated-vacate-request"],
      });
      setDocumentCode([]);
      onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail,
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
        description:
          error.response.data.detail ||
          "Oops! something went wrong. Couldn't processed your request.",
      });
      return error;
    }
  );

  // Constants
  const FILE_TYPES = ["application/pdf", "application/x-pdf"];
  const FILE_SIZE = 2 * 1024 * 1024; // 2 MB

  // Formik
  const initialValues = {
    quarterNo: "",
    vacateDate: "",
    files: [],
    documentTypes: [],
  };

  const validationSchema = yup.object({
    quarterNo: yup.string().required("Available Quarter is required"),
    vacateDate: yup.date().required("Vacate Date is required"),
    files: yup.array().of(
      yup
        .mixed()
        .required("Vacate Request Letter is required")
        .test("fileFormat", "File format not supported", async (value) => {
          const fileType = await fileTypeFromBlob(value);
          return value && FILE_TYPES.includes(fileType.mime);
        })
        .test("fileSize", "File size too large", (value) => {
          return value && value.size <= FILE_SIZE;
        })
    ),
    documentTypes: yup
      .array()
      .of(yup.string().required("Document Type is required")),
  });

  const onSubmit = (values) => {
    setFormData(values);

    for (let i = 0; i < values.files.length; i++) {
      uploadDocumentsQuery.mutate({
        quarterNo: values.quarterNo,
        file: values.files[i],
        documentType: values.documentTypes[i],
      });
    }
  };

  // Side-Effects
  useEffect(() => {
    if (documentCode.length === 3) {
      requestVacateQuery.mutate({
        quarterNo: formData.quarterNo,
        vacateDate: formData.vacateDate,
        documents: documentCode,
      });
    }
  }, [documentCode]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Vacate Request Form
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
                    <Stack>
                      <SelectField
                        name="quarterNo"
                        label="Available Quarters"
                        placeholder="Select an option"
                        onChange={(e) => {
                          formik.setFieldValue("quarterNo", e.target.value);
                          vacateDocumentQuery.mutate({
                            quarterNo: e.target.value,
                          });
                        }}
                      >
                        {availableQuartersQuery?.data?.data?.map((row) => {
                          return (
                            <option key={row?.quarterNo} value={row?.quarterNo}>
                              {row?.quarterNo} - {row?.quarterName}
                            </option>
                          );
                        })}
                      </SelectField>
                      {availableQuartersQuery?.data?.data?.length === 0 && (
                        <Text fontSize="small" color="red.500">
                          There are no quarters available for vacate requests
                        </Text>
                      )}
                    </Stack>

                    {availableQuartersQuery?.data?.data?.length !== 0 && (
                      <Stack spacing={4}>
                        <InputField
                          type="date"
                          name="vacateDate"
                          label="Vacate Date"
                        />

                        <FileUploadField
                          name="files[0]"
                          label="Vacate Request Letter"
                          FILE_TYPES={FILE_TYPES}
                          FILE_SIZE={FILE_SIZE}
                          onChange={(e) => {
                            formik.setFieldValue("documentTypes[0]", "Letter");
                            formik.setFieldValue("files[0]", e.target.files[0]);
                          }}
                        />

                        <FileUploadField
                          name="files[1]"
                          label="Electricity Bill Payment Receipt"
                          FILE_TYPES={FILE_TYPES}
                          FILE_SIZE={FILE_SIZE}
                          onChange={(e) => {
                            formik.setFieldValue(
                              "documentTypes[1]",
                              "Electricity Bill"
                            );
                            formik.setFieldValue("files[1]", e.target.files[0]);
                          }}
                        />

                        <FileUploadField
                          name="files[2]"
                          label="Payslips"
                          FILE_TYPES={FILE_TYPES}
                          FILE_SIZE={FILE_SIZE}
                          onChange={(e) => {
                            formik.setFieldValue("documentTypes[2]", "Payslip");
                            formik.setFieldValue("files[2]", e.target.files[0]);
                          }}
                        />
                      </Stack>
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
                        uploadDocumentsQuery.isPending &&
                        requestVacateQuery.isPending
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

export default VacateRequestForm;
