import { request } from "../components/utils/request";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

// const XSRF_TOKEN = Cookies.get("XSRF-TOKEN");

// POST: Allot Quarter
const allotQuarter = (data) => {
  return request({
    url: "/action",
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useAllotQuarter = (onSuccess, onError) => {
  return useMutation({
    mutationFn: allotQuarter,
    onSuccess,
    onError,
  });
};

// GET: Fetch Previous Waiting List
const fetchPreviousWaitingList = (appNo) => {
  if (appNo === "" || appNo === undefined) return null;
  return request({
    url: `/waiting-list/previous/${appNo}`,
    method: "get",
  });
};

export const useFetchPreviousWaitingList = (appNo) => {
  return useQuery({
    queryKey: ["fetch-previous-waiting-list", appNo],
    queryFn: () => fetchPreviousWaitingList(appNo),
  });
};

// POST: Generate Allotment Order
const generateAllotmentOrder = (data) => {
  return request({
    responseType: "blob",
    url: "/allotment/order",
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useGenerateAllotmentOrder = (onSuccess, onError) => {
  return useMutation({
    mutationFn: generateAllotmentOrder,
    onSuccess,
    onError,
  });
};

// POST: Upload Allotment Order
const uploadAllotmentOrder = (data) => {
  return request({
    headers: {
      "Content-Type": "multipart/form-data;",
      // "X-XSRF-TOKEN": XSRF_TOKEN,
    },
    responseType: "blob",
    url: "/allotment/order-upload",
    method: "post",
    data,
  });
};

export const useUploadAllotmentOrder = (onSuccess, onError) => {
  return useMutation({
    mutationFn: uploadAllotmentOrder,
    onSuccess,
    onError,
  });
};

// POST: Upload Final Allotment Order
const uploadFinalAllotmentOrder = (data) => {
  return request({
    headers: {
      "Content-Type": "multipart/form-data;",
      // "X-XSRF-TOKEN": XSRF_TOKEN,
    },
    responseType: "blob",
    url: "/allotment/order-final-upload",
    method: "post",
    data,
  });
};

export const useUploadFinalAllotmentOrder = (onSuccess, onError) => {
  return useMutation({
    mutationFn: uploadFinalAllotmentOrder,
    onSuccess,
    onError,
  });
};

// POST: Upload Final Allotment Order By CS
const uploadFinalAllotmentOrderByCS = (data) => {
  return request({
    headers: {
      "Content-Type": "multipart/form-data;",
      // "X-XSRF-TOKEN": XSRF_TOKEN,
    },
    responseType: "blob",
    url: "/allotment/order-cs-upload",
    method: "post",
    data,
  });
};

export const useUploadFinalAllotmentOrderByCS = (onSuccess, onError) => {
  return useMutation({
    mutationFn: uploadFinalAllotmentOrderByCS,
    onSuccess,
    onError,
  });
};

// GET: Allotment Request
const fetchAllotmentRequestByAppNo = (appNo) => {
  if (appNo === "" || appNo === undefined) return null;
  return request({
    url: `/allotment/request/${appNo}`,
    method: "get",
  });
};

export const useFetchAllotmentRequestByAppNo = (appNo) => {
  return useQuery({
    queryKey: ["fetch-allotment-request-by-appno", appNo],
    queryFn: () => fetchAllotmentRequestByAppNo(appNo),
  });
};

// POST: Publish Waiting List
const publishWaitingList = (data) => {
  return request({
    url: `/waiting-list/publish/${data.listCode}`,
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
  });
};

export const usePublishWaitingList = (onSuccess, onError) => {
  return useMutation({
    mutationFn: publishWaitingList,
    onSuccess,
    onError,
  });
};

// GET: Approved Waiting Lists By List Type
const fetchApprovedWaitingListByListType = (listType) => {
  if (listType === "" || listType === undefined) return null;
  return request({
    url: `/waiting-list/approved/${listType}`,
    method: "get",
  });
};

export const useFetchApprovedWaitingListByListType = (listType) => {
  return useQuery({
    queryKey: ["fetch-approved-waiting-list-by-list-type", listType],
    queryFn: () => fetchApprovedWaitingListByListType(listType),
  });
};

// POST: Upload Approval Order
const uploadApprovalOrder = (data) => {
  return request({
    headers: {
      "Content-Type": "multipart/form-data;",
      // "X-XSRF-TOKEN": XSRF_TOKEN,
    },
    url: "/application/upload-approval-order",
    method: "post",
    data,
  });
};

export const useUploadApprovalOrder = (onSuccess, onError) => {
  return useMutation({
    mutationFn: uploadApprovalOrder,
    onSuccess,
    onError,
  });
};
