import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Quarters By Type
const fetchItemsByType = (category, search = "", pageNumber, pageSize) => {
  return request({
    url: `/items${
      category ? `/${category}` : ""
    }?page=${pageNumber}&size=${pageSize}&search=${search}`,
    method: "get",
  });
};

export const useFetchItemsByType = (category, search, pageNumber, pageSize) => {
  return useQuery({
    queryKey: ["items", category, search, pageNumber, pageSize],
    queryFn: () => fetchItemsByType(category, search, pageNumber, pageSize),
  });
};

// POST: Create Item
const createItem = (data) => {
  return request({
    url: "/items",
    method: "post",
    data,
  });
};

export const useCreateItem = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createItem,
    onSuccess,
    onError,
  });
};
