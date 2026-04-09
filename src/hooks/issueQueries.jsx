// import { useMutation, useQuery } from "@tanstack/react-query";
// import { request } from "../components/utils/request";

// // GET: Fetch Issue List
// const fetchIssues = (
//   categoryCode,
//   searchValue = "",
//   pageNumber,
//   pageSize,
//   startDate,
//   endDate
// ) => {
//   return request({
//     url: `/issue${
//       categoryCode ? `/${categoryCode}` : ""
//     }?page=${pageNumber}&size=${pageSize}&search=${searchValue}&startDate=${startDate}&endDate=${endDate}`,
//     method: "get",
//   });
// };

// export const useFetchIssues = (
//   categoryCode,
//   searchValue,
//   pageNumber,
//   pageSize,
//   startDate,
//   endDate
// ) => {
//   return useQuery({
//     queryKey: [
//       "issue",
//       categoryCode,
//       searchValue,
//       pageNumber,
//       pageSize,
//       startDate,
//       endDate,
//     ],
//     queryFn: () =>
//       fetchIssues(
//         categoryCode,
//         searchValue,
//         pageNumber,
//         pageSize,
//         startDate,
//         endDate
//       ),
//   });
// };

// // POST: Create Issue
// const createIssue = (data) => {
//   return request({
//     url: "/issue/create",
//     method: "post",
//     data,
//   });
// };

// export const useCreateIssue = (onSuccess, onError) => {
//   return useMutation({
//     mutationFn: createIssue,
//     onSuccess,
//     onError,
//   });
// };

// // GET: Export Issues
// const exportIssues = (startDate,
//   endDate,
//   categoryCode) => {
//   return request({
//     url: `/issue/export${
//       categoryCode ? `/${categoryCode}` : ""
//     }?startDate=${startDate}&endDate=${endDate}`,
//     method: "get",
//     responseType: "blob",
//   });
// };

// export const useExportIssue = () => {
//   return useMutation({
//     mutationFn: ({startDate, endDate, categoryCode }) =>
//       exportIssues(startDate, endDate, categoryCode),
//   });
// };

import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../components/auth/authContext";

/**
 * ----------------------------
 * GET: Fetch Issue List
 * ----------------------------
 */
const fetchIssues = (
  axiosClient,
  categoryCode,
  searchValue = "",
  pageNumber,
  pageSize,
  startDate,
  endDate,
) => {
  return axiosClient.get(
    `/issue${categoryCode ? `/${categoryCode}` : ""}?page=${pageNumber}&size=${pageSize}&search=${searchValue}&startDate=${startDate}&endDate=${endDate}`,
  );
};

export const useFetchIssues = (
  categoryCode,
  searchValue,
  pageNumber,
  pageSize,
  startDate,
  endDate,
) => {
  const { axiosClient } = useAuthContext();

  return useQuery({
    queryKey: [
      "issue",
      categoryCode,
      searchValue,
      pageNumber,
      pageSize,
      startDate,
      endDate,
    ],
    queryFn: () =>
      fetchIssues(
        axiosClient,
        categoryCode,
        searchValue,
        pageNumber,
        pageSize,
        startDate,
        endDate,
      ),
  });
};

/**
 * ----------------------------
 * POST: Create Issue
 * ----------------------------
 */
const createIssue = (axiosClient, data) => {
  return axiosClient.post("/issue/create", data);
};

export const useCreateIssue = (onSuccess, onError) => {
  const { axiosClient } = useAuthContext();

  return useMutation({
    mutationFn: (data) => createIssue(axiosClient, data),
    onSuccess,
    onError,
  });
};

/**
 * ----------------------------
 * GET: Export Issues
 * ----------------------------
 */
const exportIssues = (axiosClient, startDate, endDate, categoryCode) => {
  return axiosClient.get(
    `/issue/export${categoryCode ? `/${categoryCode}` : ""}?startDate=${startDate}&endDate=${endDate}`,
    {
      responseType: "blob",
    },
  );
};

export const useExportIssue = () => {
  const { axiosClient } = useAuthContext();

  return useMutation({
    mutationFn: ({ startDate, endDate, categoryCode }) =>
      exportIssues(axiosClient, startDate, endDate, categoryCode),
  });
};
