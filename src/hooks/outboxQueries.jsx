//app-history/outbox

import { useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Outbox App History
const fetchOutboxAppHistory = () => {
  return request({
    url: "/app-history/outbox",
    method: "get",
  });
};

export const useFetchOutboxAppHistory = () => {
  return useQuery({
    queryKey: ["fetch-outbox-app-history"],
    queryFn: fetchOutboxAppHistory,
  });
};
