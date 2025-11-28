import { eProposalAPI } from "../components/utils/eProposalApi";
import { request } from "../components/utils/request";
import { useMutation, useQuery } from "@tanstack/react-query";

const eProposalRequest = (data) => {
  return request({
    url: "/eproposal-request",
    method: "post",
    data,
  });
};

export const useEProposalRequest = (onSuccess, onError) => {
  return useMutation({
    mutationFn: eProposalRequest,
    onSuccess,
    onError,
  });
};

// Insert Allotment Status
const eProposalInsertAllotmentStatus = (data) => {
  return request({
    url: "/eproposal-insert-allotment-status",
    method: "post",
    data,
  });
};

export const useEProposalInsertAllotmentStatus = (onSuccess, onError) => {
  return useMutation({
    mutationFn: eProposalInsertAllotmentStatus,
    onSuccess,
    onError,
  });
};

// POST: Get Department
const getDepartmentEProposal = () => {
  return eProposalAPI({
    url: "/getDepartment",
    method: "post",
  });
};

export const useGetDepartmentEProposal = () => {
  return useQuery({
    queryKey: ["get-department-eproposal"],
    queryFn: getDepartmentEProposal,
  });
};

// POST: Get Office By Department ID
const getOfficeByDepartment = ({ department_id }) => {
  if (department_id === null) return null;
  const data = { department_id };

  return eProposalAPI({
    url: "/getOfficebydepartment",
    method: "post",
    data,
  });
};

export const useGetOfficeByDepartment = ({ department_id }) => {
  return useQuery({
    queryKey: ["get-office-by-department", department_id],
    queryFn: () => getOfficeByDepartment({ department_id }),
  });
};

// POST: Get User Profile By Department Office
const getUserProfileByDepartmentOffice = ({ department_id, office_id }) => {
  if (department_id === null || office_id === null) return null;
  const data = { department_id, office_id };

  return eProposalAPI({
    url: "/getUserProfileByDepartmentOffice",
    method: "post",
    data,
  });
};

export const useGetUserProfileByDepartmentOffice = ({
  department_id,
  office_id,
}) => {
  return useQuery({
    queryKey: [
      "get-user-profile-by-department-office",
      department_id,
      office_id,
    ],
    queryFn: () =>
      getUserProfileByDepartmentOffice({ department_id, office_id }),
  });
};

// POST: Insert Allotment Quarter Data
const insertAllotmentQuarterData = (data) => {
  return eProposalAPI({
    url: "/insertAllotmentQuarterData",
    method: "post",
    data,
  });
};

export const useInsertAllotmentQuarterData = (onSuccess, onError) => {
  return useMutation({
    mutationFn: insertAllotmentQuarterData,
    onSuccess,
    onError,
  });
};
