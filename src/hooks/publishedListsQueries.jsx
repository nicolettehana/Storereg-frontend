import { useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Published Lists By List Type
const fetchPublishedListsByListType = (listType) => {
  if (listType === "" || listType === undefined) return null;
  return request({
    url: `/published-list/latest/${listType}`,
    method: "get",
  });
};

export const useFetchPublishedListsByListType = (listType) => {
  return useQuery({
    queryKey: ["fetch-published-list-by-list-type", listType],
    queryFn: () => fetchPublishedListsByListType(listType),
  });
};

// GET: Archived Published Lists By List Type
const fetchArchivedPublishedListsByListType = (
  listType,
  pageNumber,
  pageSize
) => {
  return request({
    url: `/published-list/archived/${listType}?page=${pageNumber}&size=${pageSize}`,
    method: "get",
  });
};

export const useFetchArchivedPublishedListsByListType = (
  listType,
  pageNumber,
  pageSize
) => {
  return useQuery({
    queryKey: [
      "fetch-archived-published-list-by-list-type",
      listType,
      pageNumber,
      pageSize,
    ],
    queryFn: () =>
      fetchArchivedPublishedListsByListType(listType, pageNumber, pageSize),
  });
};
