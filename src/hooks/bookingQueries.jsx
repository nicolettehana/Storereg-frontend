import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";
import Cookies from "js-cookie";

// const XSRF_TOKEN = Cookies.get("XSRF-TOKEN");

// GET: Booking Applications
const fetchBookingApplications = (pageNumber, pageSize) => {
  return request({
    url: `/application?page=${pageNumber}&size=${pageSize}`,
    method: "get",
  });
};

export const useFetchBookingApplications = (pageNumber, pageSize) => {
  return useQuery({
    queryKey: ["fetch-booking-applications", pageNumber, pageSize],
    queryFn: () => fetchBookingApplications(pageNumber, pageSize),
  });
};

// GET: Fetch Paginated All Booking Applications
const fetchPaginatedAllBookingApplications = (
  pageNumber,
  pageSize,
  fromDate,
  toDate
) => {
  return request({
    url: `/application/all?page=${pageNumber}&size=${pageSize}`,
    method: "post",
    // headers: {
    // "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data: { fromDate, toDate },
  });
};

export const useFetchPaginatedAllBookingApplications = (
  pageNumber,
  pageSize,
  fromDate,
  toDate
) => {
  return useQuery({
    queryKey: [
      "fetch-paginated-all-booking-applications",
      pageNumber,
      pageSize,
      fromDate,
      toDate,
    ],
    queryFn: () =>
      fetchPaginatedAllBookingApplications(
        pageNumber,
        pageSize,
        fromDate,
        toDate
      ),
  });
};

// GET: Quarter Change Request Applications
const fetchQuarterChangeBookingApplications = (pageNumber, pageSize) => {
  return request({
    url: `/application/qc?page=${pageNumber}&size=${pageSize}`,
    method: "get",
  });
};

export const useFetchQuarterChangeBookingApplications = (
  pageNumber,
  pageSize
) => {
  return useQuery({
    queryKey: [
      "fetch-quarter-change-booking-applications",
      pageNumber,
      pageSize,
    ],
    queryFn: () => fetchQuarterChangeBookingApplications(pageNumber, pageSize),
  });
};

// GET: Returned Applications from eProposal
const fetchReturnedApplicationsFromEProposal = (pageNumber, pageSize) => {
  return request({
    url: `/application/bck?page=${pageNumber}&size=${pageSize}`,
    method: "get",
  });
};

export const useFetchReturnedApplicationsFromEProposal = (
  pageNumber,
  pageSize
) => {
  return useQuery({
    queryKey: [
      "fetch-returned-applications-from-eproposal",
      pageNumber,
      pageSize,
    ],
    queryFn: () => fetchReturnedApplicationsFromEProposal(pageNumber, pageSize),
  });
};

// GET: Returned Applications from CS
const fetchReturnedApplications = (pageNumber, pageSize) => {
  return request({
    url: `/application/bck?page=${pageNumber}&size=${pageSize}`,
    method: "get",
  });
};

export const useFetchReturnedApplications = (pageNumber, pageSize) => {
  return useQuery({
    queryKey: ["fetch-returned-applications", pageNumber, pageSize],
    queryFn: () => fetchReturnedApplications(pageNumber, pageSize),
  });
};

// GET: Pending for final approval Applications from CS
const fetchPendingForFinalApprovalApplications = (pageNumber, pageSize) => {
  return request({
    url: `/application/final?page=${pageNumber}&size=${pageSize}`,
    method: "get",
  });
};

export const useFetchPendingForFinalApprovalApplications = (
  pageNumber,
  pageSize
) => {
  return useQuery({
    queryKey: [
      "fetch-pending-for-final-approval-applications",
      pageNumber,
      pageSize,
    ],
    queryFn: () =>
      fetchPendingForFinalApprovalApplications(pageNumber, pageSize),
  });
};

// POST: Booking Application
const createBookingApplication = (data) => {
  return request({
    responseType: "blob",
    url: "/application/generate",
    method: "post",
    // headers: {
    // "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useCreateBookingApplication = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createBookingApplication,
    onSuccess,
    onError,
  });
};

// GET: Booking Application Status
const fetchBookingApplicationStatus = () => {
  return request({
    url: "/status",
    method: "get",
  });
};

