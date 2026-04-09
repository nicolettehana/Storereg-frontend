// import { useMutation, useQuery } from "@tanstack/react-query";
// import { request } from "../components/utils/request";

// // GET: Fetch Ledger (Paginated)
// const fetchLedger = (
//   pageNumber,
//   pageSize,
//   startDate,
//   endDate,
//   categoryCode
// ) => {
//   return request({
//     url: `/ledger?page=${pageNumber}&size=${pageSize}&startDate=${startDate}&endDate=${endDate}&categoryCode=${categoryCode}`,
//     method: "get",
//   });
// };

// export const useFetchLedger = (
//   pageNumber,
//   pageSize,
//   startDate,
//   endDate,
//   categoryCode
// ) => {
//   return useQuery({
//     queryKey: [
//       "ledger",
//       pageNumber,
//       pageSize,
//       startDate,
//       endDate,
//       categoryCode,
//     ],
//     queryFn: () =>
//       fetchLedger(pageNumber, pageSize, startDate, endDate, categoryCode),
//   });
// };

// // GET: Export Ledger
// const exportLedger = (startDate,
//   endDate,
//   categoryCode) => {
//   return request({
//     url: `/ledger/export?categoryCode=${categoryCode}&startDate=${startDate}&endDate=${endDate}`,
//     method: "get",
//     responseType: "blob",
//   });
// };

// export const useExportLedger = () => {
//   return useMutation({
//     mutationFn: ({startDate, endDate, categoryCode }) =>
//       exportLedger(startDate, endDate, categoryCode),
//   });
// };

import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../components/auth/authContext";

/**
 * ----------------------------
 * GET: Fetch Ledger (Paginated)
 * ----------------------------
 */
const fetchLedger = (
  axiosClient,
  pageNumber,
  pageSize,
  startDate,
  endDate,
  categoryCode,
) => {
  return axiosClient.get(
    `/ledger?page=${pageNumber}&size=${pageSize}&startDate=${startDate}&endDate=${endDate}&categoryCode=${categoryCode}`,
  );
};

export const useFetchLedger = (
  pageNumber,
  pageSize,
  startDate,
  endDate,
  categoryCode,
) => {
  const { axiosClient } = useAuthContext();

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
      fetchLedger(
        axiosClient,
        pageNumber,
        pageSize,
        startDate,
        endDate,
        categoryCode,
      ),
  });
};

/**
 * ----------------------------
 * GET: Export Ledger
 * ----------------------------
 */
const exportLedger = (axiosClient, startDate, endDate, categoryCode) => {
  return axiosClient.get(
    `/ledger/export?categoryCode=${categoryCode}&startDate=${startDate}&endDate=${endDate}`,
    {
      responseType: "blob",
    },
  );
};

export const useExportLedger = () => {
  const { axiosClient } = useAuthContext();

  return useMutation({
    mutationFn: ({ startDate, endDate, categoryCode }) =>
      exportLedger(axiosClient, startDate, endDate, categoryCode),
  });
};
