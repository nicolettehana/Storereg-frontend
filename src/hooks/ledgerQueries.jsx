import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Ledger (Paginated)
const fetchLedger = (
  pageNumber,
  pageSize,
  startDate,
  endDate,
  categoryCode
) => {
  return request({
    url: `/ledger?page=${pageNumber}&size=${pageSize}&startDate=${startDate}&endDate=${endDate}&categoryCode=${categoryCode}`,
    method: "get",
  });
};

export const useFetchLedger = (
  pageNumber,
  pageSize,
  startDate,
  endDate,
  categoryCode
) => {
  return useQuery({
    queryKey: [
      "ledger",
      pageNumber,
      pageSize,
      startDate,
      endDate,
      categoryCode,
    ],
    queryFn: () =>
      fetchLedger(pageNumber, pageSize, startDate, endDate, categoryCode),
  });
};
