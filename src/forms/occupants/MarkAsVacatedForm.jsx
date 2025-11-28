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
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import dayjs from "dayjs";
import InputField from "../../components/core/formik/InputField";
import { useQueryClient } from "@tanstack/react-query";
import { useMarkAsVacated } from "../../hooks/occpantsQueries";
import FileUploadField from "../../components/core/formik/FileUploadField";
import { useUploadVacateDocuments } from "../../hooks/vacateRequestQueries";
import { fileTypeFromBlob } from "file-type";

const MarkAsVacatedForm = ({ isOpen, onClose, rowState }) => {
  // Hooks
  const toast = useToast();

  // States
  const [fileCounter, setFileCounter] = useState(0);
  const [formData, setFormData] = useState({});
  const [documentCode, setDocumentCode] = useState([]);

  // Queries
  const queryClient = useQueryClient();
  const vacateQuery = useMarkAsVacated(
    (response) => {
      queryClient.invalidateQueries(["fetch-quarters-by-type"]);
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Application marked as vacated.",
      });
      onClose();
      return response;
    },
    (error) => {
      setDocumentCode([]);
      setFormData({});
      setFileCounter(0);
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description:
          error.response.data.detail ||
          "Oops! something went wrong. Couldn't mark application as vacated.",
      });
      return error;
    }
  );
  const uploadDocumentsQuery = useUploadVacateDocuments(
    (response) => {
      // fileCounter to check if all files have been uploaded
      setFileCounter((prev) => prev + 1);

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

  // Formik
  // Constants
  const FILE_TYPES = ["application/pdf", "application/x-pdf"];
  const FILE_SIZE = 2 * 1024 * 1024; // 2 MB

  const initialValues = {
    quarterNo: rowState?.quarterNo,
    appNo: rowState?.appNo,
    vacateDate: "",
    files: [],
    documentTypes: [],
  };

  const validationSchema = yup.object({
    quarterNo: yup.string().required("Quarter No. is required"),
    appNo: yup.string().required("App No. is required"),
    vacateDate: yup
      .date()
      .max(dayjs().format("YYYY-MM-DD"), "Invalid vacate date")
      .required("Vacate Date is required"),
    files: yup.array().of(
      yup
        .mixed()
        .nullable()
        .test("fileFormat", "File format not supported", async (value) => {
          if (value === undefined) return true;
          const fileType = await fileTypeFromBlob(value);
          return value && FILE_TYPES.includes(fileType.mime);
        })
        .test("fileSize", "File size too large", (value) => {
          if (value === undefined) return true;
          return value && value.size <= FILE_SIZE;
        })
    ),
    documentTypes: yup.array().of(yup.string().nullable()),
  });

  const onSubmit = (values) => {
    const data = { ...values };
    data.files = [];
    data.documentTypes = [];

    values.files.forEach((file) => {
      if (file) data.files.push(file);
    });

    values.documentTypes.forEach((documentType) => {
      if (documentType) data.documentTypes.push(documentType);
    });

    setFormData(data);

    if (data.files.length) {
      for (let i = 0; i < data.files.length; i++) {
        uploadDocumentsQuery.mutate({
          quarterNo: data.quarterNo,
          file: data.files[i],
          documentType: data.documentTypes[i],
        });
      }
    } else {
      vacateQuery.mutate({
        appNo: values.appNo,
        quarterNo: values.quarterNo,
        vacateDate: values.vacateDate,
        documents: documentCode,
      });
    }
  };

  useEffect(() => {
    // if fileCounter equals the lenght of the files
    // execute vacate query
    if (fileCounter === formData?.files?.length) {
      vacateQuery.mutate({
        appNo: formData.appNo,
        quarterNo: formData.quarterNo,
        vacateDate: formData.vacateDate,
        documents: documentCode,
      });
    }
  }, [fileCounter]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Mark As Vacated
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
                      type="date"
                      name="vacateDate"
                      label="Vacate Date"
                      max={dayjs().format("YYYY-MM-DD")}
                    />

                    <FileUploadField
                      name="files[0]"
                      label="Vacate Request Letter"
                      isRequired={false}
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
                      isRequired={false}
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
                      isRequired={false}
                      FILE_TYPES={FILE_TYPES}
                      FILE_SIZE={FILE_SIZE}
                      onChange={(e) => {
                        formik.setFieldValue("documentTypes[2]", "Payslip");
                        formik.setFieldValue("files[2]", e.target.files[0]);
                      }}
                    />
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
                      colorScheme="red"
                      w="full"
                      isLoading={
                        vacateQuery.isPending || uploadDocumentsQuery.isPending
                      }
                      loadingText="Marking"
                    >
                      Mark
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

export default MarkAsVacatedForm;
