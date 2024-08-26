import { compact } from "lodash";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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

export const useGetLedgersFleet = (
  id: number,
  params: {
    page: number;
    limit: number;
  },
) => {
  const axiosAuth = useAxiosAuth();

  const getLedgersFleet = async () => {
    return axiosAuth.get(`${BASE_ENDPOINT}/fleet/${id}`, {
      params: {
        ...params,
        fleet_id: id,
      },
    });
  };

  return useQuery({
    queryKey: compact(["ledgers", "fleet", id, params]),
    queryFn: getLedgersFleet,
  });
};
