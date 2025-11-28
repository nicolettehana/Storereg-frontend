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
import SelectField from "../../components/core/formik/SelectField";
import {
  useEProposalInsertAllotmentStatus,
  useEProposalRequest,
  useGetDepartmentEProposal,
  useGetOfficeByDepartment,
  useGetUserProfileByDepartmentOffice,
  useInsertAllotmentQuarterData,
} from "../../hooks/eProposalQueries";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";

const SubmitToForwardingOfficerForm = ({ formData, isOpen, onClose }) => {
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();
  const formikRef = useRef();

  // States
  const [deptId, setDeptId] = useState(null);
  const [officeId, setOfficeId] = useState(null);
  const [requestId, setRequestId] = useState(null);

  // Queries
  const queryClient = useQueryClient();
  const departmentQuery = useGetDepartmentEProposal();
  const officeQuery = useGetOfficeByDepartment({ department_id: deptId });
  const profileQuery = useGetUserProfileByDepartmentOffice({
    department_id: deptId,
    office_id: officeId,
  });

  const insertAllotmentStatusQuery = useEProposalInsertAllotmentStatus(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-booking-applications"],
      });
      onClose();
      navigate("/user/dashboard");
      return response;
    },
    (error) => {
      return error;
    }
  );

  const eProposalQuery = useEProposalRequest(
    (response) => {
      const insertData = { ...formData };

      // Comment This
      // insertData.office_telephone = insertData.officeTelephone;
      // delete insertData.officeTelephone;

      insertData.accommodationDetails =
        insertData.accommodationDetails || "N/A";
      insertData.debarredUptoDate = insertData.debarredUptoDate || null;
      insertData.deputationPeriod = insertData.deputationPeriod || null;
      insertData.houseLocation = insertData.houseLocation || null;
      insertData.loanYear = insertData.loanYear || null;
      insertData.maritalStatus = insertData.maritalStatus || null;
      insertData.otherServicesDetails = insertData.otherServicesDetails || null;
      insertData.particularsOfHouse = insertData.particularsOfHouse || null;
      insertData.reasonDeptQuarter = insertData.reasonDeptQuarter || null;
      insertData.gender = insertData.gender === "M" ? "Male" : "Female";

      setRequestId(response.data.requestId);
      insertData.requestId = response.data.requestId;
      insertData.appNo = response.data.appNo;
      insertData.entryDate = dayjs().format("YYYY-MM-DD");
      insertData.current_requestType = formikRef.current.values.requestType;
      insertData.WL_Id = null;
      insertData.DepartmentId = formikRef.current.values.outgoingUserDepartment;
      insertData.OfficeId = formikRef.current.values.outgoingUserOffice;
      insertData.UserProfileId = formikRef.current.values.outgoingUserCode;
      insertQuery.mutate(insertData);

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
          "Oops! something went wrong. Couldn't submit to forwarding officer.",
      });
      return error;
    }
  );

  const insertQuery = useInsertAllotmentQuarterData(
    (response) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.rows.message,
      });
      insertAllotmentStatusQuery.mutate({ requestId, status: "S" });
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
          "Oops! something went wrong. Couldn't submit to forwarding officer.",
      });
      insertAllotmentStatusQuery.mutate({ requestId, status: "F" });
      return error;
    }
  );

  // Formik
  const initialValues = {
    requestType: "FOA",
    outgoingUserDepartment: "",
    outgoingUserOffice: "",
    outgoingUserDesignation: "",
    outgoingUserCode: "",
    outgoingUserName: "",
  };

  const validationSchema = yup.object({
    outgoingUserDepartment: yup.string().required("Department is required"),
    outgoingUserOffice: yup.string().required("Office is required"),
    outgoingUserDesignation: yup.string().required("Designation is required"),
    outgoingUserCode: yup.string().required("User is required"),
  });

  const onSubmit = (values) => {
    const request = { ...values };

    request.outgoingUserDepartment = departmentQuery?.data?.data?.rows[0]?.find(
      (row) => `${row?.department_id}` === values.outgoingUserDepartment
    )?.department_name;

    request.outgoingUserOffice = officeQuery?.data?.data?.rows[0]?.find(
      (row) => `${row?.offices_id}` === values.outgoingUserOffice
    )?.office_name;

    request.outgoingUserName = profileQuery?.data?.data?.rows[0]?.find(
      (row) => `${row?.userprofile_id}` === values.outgoingUserCode
    )?.user_name;

    const combinedFormData = {
      request,
      application: { ...formData },
    };

    combinedFormData.request.outgoingUserCode = parseInt(
      values.outgoingUserCode
    );

    eProposalQuery.mutate(combinedFormData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Forwarding Officer Details
          </ModalHeader>

          <Formik
            innerRef={formikRef}
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <Form>
                  <ModalBody as={Stack} spacing={4}>
                    <SelectField
                      name="outgoingUserDepartment"
                      label="Department"
                      placeholder="Select department"
                      onChange={(e) => {
                        const value = e.target.value;
                        setDeptId(value);
                        formik.setFieldValue("outgoingUserDepartment", value);
                      }}
                    >
                      {departmentQuery?.data?.data?.rows[0]?.map((row) => (
                        <option
                          key={row?.department_id}
                          value={row?.department_id}
                        >
                          {row?.department_name}
                        </option>
                      ))}
                    </SelectField>

                    <SelectField
                      name="outgoingUserOffice"
                      label="Office"
                      placeholder="Select office"
                      onChange={(e) => {
                        const value = e.target.value;
                        setOfficeId(value);
                        formik.setFieldValue("outgoingUserOffice", value);
                      }}
                    >
                      {officeQuery?.data?.data?.rows[0]?.map((row) => (
                        <option key={row?.offices_id} value={row?.offices_id}>
                          {row?.office_name}
                        </option>
                      ))}
                    </SelectField>

                    <SelectField
                      name="outgoingUserCode"
                      label="User"
                      placeholder="Select user"
                      onChange={(e) => {
                        const value = e.target.value;
                        const designation =
                          profileQuery?.data?.data?.rows[0]?.find(
                            (row) => `${row?.userprofile_id}` === value
                          )?.designation_name;
                        formik.setFieldValue("outgoingUserCode", value);
                        formik.setFieldValue(
                          "outgoingUserDesignation",
                          designation
                        );
                      }}
                    >
                      {profileQuery?.data?.data?.rows[0]?.map((row) => (
                        <option
                          key={row?.userprofile_id}
                          value={row?.userprofile_id}
                        >
                          {row?.user_name} - {row?.designation_name}
                        </option>
                      ))}
                    </SelectField>
                  </ModalBody>

                  <ModalFooter as={HStack}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      w="full"
                    >
                      Go Back
                    </Button>
                    <Button
                      type="submit"
                      variant="brand"
                      w="full"
                      isLoading={
                        eProposalQuery.isPending || insertQuery.isPending
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

export default SubmitToForwardingOfficerForm;
