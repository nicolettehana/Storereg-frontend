import { useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";
import Cookies from "js-cookie";

// const XSRF_TOKEN = Cookies.get("XSRF-TOKEN");

// Get: Fetch Vacated Quarters
const fetchVacatedQuarters = (fromDate, toDate, pageNo, pageSize) => {
  return request({
    url: `/vacate/getVacated?page=${pageNo}&size=${pageSize}`,
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data: {
      fromDate,
      toDate,
    },
  });
};

export const useFetchVacatedQuarters = (fromDate, toDate, pageNo, pageSize) => {
  return useQuery({
    queryKey: ["fetch-vacated-quarters", fromDate, toDate, pageNo, pageSize],
    queryFn: () => fetchVacatedQuarters(fromDate, toDate, pageNo, pageSize),
  });
};
