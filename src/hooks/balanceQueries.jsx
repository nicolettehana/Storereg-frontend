// import { useMutation, useQuery } from "@tanstack/react-query";
// import { request } from "../components/utils/request";

// // GET: Get items by level
// const fetchItemsLevelList = (level) => {
//   return request({
//     url: `/stock/${level}`, // <-- use path variable
//     method: "get",
//   });
// };

// export const useFetchItemsLevelList = (level) => {
//   return useQuery({
//     queryKey: ["fetch-items-level-list", level],
//     queryFn: () => fetchItemsLevelList(level),
//     retry: 0,
//   });
// };

import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../components/auth/authContext";

/**
 * ----------------------------
 * GET: Get Items by Level
 * ----------------------------
 */
const fetchItemsLevelList = (axiosClient, level) => {
  return axiosClient.get(`/stock/${level}`);
};

export const useFetchItemsLevelList = (level) => {
  const { axiosClient } = useAuthContext();

  return useQuery({
    queryKey: ["fetch-items-level-list", level],
    queryFn: () => fetchItemsLevelList(axiosClient, level),
    retry: 0,
  });
};
