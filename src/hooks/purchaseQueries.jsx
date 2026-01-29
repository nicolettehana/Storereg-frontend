import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Purchases List
const fetchPurchases = (
  categoryCode,
  searchValue = "",
  pageNumber,
  pageSize,
  startDate,
  endDate,
  status,
  type,
) => {
  return request({
    url: `/purchase${
      categoryCode ? `/${categoryCode}` : ""
    }?page=${pageNumber}&size=${pageSize}&search=${searchValue}&startDate=${startDate}&endDate=${endDate}&status=${status}&type=${type}`,
    method: "get",
  });
};

export const useFetchPurchases = (
  categoryCode,
  searchValue,
  pageNumber,
  pageSize,
  startDate,
  endDate,
  status,
  type,
) => {
  return useQuery({
    queryKey: [
      "purchase",
      categoryCode,
      searchValue,
      pageNumber,
      pageSize,
      startDate,
      endDate,
      status,
      type,
    ],
    queryFn: () =>
      fetchPurchases(
        categoryCode,
        searchValue,
        pageNumber,
        pageSize,
        startDate,
        endDate,
        status,
        type,
      ),
  });
};

// GET: Fetch Non Stock Purchases List
const fetchNonStockPurchases = (
  categoryCode,
  searchValue = "",
  pageNumber,
  pageSize,
  startDate,
  endDate,
  status,
  type,
) => {
  return request({
    url: `/purchase/ns${
      categoryCode ? `/${categoryCode}` : ""
    }?page=${pageNumber}&size=${pageSize}&search=${searchValue}&startDate=${startDate}&endDate=${endDate}&status=${status}&type=${type}`,
    method: "get",
  });
};

export const useFetchNonStockPurchases = (
  categoryCode,
  searchValue,
  pageNumber,
  pageSize,
  startDate,
  endDate,
  status,
  type,
) => {
  return useQuery({
    queryKey: [
      "purchasens",
      categoryCode,
      searchValue,
      pageNumber,
      pageSize,
      startDate,
      endDate,
      status,
      type,
    ],
    queryFn: () =>
      fetchNonStockPurchases(
        categoryCode,
        searchValue,
        pageNumber,
        pageSize,
        startDate,
        endDate,
        status,
        type,
      ),
  });
};

// POST: Create Purchase
const createPurchase = (data) => {
  return request({
    url: "/purchase/create",
    method: "post",
    data,
  });
};

export const useCreatePurchase = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createPurchase,
    onSuccess,
    onError,
  });
};

// POST: Create Purchase Non-Stock
const createPurchaseNS = (data) => {
  return request({
    url: "/purchase/create-ns",
    method: "post",
    data,
  });
};

export const useCreatePurchaseNS = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createPurchaseNS,
    onSuccess,
    onError,
  });
};

// GET: Get amount by fin-year
const fetchAmount = (year) => {
  return request({
    url: `/purchase/year/${year}`,
    method: "get",
  });
};

export const useFetchAmount = (year) => {
  return useQuery({
    queryKey: ["fetch-amount", year],
    queryFn: () => fetchAmount(year),
    retry: 0,
  });
};

// GET: Export Purchases
const exportPurchases = (startDate, endDate, categoryCode, status) => {
  return request({
    url: `/purchase/export${
      categoryCode ? `/${categoryCode}` : ""
    }?startDate=${startDate}&endDate=${endDate}&status=${status}`,
    method: "get",
    responseType: "blob",
  });
};

export const useExportPurchase = () => {
  return useMutation({
    mutationFn: ({ startDate, endDate, categoryCode, status }) =>
      exportPurchases(startDate, endDate, categoryCode, status),
  });
};

// GET: Export Purchase Orders Non Stock
const exportPurchasesNS = (startDate, endDate, categoryCode, status) => {
  return request({
    url: `/purchase/export-ns${
      categoryCode ? `/${categoryCode}` : ""
    }?startDate=${startDate}&endDate=${endDate}&status=${status}`,
    method: "get",
    responseType: "blob",
  });
};

export const useExportPurchaseNS = () => {
  return useMutation({
    mutationFn: ({ startDate, endDate, categoryCode, status }) =>
      exportPurchasesNS(startDate, endDate, categoryCode, status),
  });
};

// GET: Export Purchase Receipts
const exportPurchaseReceipts = (startDate, endDate, categoryCode) => {
  return request({
    url: `/purchase/export/receipts${
      categoryCode ? `/${categoryCode}` : ""
    }?startDate=${startDate}&endDate=${endDate}`,
    method: "get",
    responseType: "blob",
  });
};

export const useExportPurchaseReceipts = () => {
  return useMutation({
    mutationFn: ({ startDate, endDate, categoryCode }) =>
      exportPurchaseReceipts(startDate, endDate, categoryCode),
  });
};

// GET: Export Purchase Receipts Non Stock
const exportPurchaseReceiptsNS = (startDate, endDate, categoryCode) => {
  return request({
    url: `/purchase/export/receipts-ns${
      categoryCode ? `/${categoryCode}` : ""
    }?startDate=${startDate}&endDate=${endDate}`,
    method: "get",
    responseType: "blob",
  });
};

export const useExportPurchaseReceiptsNS = () => {
  return useMutation({
    mutationFn: ({ startDate, endDate, categoryCode }) =>
      exportPurchaseReceiptsNS(startDate, endDate, categoryCode),
  });
};

// POST: Create Purchase Receipt
const createPurchaseReceipt = (data) => {
  return request({
    url: "/purchase/receipt",
    method: "post",
    data,
  });
};

export const useCreatePurchaseReceipt = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createPurchaseReceipt,
    onSuccess,
    onError,
  });
};

// POST: Create Purchase Receipt
const createPurchaseReceiptNS = (data) => {
  return request({
    url: "/purchase/receipt-ns",
    method: "post",
    data,
  });
};

export const useCreatePurchaseReceiptNS = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createPurchaseReceiptNS,
    onSuccess,
    onError,
  });
};
