import { useInfiniteQuery } from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";
import { compact } from "lodash";

export const useGetRecaps = (params?: Record<string, any>) => {
  const axiosAuth = useAxiosAuth();

  const getRecaps = (pageParam = "1") => {
    return axiosAuth.get("/ledgers/recaps", {
      params: {
        ...params,
        page: pageParam,
      },
    });
  };

  return useInfiniteQuery({
    queryKey: compact(["fleets", "calendar"]),
    queryFn: ({ pageParam }) => getRecaps(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.data.pagination?.next_page,
  });
};
