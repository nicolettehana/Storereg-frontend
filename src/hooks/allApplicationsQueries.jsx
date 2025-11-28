import { request } from "../components/utils/request";
import { useQuery } from "@tanstack/react-query";

// GET: Fetch Application History By App No.
const fetchApplicationHistoryByAppNo = (appNo) => {
  if (appNo === "" || appNo === undefined) return null;
  return request({
    url: `/app-history/${appNo}`,
    method: "get",
  });
};

export const useFetchApplicationHistoryByAppNo = (appNo) => {
  return useQuery({
    queryKey: ["fetch-application-history-by-app-no", appNo],
    queryFn: () => fetchApplicationHistoryByAppNo(appNo),
  });
};
