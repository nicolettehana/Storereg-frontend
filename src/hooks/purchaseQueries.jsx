import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Items List
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
