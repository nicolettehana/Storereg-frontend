import { request } from "../components/utils/request";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

// const XSRF_TOKEN = Cookies.get("XSRF-TOKEN");

// GET: Fetch Quarter Types
const fetchQuarterTypes = () => {
  return request({
    url: "/quarter-types",
    method: "get",
  });
};

export const useFetchQuarterTypes = () => {
  return useQuery({
    queryKey: ["fetch-quarter-types"],
    queryFn: fetchQuarterTypes,
  });
};

// GET: Fetch Quarters By Type
const fetchQuartersByType = (
  type,
  search = "",
  pageNumber,
  pageSize,
  status
) => {
  return request({
    url: `/quarters${
      type ? `/${type}` : ""
    }?page=${pageNumber}&size=${pageSize}&status=${status}&search=${search}`,
    method: "get",
  });
};

export const useFetchQuartersByType = (
  type,
  search,
  pageNumber,
  pageSize,
  status
) => {
  return useQuery({
    queryKey: [
      "fetch-quarters-by-type",
      type,
      search,
      pageNumber,
      pageSize,
      status,
    ],
    queryFn: () =>
      fetchQuartersByType(type, search, pageNumber, pageSize, status),
  });
};

// GET: Fetch Pending Quarters Allotment
const fetchPendingQuartersAllotment = (search, pageNumber, pageSize) => {
  return request({
    url: `/quarters?page=${pageNumber}&size=${pageSize}&status=allotted&search=${search}`,
    method: "get",
  });
};

export const useFetchPendingQuartersAllotment = (
  search,
  pageNumber,
  pageSize
) => {
  return useQuery({
    queryKey: [
      "fetch-pending-quarters-allotment",
      search,
      pageNumber,
      pageSize,
    ],
    queryFn: () => fetchPendingQuartersAllotment(search, pageNumber, pageSize),
  });
};

// GET: Fetch Quarters
const fetchQuarters = (search, type, pageNumber, pageSize) => {
  return request({
    url: `/quarters?page=${pageNumber}&size=${pageSize}&status=occupied&search=${search}&type=${type}`,
    method: "get",
  });
};

export const useFetchQuartersByStatus = (
  search = "",
  type = "",
  pageNumber,
  pageSize
) => {
  return useQuery({
    queryKey: ["fetch-quarters", search, type, pageNumber, pageSize],
    queryFn: () => fetchQuarters(search, type, pageNumber, pageSize),
  });
};

// POST: Create Quarter
const createQuarter = (data) => {
  return request({
    url: "/quarters",
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useCreateQuarter = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createQuarter,
    onSuccess,
    onError,
  });
};

// POST: Update Quarter
const updateQuarter = (data) => {
  return request({
    url: `/quarters/${data.quarterNo}`,
    method: "put",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useUpdateQuarter = (onSuccess, onError) => {
  return useMutation({
    mutationFn: updateQuarter,
    onSuccess,
    onError,
  });
};

// POST: Enable/Disable Quarter
const enableDisableQuarter = (data) => {
  return request({
    url: `/quarters/enable-disable/${data.quarterNo}`,
    method: "put",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data: {
      status: data.status,
    },
  });
};

export const useEnableDisableQuarter = (onSuccess, onError) => {
  return useMutation({
    mutationFn: enableDisableQuarter,
    onSuccess,
    onError,
  });
};

// GET: Vacant and Reserved Quarters
const fetchVacantAndReservedQuarters = () => {
  return request({
    url: "/quarters/vacant-reserved",
    method: "get",
  });
};

export const useFetchVacantAndReservedQuarters = () => {
  return useQuery({
    queryKey: ["fetch-vacant-and-reserved-quarters"],
    queryFn: fetchVacantAndReservedQuarters,
  });
};

// GET: Quarter Stats
const fetchQuarterStats = () => {
  return request({
    url: "/quarters/stats",
    method: "get",
  });
};

export const useFetchQuarterStats = () => {
  return useQuery({
    queryKey: ["fetch-quarter-stats"],
    queryFn: fetchQuarterStats,
  });
};

// GET: Quarter Status
const fetchQuarterStatus = () => {
  return request({
    url: "/quarter-status",
    method: "get",
  });
};

export const useFetchQuarterStatus = () => {
  return useQuery({
    queryKey: ["fetch-quarter-status"],
    queryFn: fetchQuarterStatus,
  });
};

// GET: Departments
const fetchDepartments = () => {
  return request({
    url: "/departments",
    method: "get",
  });
};

export const useFetchDepartments = () => {
  return useQuery({
    queryKey: ["fetch-departments"],
    queryFn: fetchDepartments,
  });
};

// GET: Districts
const fetchDistricts = () => {
  return request({
    url: "/districts",
    method: "get",
  });
};

export const useFetchDistricts = () => {
  return useQuery({
    queryKey: ["fetch-districts"],
    queryFn: fetchDistricts,
  });
};

// GET: Blocks
const fetchBlocksByDistrictCode = ({ districtCode }) => {
  return request({
    url: `/blocks/${districtCode}`,
    method: "get",
  });
};

export const useFetchBlocksByDistrictCode = () => {
  return useMutation({
    mutationFn: fetchBlocksByDistrictCode,
    onSuccess: (response) => response,
    onError: (error) => error,
  });
};

// GET: Village
const fetchVillageByBlockCode = ({ blockCode }) => {
  return request({
    url: `/villages/${blockCode}`,
    method: "get",
  });
};

export const useFetchVillageByBlockCode = () => {
  return useMutation({
    mutationFn: fetchVillageByBlockCode,
    onSuccess: (response) => response,
    onError: (error) => error,
  });
};

// GET: Quarter Occupancy Status
const fetchQuarterOccupancyStatusByStatusCode = ({ quarterStatus }) => {
  return request({
    url: `/quarter-occupancy-status/${quarterStatus}`,
    method: "get",
  });
};

export const useFetchQuarterOccupancyStatusByStatusCode = () => {
  return useMutation({
    mutationFn: fetchQuarterOccupancyStatusByStatusCode,
    onSuccess: (response) => response,
    onError: (error) => error,
  });
};
