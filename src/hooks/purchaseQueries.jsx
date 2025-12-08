import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Purchases List
const fetchPurchases = (
  categoryCode,
  searchValue = "",
  pageNumber,
  pageSize,
  startDate,
  endDate
) => {
  return request({
    url: `/purchase${
      categoryCode ? `/${categoryCode}` : ""
    }?page=${pageNumber}&size=${pageSize}&search=${searchValue}&startDate=${startDate}&endDate=${endDate}`,
    method: "get",
  });
};

export const useFetchPurchases = (
  categoryCode,
  searchValue,
  pageNumber,
  pageSize,
  startDate,
  endDate
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
    ],
    queryFn: () =>
      fetchPurchases(
        categoryCode,
        searchValue,
        pageNumber,
        pageSize,
        startDate,
        endDate
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
