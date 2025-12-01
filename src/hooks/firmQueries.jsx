import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Quarters By Type
const fetchFirmsByType = (category, search = "", pageNumber, pageSize) => {
  return request({
    url: `/firms${
      category ? `/${category}` : ""
    }?page=${pageNumber}&size=${pageSize}&search=${search}`,
    method: "get",
  });
};

export const useFetchFirmsByType = (category, search, pageNumber, pageSize) => {
  return useQuery({
    queryKey: ["firms", category, search, pageNumber, pageSize],
    queryFn: () => fetchFirmsByType(category, search, pageNumber, pageSize),
  });
};

// POST: Create Firm
const createFirm = (data) => {
  return request({
    url: "/firms",
    method: "post",
    data,
  });
};

export const useCreateFirm = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createFirm,
    onSuccess,
    onError,
  });
};
