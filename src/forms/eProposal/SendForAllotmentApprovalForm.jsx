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
import { useFetchQuarterTypes } from "../../hooks/quartersQueries";
import { useFetchVacantQuartersByType } from "../../hooks/bookingQueries";
import { useFetchAllotmentRequestByAppNo } from "../../hooks/waitingListQueries";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

const SendForAllotmentApprovalForm = ({ rowState, isOpen, onClose }) => {
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
  const insertAllotmentStatusQuery = useEProposalInsertAllotmentStatus(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-waiting-list-applications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-allotment-request-by-appno"],
      });

      navigate("/ch/published-lists");

      return response;
    },
    (error) => {
      return error;
    }
  );
  const eProposalQuery = useEProposalRequest(
    (response) => {
      const insertData = { ...rowState };
      delete insertData.actions;
      delete insertData.entrydate;
      delete insertData.waitingListNo;
      delete insertData.waitingListCode;
      delete insertData.uploadTimestamp;
      delete insertData.docCode;
      delete insertData.letterNo;

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

      insertData.quarterNo = formikRef.current.values.quarterNo;
      insertData.quarterType = formikRef.current.values.quarterType;
      insertData.quarterLocation = vacantQuarterQuery?.data?.data?.find(
        (q) => q?.quarterNo === insertData.quarterNo
      )?.location;

      setRequestId(response.data.requestId);
      insertData.requestId = response.data.requestId;
      insertData.appNo = response.data.appNo;
      insertData.entryDate = insertData.entrydate;
      insertData.current_requestType = formikRef.current.values.requestType;
      insertData.WL_Id = formikRef.current.values.wlNo;
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
        description: error.response.data.detail,
      });
      return error;
    }
  );

  const insertQuery = useInsertAllotmentQuarterData(
    (response) => {
      insertAllotmentStatusQuery.mutate({ requestId, status: "S" });

      onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.rows.message,
      });

      return response;
    },
    (error) => {
      insertAllotmentStatusQuery.mutate({ requestId, status: "F" });
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description:
          "Oops! something went wrong. Couldn't submit to forwarding officer.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    requestType: "AA",
    outgoingUserDepartment: "",
    outgoingUserOffice: "",
    outgoingUserDesignation: "",
    outgoingUserCode: "",
    outgoingUserName: "",
    quarterType: allotmentRequestQuery?.data?.data?.quarterType || "",
    quarterNo: allotmentRequestQuery?.data?.data?.quarterNo || "",
  };

  const validationSchema = yup.object({
    outgoingUserDepartment: yup.string().required("Department is required"),
    outgoingUserOffice: yup.string().required("Office is required"),
    outgoingUserDesignation: yup.string().required("Designation is required"),
    outgoingUserCode: yup.string().required("User is required"),
    quarterType: yup.string().required("Quarter Type is required"),
    quarterNo: yup.string().required("Quarter No. is required"),
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
      application: { appNo: rowState.appNo },
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

                    <SelectField
                      name="quarterType"
                      label="Quarter Type"
                      placeholder="Select an option"
                      onChange={(e) => {
                        formik.setFieldValue("quarterType", e.target.value);
                        vacantQuarterQuery.mutate({ type: e.target.value });
                      }}
                    >
                      {quarterTypesQuery?.data?.data?.map((row) => (
                        <option key={row?.code} value={row?.code}>
                          {row?.quarterType}
                        </option>
                      ))}
                    </SelectField>

                    {formik.values.quarterType && (
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

export default SendForAllotmentApprovalForm;
