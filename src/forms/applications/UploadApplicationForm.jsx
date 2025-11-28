import {
  Box,
  Button,
  Center,
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
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useUploadBookingForm } from "../../hooks/bookingQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { SiTicktick } from "react-icons/si";
import FileUploadField from "../../components/core/formik/FileUploadField";
import { fileTypeFromBlob } from "file-type";

const UploadApplicationForm = ({ rowState, isOpen, onClose }) => {
  // Hooks
  const toast = useToast();

  // Disclosures
  const successDisclosure = useDisclosure();

  // Queries
  const queryClient = useQueryClient();
  const uploadQuery = useUploadBookingForm(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-booking-applications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["fetch-application-summary"],
      });

      onClose();
      successDisclosure.onOpen();
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
          "Oops! something went wrong. Couldn't upload application.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    applicationNo: rowState?.appNo,
    file: "",
  };

  // Constants
  const FILE_TYPES = [
    "application/pdf",
    "application/x-pdf",
    // "image/png",
    // "image/jpg",
    // "image/jpeg",
  ];

  const FILE_SIZE = 1 * 1024 * 1024; // 1 MB

  const validationSchema = yup.object({
    file: yup
      .mixed()
      .required("Application Form is required")
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
      {/* SUCCESS MODAL */}
      <Modal
        isOpen={successDisclosure.isOpen}
        onClose={successDisclosure.onClose}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader fontSize="lg" fontWeight="bold">
              Success
            </ModalHeader>

            <ModalBody as={VStack} spacing={4}>
              <Center bg="green.600" color="white" p={4} rounded="full">
                <Box as={SiTicktick} size={48} />
              </Center>
              <Stack spacing={0}>
                <Text fontWeight="bold" textAlign="center">
                  Applictaion No: {rowState?.appNo}
                </Text>
                <Text color="body" textAlign="center">
                  Successfully submitted quarter application form.
                  <br />
                  You can track the status by logging into the portal.
                </Text>
              </Stack>
            </ModalBody>

            <ModalFooter as={HStack}>
              <Button
                variant="outline"
                onClick={successDisclosure.onClose}
                w="full"
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      {/* MAIN MODAL */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader fontSize="lg" fontWeight="bold">
              Upload Application
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
                      <FileUploadField
                        name="file"
                        label="Application Form"
                        FILE_SIZE={FILE_SIZE}
                        FILE_TYPES={FILE_TYPES}
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
                        variant="brand"
                        w="full"
                        isLoading={uploadQuery.isPending}
                        loadingText="Uploading"
                      >
                        Upload File
                      </Button>
                    </ModalFooter>
                  </Form>
                );
              }}
            </Formik>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default UploadApplicationForm;