export const useFetchBookingApplicationStatus = () => {
  return useQuery({
    queryKey: ["fetch-booking-application-status"],
    queryFn: fetchBookingApplicationStatus,
  });
};

// POST: Booking Actions
const bookingActions = (data) => {
  return request({
    url: "/application/action",
    method: "post",
    // headers: {
    // "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useBookingActions = (onSuccess, onError) => {
  return useMutation({
    mutationFn: bookingActions,
    onSuccess,
    onError,
  });
};

// POST: Download Booking Form
const downloadBookingForm = (data) => {
  return request({
    responseType: "blob",
    url: `/application/download/${data.appNo}`,
    method: "get",
  });
};

export const useDownloadBookingForm = (onSuccess, onError) => {
  return useMutation({
    mutationFn: downloadBookingForm,
    onSuccess,
    onError,
  });
};

// POST: Upload Booking Form
const uploadBookingForm = (data) => {
  return request({
    headers: {
      "Content-Type": "multipart/form-data;",
      // "X-XSRF-TOKEN": XSRF_TOKEN,
    },
    url: `/application/upload`,
    method: "post",
    data,
  });
};

export const useUploadBookingForm = (onSuccess, onError) => {
  return useMutation({
    mutationFn: uploadBookingForm,
    onSuccess,
    onError,
  });
};

// GET: Fetch Application Remarks
const fetchApplicationRemarks = (appNo) => {
  return request({
    url: `/application/remarks/${appNo}`,
    method: "get",
  });
};

export const useFetchApplicationRemarks = (appNo) => {
  if (appNo === undefined || appNo === "") return;

  return useQuery({
    queryKey: ["fetch-application-remarks", appNo],
    queryFn: () => fetchApplicationRemarks(appNo),
  });
};

// GET: Fetch Application Remarks DA
const fetchApplicationRemarksDA = (appNo) => {
  return request({
    url: `/application/remarks-da/${appNo}`,
    method: "get",
  });
};

export const useFetchApplicationRemarksDA = (appNo) => {
  if (appNo === undefined || appNo === "") return;

  return useQuery({
    queryKey: ["fetch-application-remarks-da", appNo],
    queryFn: () => fetchApplicationRemarksDA(appNo),
    enabled: false,
  });
};

// GET: Fetch Application Summary
const fetchApplicationSummary = () => {
  return request({
    url: "/application/summary",
    method: "get",
  });
};

export const useFetchApplicationSummary = () => {
  return useQuery({
    queryKey: ["fetch-application-summary"],
    queryFn: fetchApplicationSummary,
  });
};

// GET: Waiting List Applications
const fetchWaitingListApplications = (code) => {
  if (code === "" || code === undefined) return null;
  return request({
    url: `/waiting-list/applications${code && `/${code}`}`,
    method: "get",
  });
};

export const useFetchWaitingListApplications = (code) => {
  return useQuery({
    queryKey: ["fetch-waiting-list-applications", code],
    queryFn: () => fetchWaitingListApplications(code),
  });
};

// GET: Waiting List
const fetchWaitingList = () => {
  return request({
    url: "/waiting-list",
    method: "get",
  });
};

export const useFetchWaitingList = () => {
  return useQuery({
    queryKey: ["fetch-waiting-list"],
    queryFn: fetchWaitingList,
  });
};

// GET: Fetch Vacant Quarters By Type
const fetchVacantQuartersByType = (data) => {
  if (data.type === "") return;
  return request({
    url: `/quarters/vacant/${data.type}`,
    method: "get",
  });
};

export const useFetchVacantQuartersByType = (onSuccess, onError) => {
  return useMutation({
    mutationFn: fetchVacantQuartersByType,
    onSuccess,
    onError,
  });
};

// GET: Fetch Allotment Details
const fetchAllotmentDetails = (appNo) => {
  return request({
    url: `/allotment/${appNo}`,
    method: "get",
  });
};

export const useFetchAllotmentDetails = (appNo) => {
  if (appNo === undefined || appNo === "") return;
  return useQuery({
    queryKey: ["fetch-quarter-types", appNo],
    queryFn: () => fetchAllotmentDetails(appNo),
    enabled: false,
  });
};
