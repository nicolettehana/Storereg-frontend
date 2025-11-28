import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  HStack,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import * as yup from "yup";
import InputField from "../../components/core/formik/InputField";
import TextAreaField from "../../components/core/formik/TextAreaField";
import FileUploadField from "../../components/core/formik/FileUploadField";
import { useUploadApprovalOrder } from "../../hooks/waitingListQueries";
import { useBookingActions } from "../../hooks/bookingQueries";
import { useState } from "react";
import { fileTypeFromBlob } from "file-type";

const MoveToApprovedListForm = ({ actionCode, rowState, isOpen, onClose }) => {
  // Hooks
  const toast = useToast();
  // States
  const [formData, setFormData] = useState({});

  // Queries
  const queryClient = useQueryClient();
  const actionQuery = useBookingActions(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-waiting-list-applications"],
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
        description: error.response.data.detail,
      });
      return error;
    }
  );
  const uploadApprovalOrderQuery = useUploadApprovalOrder(
    (response) => {
      const data = {
        docCode: response.data.docCode,
        appNo: formData.appNo,
        letterNo: formData.letterNo,
        actionCode: formData.actionCode,
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
    applicationNo: rowState?.appNo,
    actionCode: actionCode,
    letterNo: "",
    docCode: "",
    remarks: "",
    file: "",
  };

  const validationSchema = yup.object({
    appNo: yup.string().required("Application No. is required"),
    applicationNo: yup.string().required("Application No. is required"),
    actionCode: yup.number().required("Action Code is required"),
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

    if (values.file) {
      uploadApprovalOrderQuery.mutate({
        applicationNo: values.appNo,
        file: values.file,
      });
    } else {
      actionQuery.mutate({
        appNo: values.appNo,
        actionCode: values.actionCode,
        letterNo: values.letterNo,
        docCode: values.docCode,
        remarks: values.remarks,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Move To Approved List</ModalHeader>
        <ModalCloseButton />

        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form>
              <ModalBody as={Stack} spacing={4}>
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
                  w="full"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  variant="brand"
                  w="full"
                  isLoading={
                    actionQuery.isPending || uploadApprovalOrderQuery.isPending
                  }
                  loadingText="Moving"
                >
                  Yes, Move
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default MoveToApprovedListForm;
