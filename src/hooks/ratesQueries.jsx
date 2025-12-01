import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Rates By Category/Year Range
const fetchRates = (category, search = "", pageNumber, pageSize, yearRange) => {
  return request({
    url: `/rates${
      category ? `/${category}` : ""
    }?page=${pageNumber}&size=${pageSize}&search=${search}&yearRange=${yearRange}`,
    method: "get",
  });
};

export const useFetchRates = (
  category,
  search,
  pageNumber,
  pageSize,
  yearRange
) => {
  return useQuery({
    queryKey: ["rates", category, search, pageNumber, pageSize, yearRange],
    queryFn: () =>
      fetchRates(category, search, pageNumber, pageSize, yearRange),
  });
};
