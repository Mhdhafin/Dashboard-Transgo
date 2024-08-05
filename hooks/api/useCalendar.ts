import { useInfiniteQuery } from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";
import { compact } from "lodash";

export const useGetCalendar = (params?: Record<string, any>) => {
  const axiosAuth = useAxiosAuth();

  const getCalendar = (pageParam = "1") => {
    return axiosAuth.get("/fleets/calendar", {
      params: {
        ...params,
        page: pageParam,
      },
    });
  };

  return useInfiniteQuery({
    queryKey: compact(["fleets", "calendar", params]),
    queryFn: ({ pageParam }) => getCalendar(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.data.pagination?.next_page,
  });
};
