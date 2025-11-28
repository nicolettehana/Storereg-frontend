import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";
import Cookies from "js-cookie";

// const XSRF_TOKEN = Cookies.get("XSRF-TOKEN");

// POST: Mark As Vacated
const markAsVacated = (data) => {
  return request({
    url: "/vacate",
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useMarkAsVacated = (onSuccess, onError) => {
  return useMutation({
    mutationFn: markAsVacated,
    onSuccess,
    onError,
  });
};

// POST: Add Occupants
const addOccupants = (data) => {
  return request({
    url: "/occupants/add",
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useAddOccupants = (onSuccess, onError) => {
  return useMutation({
    mutationFn: addOccupants,
    onSuccess,
    onError,
  });
};

// POST: Create Quarter And Add Occupants
const createQuarterAndAddOccupants = (data) => {
  return request({
    url: "/occupants/add-quarter-occupant",
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useCreateQuarterAndAddOccupants = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createQuarterAndAddOccupants,
    onSuccess,
    onError,
  });
};

//  GET: Quarter Details By Quarter No
const fetchQuarterDetailsByQuarterNo = (quarterNo) => {
  return request({
    url: `/quarters/full-details/${quarterNo}`,
    method: "get",
  });
};

export const useFetchQuarterDetailsByQuarterNo = (quarterNo) => {
  return useQuery({
    queryKey: ["fetch-quarter-details-by-quarter-no", quarterNo],
    queryFn: () => fetchQuarterDetailsByQuarterNo(quarterNo),
  });
};
