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
