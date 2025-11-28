import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Users Profile
const fetchYearRange = () => {
  return request({
    url: "/year-range",
    method: "get",
  });
};

export const useFetchYearRange = () => {
  return useQuery({
    queryKey: ["fetch-year-range"],
    queryFn: fetchYearRange,
    retry: 0,
  });
};
