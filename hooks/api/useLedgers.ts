import { compact } from "lodash";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import useAxiosAuth from "../axios/use-axios-auth";

const BASE_ENDPOINT = "/ledgers";

export const useGetRecaps = (params?: Record<string, any>) => {
  const axiosAuth = useAxiosAuth();

  const getRecaps = () => {
    return axiosAuth.get("/ledgers/recaps", {
      params,
    });
  };

  return useQuery({
    queryKey: compact(["ledgers", "recaps", params]),
    queryFn: getRecaps,
  });
};
