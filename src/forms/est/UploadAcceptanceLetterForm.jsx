import React, { useRef, useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { MdOutlineFileUpload } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetApplicantLetter,
  useUploadAcceptanceLetter,
} from "../../hooks/allotmentsQuery";
import ApplicantLetterModal from "../../pages/est/inbox/ApplicantLetterModal";
import { fileTypeFromBlob } from "file-type";

const UploadAcceptanceLetterForm = ({ isOpen, onClose, rowState }) => {
  // Hooks
  const toast = useToast();
  const fileRef = useRef();

  // Disclosures
  const letterDisclosure = useDisclosure();

  // States
  const [pdfFile, setPdfFile] = useState("");

  // Constants
  const FILE_TYPES = ["application/pdf", "application/x-pdf"];
  const FILE_SIZE = 2 * 1024 * 1024; // 2 MB

  // Queries
  const queryClient = useQueryClient();
  const letterQuery = useGetApplicantLetter(
    (response) => {
      const url = window.URL.createObjectURL(response.data);
      setPdfFile(url);
      letterDisclosure.onOpen();
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
          "Oops! something went wrong. Couldn't download applicant letter.",
      });
      return error;
    }
  );
  const uploadQuery = useUploadAcceptanceLetter(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-pending-quarters-allotment"],
      });
      onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Accptance letter uploaded",
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
          "Oops! something went wrong. Couldn't upload acceptance letter.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    applicationNo: rowState?.appNo,
    code: "A",
    file: "",
  };

  const validationSchema = yup.object({
    applicationNo: yup.string().required("Application number is required"),
    file: yup
      .mixed()
      .required("Acceptance Letter is required")
      .test("fileFormat", "File format not supported", async (value) => {
        const fileType = await fileTypeFromBlob(value);
        return value && FILE_TYPES.includes(fileType.mime);
      })
      .test("fileSize", "File size too large", (value) => {
        return value && value.size <= FILE_SIZE;
      }),
  });

  const onSubmit = (values) => {
    uploadQuery.mutate(values);
  };

  return (
    <>
      {/* Modals */}
      <ApplicantLetterModal
        isOpen={letterDisclosure.isOpen}
        onClose={letterDisclosure.onClose}
        pdfURL={pdfFile}
      />

      {/* Main Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader fontSize="lg" fontWeight="bold">
              Upload Acceptance Letter
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
                    {rowState?.applicantLetterCode !== null && (
                      <Alert status="info" alignItems="start" rounded="md">
                        <AlertIcon />
                        <Text>
                          Note: A letter has already been uploaded. Click{" "}
                          <Link
                            onClick={() =>
                              letterQuery.mutate({ appNo: rowState?.appNo })
                            }
                          >
                            here
                          </Link>{" "}
                          to view it. Uploading a new letter will replace the
                          existing one.
                        </Text>
                      </Alert>
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
                              {(formik.values.file?.size / 1024 / 1024).toFixed(
                                2
                              )}{" "}
                              MB
                            </Text>
                          </SimpleGrid>
                        </Stack>
                      )}
                    </Box>

                    <Text fontSize="small" color="red">
                      {formik.errors.file}
                    </Text>
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
                      isLoading={uploadQuery.isPending}
                      loadingText="Loading"
                    >
                      Upload
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

export default UploadAcceptanceLetterForm;
