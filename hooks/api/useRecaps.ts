import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";
import { compact } from "lodash";

export const useGetRecaps = (params?: Record<string, any>) => {
  const axiosAuth = useAxiosAuth();

  const getRecaps = () => {
    return axiosAuth.get("/ledgers/recaps", {
      params,
    });
  };

  return useQuery({
    queryKey: compact(["fleets", "calendar"]),
    queryFn: getRecaps,
  });
};
