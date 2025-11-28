import { request } from "../components/utils/request";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

// const XSRF_TOKEN = Cookies.get("XSRF-TOKEN");

// GET: Fetch Paginated Pending Allotments
const fetchPaginatedPendingAllotments = (pageNumber, pageSize) => {
  return request({
    url: `/allotment/pending?page=${pageNumber}&size=${pageSize}`,
    method: "get",
  });
};

export const useFetchPaginatedPendingAllotments = (pageNumber, pageSize) => {
  return useQuery({
    queryKey: ["fetch-paginated-pending-allotments", pageNumber, pageSize],
    queryFn: () => fetchPaginatedPendingAllotments(pageNumber, pageSize),
  });
};

// GET: Fetch Paginated Completed Allotments
const fetchPaginatedCompletedAllotments = (
  pageNumber,
  pageSize,
  fromDate,
  toDate
) => {
  return request({
    url: `/allotment/completed?page=${pageNumber}&size=${pageSize}`,
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data: { fromDate, toDate },
  });
};

export const useFetchPaginatedCompletedAllotments = (
  pageNumber,
  pageSize,
  fromDate,
  toDate
) => {
  return useQuery({
    queryKey: [
      "fetch-paginated-completed-allotments",
      pageNumber,
      pageSize,
      fromDate,
      toDate,
    ],
    queryFn: () =>
      fetchPaginatedCompletedAllotments(pageNumber, pageSize, fromDate, toDate),
  });
};

// POST: Fetch Allotment Letter
const fetchAllotmentLetter = (data) => {
  if (data.appNo === null || data.appNo === undefined) return null;
  return request({
    responseType: "blob",
    url: `/allotment/letter`,
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useFetchAllotmentLetter = (onSuccess, onError) => {
  return useMutation({
    mutationFn: fetchAllotmentLetter,
    onSuccess,
    onError,
  });
};

// POST: Upload Acceptance Letter
const uploadAcceptanceLetter = (data) => {
  return request({
    headers: {
      "Content-Type": "multipart/form-data;",
      // "X-XSRF-TOKEN": XSRF_TOKEN,
    },
    url: "/allotment/upload-decision-letter",
    method: "post",
    data,
  });
};

export const useUploadAcceptanceLetter = (onSuccess, onError) => {
  return useMutation({
    mutationFn: uploadAcceptanceLetter,
    onSuccess,
    onError,
  });
};

// POST: Add Occupation Date
const addOccupationDate = (data) => {
  return request({
    url: "/allotment/occupy",
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useAddOccupationDate = (onSuccess, onError) => {
  return useMutation({
    mutationFn: addOccupationDate,
    onSuccess,
    onError,
  });
};

// GET: Get Applicant Letter
const getApplicantLetter = (data) => {
  return request({
    responseType: "blob",
    url: `/allotment/get-applicant-letter`,
    method: "post",
    // headers: {
    // "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useGetApplicantLetter = (onSuccess, onError) => {
  return useMutation({
    mutationFn: getApplicantLetter,
    onSuccess,
    onError,
  });
};

// POST: Cancel Allotment
const cancelAllotment = (data) => {
  return request({
    url: "/allotment/cancel",
    method: "post",
    data,
  });
};

export const useCancelAllotment = (onSuccess, onError) => {
  return useMutation({
    mutationFn: cancelAllotment,
    onSuccess,
    onError,
  });
};
