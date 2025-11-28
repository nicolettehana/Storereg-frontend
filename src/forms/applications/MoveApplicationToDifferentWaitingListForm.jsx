import { useState } from "react";
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
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  useBookingActions,
  useFetchWaitingList,
} from "../../hooks/bookingQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import * as yup from "yup";
import TextAreaField from "../../components/core/formik/TextAreaField";
import SelectField from "../../components/core/formik/SelectField";
import { useUploadApprovalOrder } from "../../hooks/waitingListQueries";
import InputField from "../../components/core/formik/InputField";
import FileUploadField from "../../components/core/formik/FileUploadField";
import { fileTypeFromBlob } from "file-type";

const MoveApplicationToDifferentWaitingListForm = ({
  rowState,
  actionCode,
  isOpen,
  onClose,
}) => {
  // Hooks
  const toast = useToast();

  // States
  const [formData, setFormData] = useState({});

  // Queries
  const queryClient = useQueryClient();
  // const prevWaitingListQuery = useFetchPreviousWaitingList(rowState?.appNo);
  const waitingListQuery = useFetchWaitingList();
  const actionQuery = useBookingActions(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-booking-applications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["fetch-approved-waiting-list-by-list-type"],
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
          "Oops! something went wrong. Couldn't move application to different waiting list.",
      });
      return error;
    }
  );
  const uploadApprovalOrderQuery = useUploadApprovalOrder(
    (response) => {
      const data = {
        appNo: formData.appNo,
        actionCode: formData.actionCode,
        waitingList: formData.waitingList,
        // wlSlNo: formData.wlSlNo,
        docCode: response.data.docCode,
        letterNo: formData.letterNo,
        remarks: formData.remarks,
      };

      actionQuery.mutate(data);
      return response;
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description: error.response.data.detail,
      });
      return error;
    }
  );

  // Formik
  // Constants
  const FILE_TYPES = [
    "application/pdf",
    "application/x-pdf",
    // "image/png",
    // "image/jpg",
    // "image/jpeg",
  ];

  const FILE_SIZE = 1 * 1024 * 1024; // 1 MB

  const initialValues = {
    appNo: rowState?.appNo,
    actionCode,
    waitingList: "",
    // wlSlNo: "",
    remarks: "",
    letterNo: "",
    docCode: "",
    file: "",
  };

  const validationSchema = yup.object({
    appNo: yup.string().required("Application number is required"),
    actionCode: yup
      .number()
      .typeError("Action Code should be a numeric character")
      .required("Action Code is required"),
    waitingList: yup.number().required("Please select an option"),
    // wlSlNo: yup
    //   .number()
    //   .typeError("Waiting List Sl. No. must be a positive integer")
    //   .required("Waiting List Sl. No. is required"),
    letterNo: yup.string().nullable(),
    docCode: yup.string().nullable(),
    remarks: yup.string().nullable(),
    file: yup
      .mixed()
      .nullable()
      .test("fileFormat", "File format not supported", async (value) => {
        if (!value) return true;
        const fileType = await fileTypeFromBlob(value);
        return value && FILE_TYPES.includes(fileType.mime);
      })
      .test("fileSize", "File size too large", (value) => {
        if (!value) return true;
        return value && value.size <= FILE_SIZE;
      }),
  });

  const onSubmit = (values) => {
    setFormData(values);
    // If there's a file then call upload endpoint
    if (values.file) {
      uploadApprovalOrderQuery.mutate({
        applicationNo: values.appNo,
        file: values.file,
      });
    } else {
      // call action endpoint
      const data = {
        appNo: values.appNo,
        actionCode: values.actionCode,
        waitingList: values.waitingList,
        // wlSlNo: values.wlSlNo,
        docCode: values.docCode,
        letterNo: values.letterNo,
        remarks: values.remarks,
      };

      actionQuery.mutate(data);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
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
                    {/* <Stack
                      border="1px"
                      borderColor="border"
                      bg="onPaper"
                      rounded="md"
                      p={4}
                    >
                      <Stack spacing={0}>
                        <Text color="body">Previous Waiting List:</Text>
                        <Text fontWeight="bold">
                          {
                            waitingListQuery?.data?.data?.find(
                              (row) =>
                                row?.code ===
                                prevWaitingListQuery?.data?.data?.prevWl
                            )?.list
                          }
                        </Text>
                      </Stack>

                      <HStack>
                        <Text color="body">Previous Sl. No:</Text>
                        <Text fontWeight="bold">
                          {prevWaitingListQuery?.data?.data?.prevWlNo}
                        </Text>
                      </HStack>

                      <Stack spacing={0}>
                        <Text color="body">Previous Waiting List Date:</Text>
                        <Text fontWeight="bold">
                          {dayjs(
                            prevWaitingListQuery?.data?.data?.prevWlDate
                          ).format("DD MMM YYYY")}
                        </Text>
                      </Stack>
                    </Stack> */}

                    <SelectField
                      name="waitingList"
                      label="Select Waiting List"
                      placeholder="Select an option"
                    >
                      {waitingListQuery?.data?.data?.map((row) => (
                        <option key={row?.code} value={row?.code}>
                          {row?.list}
                        </option>
                      ))}
                    </SelectField>

                    {/* <InputField
                      name="wlSlNo"
                      label="Waiting List Sl. No."
                      placeholder="Enter a waiting list sl. no."
                    /> */}

                    <InputField
                      name="letterNo"
                      label="Letter No."
                      placeholder="Enter letter no."
                      isRequired={false}
                    />

                    <TextAreaField
                      name="remarks"
                      label="Remarks"
                      placeholder="Type here..."
                      isRequired={false}
                    />

                    <FileUploadField
                      name="file"
                      label="Approval Order"
                      FILE_SIZE={FILE_SIZE}
                      FILE_TYPES={FILE_TYPES}
                      isRequired={false}
                    />
                  </ModalBody>

                  <ModalFooter as={HStack}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      w={{ base: "fit-content", sm: "full" }}
                    >
                      Go Back
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="red"
                      w={{ base: "fit-content", sm: "full" }}
                      isLoading={actionQuery.isPending}
                      loadingText="Rejecting"
                    >
                      Yes, Move Application
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

export default MoveApplicationToDifferentWaitingListForm;
