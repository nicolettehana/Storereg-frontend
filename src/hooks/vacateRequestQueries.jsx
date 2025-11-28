import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";
import Cookies from "js-cookie";

// const XSRF_TOKEN = Cookies.get("XSRF-TOKEN");

// GET: Vacate Requests
const fetchPaginatedVacateRequest = (pageNumber, pageSize) => {
  return request({
    url: `/vacate-request?page=${pageNumber}&size=${pageSize}`,
    method: "get",
  });
};

export const useFetchPaginatedVacateRequest = (pageNumber, pageSize) => {
  return useQuery({
    queryKey: ["fetch-paginated-vacate-request", pageNumber, pageSize],
    queryFn: () => fetchPaginatedVacateRequest(pageNumber, pageSize),
  });
};

// GET: Pending Vacate Requests
const fetchPaginatedPendingVacateRequest = (pageNumber, pageSize) => {
  return request({
    url: `/vacate-request/pending?page=${pageNumber}&size=${pageSize}`,
    method: "get",
  });
};

export const useFetchPaginatedPendingVacateRequest = (pageNumber, pageSize) => {
  return useQuery({
    queryKey: ["fetch-paginated-pending-vacate-request", pageNumber, pageSize],
    queryFn: () => fetchPaginatedPendingVacateRequest(pageNumber, pageSize),
  });
};

// GET: Completed Vacate Requests
const fetchPaginatedCompletedVacateRequest = (pageNumber, pageSize) => {
  return request({
    url: `/vacate-request/completed?page=${pageNumber}&size=${pageSize}`,
    method: "get",
  });
};

export const useFetchPaginatedCompletedVacateRequest = (
  pageNumber,
  pageSize
) => {
  return useQuery({
    queryKey: [
      "fetch-paginated-completed-vacate-request",
      pageNumber,
      pageSize,
    ],
    queryFn: () => fetchPaginatedCompletedVacateRequest(pageNumber, pageSize),
  });
};

// GET: View Vacate Documents
const viewVacateDocuments = (data) => {
  return request({
    responseType: "blob",
    url: `/vacate-document/${data.documentCode}`,
    method: "get",
  });
};

export const useViewVacateDocuments = (onSuccess, onError) => {
  return useMutation({
    mutationFn: viewVacateDocuments,
    onSuccess,
    onError,
  });
};

// GET: Available Quarters
const fetchAvailableQuarters = () => {
  return request({
    url: "/vacate-request/get-available-quarters",
    method: "get",
  });
};

export const useFetchAvailableQuarters = () => {
  return useQuery({
    queryKey: ["fetch-available-quarters"],
    queryFn: fetchAvailableQuarters,
  });
};

// POST: Get Vacate Documents
const fetchVacateDocuments = (data) => {
  return request({
    url: "/vacate-document",
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useFetchVacateDocuments = (onSuccess, onError) => {
  return useMutation({
    mutationFn: fetchVacateDocuments,
    onSuccess,
    onError,
  });
};

// POST: Upload Vacate Documents
const uploadVacateDocuments = (data) => {
  return request({
    headers: {
      "Content-Type": "multipart/form-data;",
      // "X-XSRF-TOKEN": XSRF_TOKEN,
    },
    url: "/vacate-document/upload",
    method: "post",
    data,
  });
};

export const useUploadVacateDocuments = (onSuccess, onError) => {
  return useMutation({
    mutationFn: uploadVacateDocuments,
    onSuccess,
    onError,
  });
};

// POST: Request Vacate
const requestVacate = (data) => {
  return request({
    url: "/vacate-request",
    method: "post",
    // headers: {
    // "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useRequestVacate = (onSuccess, onError) => {
  return useMutation({
    mutationFn: requestVacate,
    onSuccess,
    onError,
  });
};

// POST: Accept Vacate Request
const acceptVacateRequest = (data) => {
  return request({
    url: "/vacate-request/accept",
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useAcceptVacateRequest = (onSuccess, onError) => {
  return useMutation({
    mutationFn: acceptVacateRequest,
    onSuccess,
    onError,
  });
};

// POST: Reject Vacate Request
const rejectVacateRequest = (data) => {
  return request({
    url: "/vacate-request/reject",
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useRejectVacateRequest = (onSuccess, onError) => {
  return useMutation({
    mutationFn: rejectVacateRequest,
    onSuccess,
    onError,
  });
};

// GET: Vacate Request Stats
const fetchVacateRequestStats = () => {
  return request({
    url: "/vacate-request/stats",
    method: "get",
  });
};

export const useFetchVacateRequestStats = () => {
  return useQuery({
    queryKey: ["fetch-vacate-request-stats"],
    queryFn: fetchVacateRequestStats,
  });
};
