import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Year Range
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

// GET: Units
const fetchUnits = () => {
  return request({
    url: "/unit",
    method: "get",
  });
};

export const useFetchUnits = () => {
  return useQuery({
    queryKey: ["fetch-units"],
    queryFn: fetchUnits,
    retry: 0,
  });
};

// GET: Category List
const fetchCategories = () => {
  return request({
    url: "/category",
    method: "get",
  });
};

export const useFetchCategories = () => {
  return useQuery({
    queryKey: ["fetch-categories"],
    queryFn: fetchCategories,
    retry: 0,
  });
};

// GET: Category Statistics
const fetchCategoryStats = () => {
  return request({
    url: "/category/stats",
    method: "get",
  });
};

export const useFetchCategoryStats = () => {
  return useQuery({
    queryKey: ["fetch-category-stats"],
    queryFn: fetchCategoryStats,
    retry: 0,
  });
};

// GET: Item Category Statistics
const fetchItemCategoryStats = () => {
  return request({
    url: "/items/stats",
    method: "get",
  });
};

export const useFetchItemCategoryStats = () => {
  return useQuery({
    queryKey: ["fetch-item-category-stats"],
    queryFn: fetchItemCategoryStats,
    retry: 0,
  });
};

// POST: Get Unit-Rate List based on purchase date and item/sub-item
const fetchUnitsRates = (data) => {
  return request({
    url: "/unit/rates",
    method: "post",
    data,
  });
};

export const useFetchUnitsRates = (onSuccess, onError) => {
  return useMutation({
    mutationFn: fetchUnitsRates,
    onSuccess,
    onError,
  });
};
